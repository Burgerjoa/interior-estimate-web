import type { EstimateCalculation, EstimateItem } from '@/lib/types/estimate'

interface CalculationInput {
  items: EstimateItem[]
  laborCost: number
  etcCost: number
  marginRate: number
  pyeong: number
}

const nonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0

export function calculateEstimate({
  items,
  laborCost,
  etcCost,
  marginRate,
  pyeong,
}: CalculationInput): EstimateCalculation {
  const materialCost = items.reduce(
    (sum, item) => sum + nonNegative(item.price) * nonNegative(item.quantity),
    0
  )
  const safeLaborCost = nonNegative(laborCost)
  const safeEtcCost = nonNegative(etcCost)
  const safeMarginRate = nonNegative(marginRate)
  const totalCost = materialCost + safeLaborCost + safeEtcCost
  const estimatePrice = Math.round(totalCost * (1 + safeMarginRate / 100))
  const safePyeong = nonNegative(pyeong)

  return {
    materialCost,
    laborCost: safeLaborCost,
    etcCost: safeEtcCost,
    totalCost,
    marginRate: safeMarginRate,
    estimatePrice,
    expectedProfit: estimatePrice - totalCost,
    pricePerPyeong: safePyeong > 0 ? Math.round(estimatePrice / safePyeong) : 0,
    squareMeter: safePyeong * 3.3058,
  }
}

export function updateItemQuantity(item: EstimateItem, quantity: number): EstimateItem {
  const safeQuantity = nonNegative(quantity)
  return {
    ...item,
    quantity: safeQuantity,
    subtotal: nonNegative(item.price) * safeQuantity,
  }
}
