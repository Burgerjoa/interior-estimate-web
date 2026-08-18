import type { EstimateUsage } from '@/lib/types/estimate'

interface ProjectDetailsCardProps {
  siteName: string
  pyeong: number
  squareMeter: number
  usage: EstimateUsage
  height: string
  onSiteNameChange: (value: string) => void
  onPyeongChange: (value: number) => void
  onUsageChange: (value: EstimateUsage) => void
  onHeightChange: (value: string) => void
}

const usageOptions: EstimateUsage[] = ['카페', '식당', '사무실', '매장', '병원', '학원', '기타']

export default function ProjectDetailsCard({
  siteName,
  pyeong,
  squareMeter,
  usage,
  height,
  onSiteNameChange,
  onPyeongChange,
  onUsageChange,
  onHeightChange,
}: ProjectDetailsCardProps) {
  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">공간 정보</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          현장명 *
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            value={siteName}
            onChange={(event) => onSiteNameChange(event.target.value)}
            placeholder="예: 강남역 카페"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          평형 * {pyeong > 0 && `(${squareMeter.toFixed(1)}㎡)`}
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            value={pyeong || ''}
            onChange={(event) => onPyeongChange(Number.parseFloat(event.target.value) || 0)}
            placeholder="예: 30"
            min="0"
            step="0.1"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          용도
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            value={usage}
            onChange={(event) => onUsageChange(event.target.value as EstimateUsage)}
          >
            {usageOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          층고
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            value={height}
            onChange={(event) => onHeightChange(event.target.value)}
            placeholder="예: 2.8m"
          />
        </label>
      </div>
    </section>
  )
}
