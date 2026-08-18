import type { EstimateCalculation } from '@/lib/types/estimate'

interface EstimateSummaryProps {
  calculation: EstimateCalculation
  laborCost: number
  etcCost: number
  marginRate: number
  canSave: boolean
  loading: boolean
  saveLabel?: string
  onLaborCostChange: (value: number) => void
  onEtcCostChange: (value: number) => void
  onMarginRateChange: (value: number) => void
  onSave: () => void
}

export default function EstimateSummary({
  calculation,
  laborCost,
  etcCost,
  marginRate,
  canSave,
  loading,
  saveLabel = '견적 저장',
  onLaborCostChange,
  onEtcCostChange,
  onMarginRateChange,
  onSave,
}: EstimateSummaryProps) {
  return (
    <aside className="rounded-lg bg-white p-6 shadow lg:sticky lg:top-8">
      <h2 className="mb-4 text-lg font-semibold">비용 계산</h2>
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-4 text-sm">
          <span className="text-gray-600">자재비</span>
          <span className="font-medium">{calculation.materialCost.toLocaleString()}원</span>
        </div>
        <label className="block text-sm font-medium text-gray-700">인건비
          <input type="number" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" value={laborCost || ''} onChange={(event) => onLaborCostChange(Number.parseInt(event.target.value) || 0)} min="0" />
        </label>
        <label className="block text-sm font-medium text-gray-700">기타비용
          <input type="number" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" value={etcCost || ''} onChange={(event) => onEtcCostChange(Number.parseInt(event.target.value) || 0)} min="0" />
        </label>
        <div className="flex justify-between border-t pt-4 text-sm"><span className="font-medium">총 원가</span><span className="text-lg font-semibold">{calculation.totalCost.toLocaleString()}원</span></div>
        <label className="block text-sm font-medium text-gray-700">마진율 (%)
          <input type="number" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" value={marginRate} onChange={(event) => onMarginRateChange(Number.parseFloat(event.target.value) || 0)} min="0" max="100" step="0.1" />
        </label>
        <div className="-mx-6 border-t bg-indigo-50 px-6 py-4">
          <div className="mb-2 flex justify-between"><span className="font-semibold">견적가</span><span className="text-xl font-bold text-indigo-600">{calculation.estimatePrice.toLocaleString()}원</span></div>
          <div className="mb-1 flex justify-between text-sm text-gray-600"><span>예상 이익</span><span className="font-medium text-green-600">{calculation.expectedProfit.toLocaleString()}원</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>평당 견적가</span><span className="font-medium">{calculation.pricePerPyeong.toLocaleString()}원</span></div>
        </div>
        <button type="button" onClick={onSave} disabled={!canSave || loading} className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? '저장 중...' : saveLabel}
        </button>
      </div>
    </aside>
  )
}
