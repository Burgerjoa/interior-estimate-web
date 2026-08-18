'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Estimate, EstimateUsage } from '@/lib/types/estimate'

const USAGE_OPTIONS: (EstimateUsage | '전체')[] = [
  '전체',
  '카페',
  '식당',
  '사무실',
  '매장',
  '병원',
  '학원',
  '기타',
]

export default function EstimateHistoryPage() {
  const router = useRouter()
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [usage, setUsage] = useState<EstimateUsage | '전체'>('전체')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const fetchEstimates = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (usage !== '전체') params.append('usage', usage)
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)

      const response = await fetch(`/api/estimates?${params}`)
      if (!response.ok) throw new Error('Failed to fetch estimates')

      const data = await response.json()
      setEstimates(data)
      setNotice(null)
    } catch (error) {
      console.error('Error fetching estimates:', error)
      setNotice('견적 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [endDate, search, startDate, usage])

  useEffect(() => {
    void fetchEstimates()
  }, [fetchEstimates])

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/estimates/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete estimate')

      await fetchEstimates()
      setSelectedEstimate(null)
    } catch (error) {
      console.error('Error deleting estimate:', error)
      setNotice('견적을 삭제하지 못했습니다.')
    }
  }

  const viewDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/estimates/${id}`)
      if (!response.ok) throw new Error('Failed to fetch estimate')

      const data = await response.json()
      setSelectedEstimate(data)
    } catch (error) {
      console.error('Error fetching estimate:', error)
      setNotice('견적 상세를 불러오지 못했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">견적 이력</h1>
            <p className="mt-2 text-gray-600">작성한 견적 목록 및 상세 조회</p>
          </div>
          <button
            onClick={() => router.push('/estimate')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + 새 견적 작성
          </button>
        </div>

        {notice && (
          <div role="status" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {notice}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                현장명 검색
              </label>
              <input
                type="text"
                placeholder="현장명 검색..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">용도</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={usage}
                onChange={(e) => setUsage(e.target.value as EstimateUsage | '전체')}
              >
                {USAGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작일
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료일
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Estimates Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : estimates.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              견적이 없습니다. 새로운 견적을 작성하세요.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      작성일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      현장명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      용도
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      평형
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      총 원가
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      견적가
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      마진율
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {estimates.map((estimate) => (
                    <tr
                      key={estimate.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => viewDetail(estimate.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(estimate.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {estimate.site_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                          {estimate.usage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {estimate.pyeong}평
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {estimate.total_cost.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                        {estimate.estimate_price.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {estimate.margin_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(estimate.id)
                          }}
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

      {/* Detail Modal */}
      {selectedEstimate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEstimate(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedEstimate.site_name}</h2>
              <button
                onClick={() => setSelectedEstimate(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 공간 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">공간 정보</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-500">용도</div>
                    <div className="font-medium">{selectedEstimate.usage}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">평형</div>
                    <div className="font-medium">
                      {selectedEstimate.pyeong}평 ({(selectedEstimate.pyeong * 3.3058).toFixed(1)}
                      ㎡)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">층고</div>
                    <div className="font-medium">{selectedEstimate.height || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">작성일</div>
                    <div className="font-medium">{formatDate(selectedEstimate.created_at)}</div>
                  </div>
                </div>
              </div>

              {/* 선택된 자재 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">자재 목록</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          자재명
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          규격
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          단가
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          수량
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          소계
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedEstimate.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{item.spec || '-'}</td>
                          <td className="px-4 py-2 text-sm">
                            {item.price.toLocaleString()}원 / {item.unit}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-medium">
                            {item.subtotal.toLocaleString()}원
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 비용 계산 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">비용 계산</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">자재비</span>
                    <span className="font-medium">
                      {selectedEstimate.items
                        .reduce((sum, item) => sum + item.subtotal, 0)
                        .toLocaleString()}
                      원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">인건비</span>
                    <span className="font-medium">
                      {selectedEstimate.labor_cost.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">기타비용</span>
                    <span className="font-medium">
                      {selectedEstimate.etc_cost.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-semibold">총 원가</span>
                    <span className="font-semibold text-lg">
                      {selectedEstimate.total_cost.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">마진율</span>
                    <span className="font-medium">{selectedEstimate.margin_rate}%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 bg-indigo-50 -mx-4 px-4 py-2 rounded">
                    <span className="font-bold">견적가</span>
                    <span className="font-bold text-xl text-indigo-600">
                      {selectedEstimate.estimate_price.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">예상 이익</span>
                    <span className="font-medium text-green-600">
                      {(selectedEstimate.estimate_price - selectedEstimate.total_cost).toLocaleString()}
                      원
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">평당 견적가</span>
                    <span className="font-medium">
                      {Math.round(selectedEstimate.estimate_price / selectedEstimate.pyeong).toLocaleString()}
                      원/평
                    </span>
                  </div>
                </div>
              </div>

              {/* 메모 */}
              {selectedEstimate.memo && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">메모</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap">
                    {selectedEstimate.memo}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
