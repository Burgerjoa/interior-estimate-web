'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import EstimateSummary from '@/components/estimate/EstimateSummary'
import MaterialCatalog from '@/components/estimate/MaterialCatalog'
import ProjectDetailsCard from '@/components/estimate/ProjectDetailsCard'
import SelectedMaterials from '@/components/estimate/SelectedMaterials'
import TemporaryMaterialDialog, {
  type TemporaryMaterialDraft,
} from '@/components/estimate/TemporaryMaterialDialog'
import { calculateEstimate, updateItemQuantity } from '@/lib/estimate/calculation'
import { evaluateMaterialFormula } from '@/lib/estimate/formula'
import type {
  EstimateItem,
  EstimateUsage,
  Material,
  MaterialCategory,
} from '@/lib/types/estimate'

interface Notice {
  type: 'error' | 'info'
  message: string
}

const emptyTemporaryMaterial: TemporaryMaterialDraft = {
  name: '',
  spec: '',
  unit: '평',
  price: 0,
  quantity: 1,
}

export default function EstimatePage() {
  const router = useRouter()
  const [siteName, setSiteName] = useState('')
  const [pyeong, setPyeong] = useState(0)
  const [usage, setUsage] = useState<EstimateUsage>('카페')
  const [height, setHeight] = useState('')
  const [materials, setMaterials] = useState<Material[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | '전체'>('전체')
  const [selectedItems, setSelectedItems] = useState<EstimateItem[]>([])
  const [laborCost, setLaborCost] = useState(0)
  const [etcCost, setEtcCost] = useState(0)
  const [marginRate, setMarginRate] = useState(20)
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [temporaryMaterial, setTemporaryMaterial] = useState<TemporaryMaterialDraft | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        if (categoryFilter !== '전체') params.set('category', categoryFilter)
        if (searchTerm) params.set('search', searchTerm)

        const response = await fetch(`/api/materials?${params}`, { signal: controller.signal })
        if (!response.ok) throw new Error('자재 목록 요청에 실패했습니다.')
        setMaterials((await response.json()) as Material[])
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setNotice({ type: 'error', message: '자재 목록을 불러오지 못했습니다.' })
      }
    }, 300)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [searchTerm, categoryFilter])

  const calculation = useMemo(
    () => calculateEstimate({ items: selectedItems, laborCost, etcCost, marginRate, pyeong }),
    [selectedItems, laborCost, etcCost, marginRate, pyeong]
  )

  const groupedItems = useMemo(() => {
    return selectedItems.reduce<Record<string, EstimateItem[]>>((groups, item) => {
      const category = materials.find((material) => material.id === item.material_id)?.category ?? '기타'
      groups[category] = [...(groups[category] ?? []), item]
      return groups
    }, {})
  }, [selectedItems, materials])

  const addMaterial = (material: Material) => {
    if (selectedItems.some((item) => item.material_id === material.id)) {
      setNotice({ type: 'error', message: '이미 추가된 자재입니다.' })
      return
    }

    const quantity = evaluateMaterialFormula(material.formula, {
      p: pyeong,
      h: Number.parseFloat(height) || 0,
    })
    setSelectedItems((items) => [
      ...items,
      {
        material_id: material.id,
        name: material.name,
        spec: material.spec,
        unit: material.unit,
        price: material.price,
        quantity,
        subtotal: material.price * quantity,
      },
    ])
    setNotice(null)
  }

  const addTemporaryMaterial = () => {
    if (!temporaryMaterial?.name.trim() || temporaryMaterial.price <= 0) {
      setNotice({ type: 'error', message: '자재명과 단가를 입력하세요.' })
      return
    }

    setSelectedItems((items) => [
      ...items,
      {
        material_id: `temp-${crypto.randomUUID()}`,
        name: temporaryMaterial.name.trim(),
        spec: temporaryMaterial.spec.trim() || null,
        unit: temporaryMaterial.unit,
        price: temporaryMaterial.price,
        quantity: temporaryMaterial.quantity,
        subtotal: temporaryMaterial.price * temporaryMaterial.quantity,
      },
    ])
    setTemporaryMaterial(null)
    setNotice(null)
  }

  const saveEstimate = async () => {
    if (!siteName.trim() || pyeong <= 0) {
      setNotice({ type: 'error', message: '현장명과 평형을 입력하세요.' })
      return
    }
    if (selectedItems.length === 0) {
      setNotice({ type: 'error', message: '최소 하나의 자재를 추가하세요.' })
      return
    }

    setLoading(true)
    setNotice({ type: 'info', message: '견적을 저장하고 있습니다.' })
    try {
      const response = await fetch('/api/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_name: siteName,
          pyeong,
          usage,
          height,
          items: selectedItems,
          labor_cost: laborCost,
          etc_cost: etcCost,
          margin_rate: marginRate,
          memo,
        }),
      })

      const result = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(result.error || '견적 저장에 실패했습니다.')
      router.push('/estimate/history')
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : '견적 저장에 실패했습니다.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">견적 작성</h1>
          <p className="mt-2 text-gray-600">내부용 원가 계산 및 견적가 산출</p>
        </header>

        {notice && (
          <div role="status" className={`mb-6 rounded-lg border px-4 py-3 text-sm ${notice.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
            {notice.message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ProjectDetailsCard
              siteName={siteName}
              pyeong={pyeong}
              squareMeter={calculation.squareMeter}
              usage={usage}
              height={height}
              onSiteNameChange={setSiteName}
              onPyeongChange={setPyeong}
              onUsageChange={setUsage}
              onHeightChange={setHeight}
            />
            <MaterialCatalog
              materials={materials}
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              onSearchChange={setSearchTerm}
              onCategoryChange={setCategoryFilter}
              onAdd={addMaterial}
              onOpenTemporaryMaterial={() => setTemporaryMaterial({ ...emptyTemporaryMaterial })}
            />
            <SelectedMaterials
              groups={groupedItems}
              count={selectedItems.length}
              onQuantityChange={(materialId, quantity) => setSelectedItems((items) => items.map((item) => item.material_id === materialId ? updateItemQuantity(item, quantity) : item))}
              onRemove={(materialId) => setSelectedItems((items) => items.filter((item) => item.material_id !== materialId))}
            />
            <section className="rounded-lg bg-white p-6 shadow">
              <label className="block text-lg font-semibold">메모
                <textarea className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-base font-normal focus:ring-2 focus:ring-indigo-500" rows={4} value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="추가 메모사항을 입력하세요..." />
              </label>
            </section>
          </div>
          <EstimateSummary
            calculation={calculation}
            laborCost={laborCost}
            etcCost={etcCost}
            marginRate={marginRate}
            canSave={Boolean(siteName.trim()) && pyeong > 0 && selectedItems.length > 0}
            loading={loading}
            onLaborCostChange={setLaborCost}
            onEtcCostChange={setEtcCost}
            onMarginRateChange={setMarginRate}
            onSave={saveEstimate}
          />
        </div>
      </div>

      {temporaryMaterial && (
        <TemporaryMaterialDialog
          value={temporaryMaterial}
          onChange={setTemporaryMaterial}
          onCancel={() => setTemporaryMaterial(null)}
          onAdd={addTemporaryMaterial}
        />
      )}
    </div>
  )
}
