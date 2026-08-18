'use client'

import { useCallback, useEffect, useState } from 'react'
import { Material, MaterialCategory, MaterialFormData } from '@/lib/types/estimate'
import { isMaterialUnit } from '@/lib/estimate/validation'

const CATEGORIES: (MaterialCategory | '전체')[] = [
  '전체',
  '철거',
  '바닥',
  '벽체',
  '천장',
  '도장',
  '전기',
  '설비',
  '목공',
  '기타',
]

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<MaterialCategory | '전체'>('전체')
  const [showModal, setShowModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [formData, setFormData] = useState<MaterialFormData>({
    category: '철거',
    name: '',
    spec: '',
    unit: '평',
    price: 0,
    formula: '',
  })

  const fetchMaterials = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (category !== '전체') params.append('category', category)
      if (search) params.append('search', search)

      const response = await fetch(`/api/materials?${params}`)
      if (!response.ok) throw new Error('Failed to fetch materials')

      const data = await response.json()
      setMaterials(data)
      setNotice(null)
    } catch (error) {
      console.error('Error fetching materials:', error)
      setNotice('자재 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [category, search])

  useEffect(() => {
    void fetchMaterials()
  }, [fetchMaterials])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingMaterial
        ? `/api/materials/${editingMaterial.id}`
        : '/api/materials'
      const method = editingMaterial ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save material')
      }

      setShowModal(false)
      setEditingMaterial(null)
      setFormData({
        category: '철거',
        name: '',
        spec: '',
        unit: '평',
        price: 0,
        formula: '',
      })
      await fetchMaterials()
    } catch (error) {
      console.error('Error saving material:', error)
      setNotice('자재를 저장하지 못했습니다.')
    }
  }

  const handleEdit = (material: Material) => {
    setEditingMaterial(material)
    setFormData({
      category: material.category,
      name: material.name,
      spec: material.spec || '',
      unit: material.unit,
      price: material.price,
      formula: material.formula || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete material')

      await fetchMaterials()
    } catch (error) {
      console.error('Error deleting material:', error)
      setNotice('자재를 삭제하지 못했습니다.')
    }
  }

  const openAddModal = () => {
    setEditingMaterial(null)
    setFormData({
      category: '철거',
      name: '',
      spec: '',
      unit: '평',
      price: 0,
      formula: '',
    })
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">자재 관리</h1>
          <p className="mt-2 text-gray-600">인테리어 자재 데이터베이스</p>
        </div>

        {notice && (
          <div role="status" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {notice}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="자재명 또는 규격 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={openAddModal}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + 자재 추가
            </button>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : materials.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              자재가 없습니다. 새로운 자재를 추가하세요.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      공종
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      자재명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      규격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      단위
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      단가
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      계산식
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {materials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {material.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {material.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.spec || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {material.price.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.formula ? (
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">{material.formula}</code>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(material)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingMaterial ? '자재 수정' : '자재 추가'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    공종
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as MaterialCategory })
                    }
                    required
                  >
                    {CATEGORIES.filter((c) => c !== '전체').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    자재명 *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    규격
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.spec}
                    onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    단위
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.unit}
                    onChange={(e) => {
                      if (isMaterialUnit(e.target.value)) {
                        setFormData({ ...formData, unit: e.target.value })
                      }
                    }}
                    required
                  >
                    <option value="평">평</option>
                    <option value="㎡">㎡</option>
                    <option value="m">m</option>
                    <option value="EA">EA</option>
                    <option value="톤">톤</option>
                    <option value="L">L</option>
                    <option value="kg">kg</option>
                    <option value="식">식</option>
                    <option value="개소">개소</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    단가 (원)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                    }
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    수량 계산식 (선택사항)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                    placeholder="예: p*3.3 또는 p*h*0.5"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    p = 평수, h = 층고 (미터). 예: <code>p*3.3</code> (평을 제곱미터로), <code>p*h</code> (평×층고)
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingMaterial ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
