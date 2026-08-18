'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
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

const DEMO_MATERIALS: Material[] = [
  { id: 'demo-floor-1', category: '바닥', name: '포세린 타일', spec: '600 × 600 mm', unit: '㎡', price: 52000, formula: 'p*3.3*1.1', created_at: '', updated_at: '' },
  { id: 'demo-wall-1', category: '벽체', name: '석고보드 이중벽', spec: '9.5T × 2PLY', unit: '㎡', price: 38000, formula: 'p*h*1.4', created_at: '', updated_at: '' },
  { id: 'demo-paint-1', category: '도장', name: '친환경 수성 페인트', spec: '내부 벽체용', unit: '㎡', price: 18000, formula: 'p*h*1.4', created_at: '', updated_at: '' },
  { id: 'demo-electric-1', category: '전기', name: 'LED 매입등', spec: '15W, 주광색', unit: 'EA', price: 45000, formula: 'p*0.8', created_at: '', updated_at: '' },
  { id: 'demo-carpentry-1', category: '목공', name: '맞춤 제작 카운터', spec: 'L 2400 mm', unit: '식', price: 1850000, formula: '1', created_at: '', updated_at: '' },
]

const initialItems: EstimateItem[] = DEMO_MATERIALS.slice(0, 2).map((material) => {
  const quantity = evaluateMaterialFormula(material.formula, { p: 20, h: 2.7 })
  return {
    material_id: material.id,
    name: material.name,
    spec: material.spec,
    unit: material.unit,
    price: material.price,
    quantity,
    subtotal: material.price * quantity,
  }
})

const emptyTemporaryMaterial: TemporaryMaterialDraft = {
  name: '',
  spec: '',
  unit: '평',
  price: 0,
  quantity: 1,
}

export default function EstimateDemoPage() {
  const [siteName, setSiteName] = useState('성수동 카페 리뉴얼')
  const [pyeong, setPyeong] = useState(20)
  const [usage, setUsage] = useState<EstimateUsage>('카페')
  const [height, setHeight] = useState('2.7')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | '전체'>('전체')
  const [selectedItems, setSelectedItems] = useState<EstimateItem[]>(initialItems)
  const [laborCost, setLaborCost] = useState(4200000)
  const [etcCost, setEtcCost] = useState(800000)
  const [marginRate, setMarginRate] = useState(20)
  const [temporaryMaterial, setTemporaryMaterial] = useState<TemporaryMaterialDraft | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const filteredMaterials = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    return DEMO_MATERIALS.filter((material) => {
      const matchesCategory = categoryFilter === '전체' || material.category === categoryFilter
      const matchesKeyword = !keyword || `${material.name} ${material.spec ?? ''}`.toLowerCase().includes(keyword)
      return matchesCategory && matchesKeyword
    })
  }, [categoryFilter, searchTerm])

  const calculation = useMemo(
    () => calculateEstimate({ items: selectedItems, laborCost, etcCost, marginRate, pyeong }),
    [selectedItems, laborCost, etcCost, marginRate, pyeong]
  )

  const groupedItems = useMemo(() => selectedItems.reduce<Record<string, EstimateItem[]>>((groups, item) => {
    const category = DEMO_MATERIALS.find((material) => material.id === item.material_id)?.category ?? '기타'
    groups[category] = [...(groups[category] ?? []), item]
    return groups
  }, {}), [selectedItems])

  const addMaterial = (material: Material) => {
    if (selectedItems.some((item) => item.material_id === material.id)) {
      setNotice('이미 견적에 포함된 자재입니다.')
      return
    }
    const quantity = evaluateMaterialFormula(material.formula, {
      p: pyeong,
      h: Number.parseFloat(height) || 0,
    })
    setSelectedItems((items) => [...items, {
      material_id: material.id,
      name: material.name,
      spec: material.spec,
      unit: material.unit,
      price: material.price,
      quantity,
      subtotal: material.price * quantity,
    }])
    setNotice(null)
  }

  const addTemporaryMaterial = () => {
    if (!temporaryMaterial?.name.trim() || temporaryMaterial.price <= 0) {
      setNotice('자재명과 단가를 입력하세요.')
      return
    }
    setSelectedItems((items) => [...items, {
      material_id: `demo-${crypto.randomUUID()}`,
      name: temporaryMaterial.name.trim(),
      spec: temporaryMaterial.spec.trim() || null,
      unit: temporaryMaterial.unit,
      price: temporaryMaterial.price,
      quantity: temporaryMaterial.quantity,
      subtotal: temporaryMaterial.price * temporaryMaterial.quantity,
    }])
    setTemporaryMaterial(null)
    setNotice(null)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Interactive Demo</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">내부 견적 시스템 데모</h1>
            <p className="mt-1 text-sm text-gray-600">예시 자재로 원가와 마진 계산 흐름을 체험할 수 있습니다. 입력값은 저장되지 않습니다.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">회사 화면으로 돌아가기 →</Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {notice && <div role="status" className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">{notice}</div>}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ProjectDetailsCard siteName={siteName} pyeong={pyeong} squareMeter={calculation.squareMeter} usage={usage} height={height} onSiteNameChange={setSiteName} onPyeongChange={setPyeong} onUsageChange={setUsage} onHeightChange={setHeight} />
            <MaterialCatalog materials={filteredMaterials} searchTerm={searchTerm} categoryFilter={categoryFilter} onSearchChange={setSearchTerm} onCategoryChange={setCategoryFilter} onAdd={addMaterial} onOpenTemporaryMaterial={() => setTemporaryMaterial({ ...emptyTemporaryMaterial })} />
            <SelectedMaterials groups={groupedItems} count={selectedItems.length} onQuantityChange={(materialId, quantity) => setSelectedItems((items) => items.map((item) => item.material_id === materialId ? updateItemQuantity(item, quantity) : item))} onRemove={(materialId) => setSelectedItems((items) => items.filter((item) => item.material_id !== materialId))} />
          </div>
          <EstimateSummary calculation={calculation} laborCost={laborCost} etcCost={etcCost} marginRate={marginRate} canSave={selectedItems.length > 0} loading={false} saveLabel="계산 결과 확인" onLaborCostChange={setLaborCost} onEtcCostChange={setEtcCost} onMarginRateChange={setMarginRate} onSave={() => setNotice(`예상 견적가는 ${calculation.estimatePrice.toLocaleString()}원입니다. 데모에서는 저장하지 않습니다.`)} />
        </div>
      </div>

      {temporaryMaterial && <TemporaryMaterialDialog value={temporaryMaterial} onChange={setTemporaryMaterial} onCancel={() => setTemporaryMaterial(null)} onAdd={addTemporaryMaterial} />}
    </main>
  )
}
