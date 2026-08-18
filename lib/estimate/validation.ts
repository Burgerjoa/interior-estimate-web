import type { EstimateItem, EstimateSaveInput, EstimateUsage, MaterialUnit } from '@/lib/types/estimate'

const usages: EstimateUsage[] = ['카페', '식당', '사무실', '매장', '병원', '학원', '기타']
const units: MaterialUnit[] = ['㎡', 'm', 'EA', '톤', 'L', 'kg', '식', '개소', 'm²', 'm³', '평']

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isFiniteNonNegative = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

export function isMaterialUnit(value: string): value is MaterialUnit {
  return units.includes(value as MaterialUnit)
}

function parseEstimateItem(value: unknown): EstimateItem | null {
  if (!isRecord(value)) return null
  if (
    typeof value.material_id !== 'string' ||
    typeof value.name !== 'string' ||
    !(value.spec === null || typeof value.spec === 'string') ||
    typeof value.unit !== 'string' ||
    !isMaterialUnit(value.unit) ||
    !isFiniteNonNegative(value.price) ||
    !isFiniteNonNegative(value.quantity)
  ) {
    return null
  }

  return {
    material_id: value.material_id,
    name: value.name,
    spec: value.spec,
    unit: value.unit,
    price: value.price,
    quantity: value.quantity,
    subtotal: value.price * value.quantity,
  }
}

export type EstimateValidationResult =
  | { success: true; data: EstimateSaveInput }
  | { success: false; error: string }

export function validateEstimatePayload(value: unknown): EstimateValidationResult {
  if (!isRecord(value)) return { success: false, error: '요청 형식이 올바르지 않습니다.' }

  const items = Array.isArray(value.items)
    ? value.items.map(parseEstimateItem)
    : []

  if (typeof value.site_name !== 'string' || !value.site_name.trim()) {
    return { success: false, error: '현장명을 입력해주세요.' }
  }
  if (!isFiniteNonNegative(value.pyeong) || value.pyeong <= 0) {
    return { success: false, error: '평형은 0보다 커야 합니다.' }
  }
  if (typeof value.usage !== 'string' || !usages.includes(value.usage as EstimateUsage)) {
    return { success: false, error: '지원하지 않는 공간 용도입니다.' }
  }
  if (items.length === 0 || items.some((item) => item === null)) {
    return { success: false, error: '유효한 자재를 하나 이상 추가해주세요.' }
  }
  if (!isFiniteNonNegative(value.labor_cost) || !isFiniteNonNegative(value.etc_cost)) {
    return { success: false, error: '비용은 0 이상의 숫자여야 합니다.' }
  }
  if (!isFiniteNonNegative(value.margin_rate) || value.margin_rate > 100) {
    return { success: false, error: '마진율은 0에서 100 사이여야 합니다.' }
  }

  return {
    success: true,
    data: {
      site_name: value.site_name.trim(),
      pyeong: value.pyeong,
      usage: value.usage as EstimateUsage,
      height: typeof value.height === 'string' ? value.height : '',
      items: items as EstimateItem[],
      labor_cost: value.labor_cost,
      etc_cost: value.etc_cost,
      margin_rate: value.margin_rate,
      memo: typeof value.memo === 'string' ? value.memo : '',
    },
  }
}
