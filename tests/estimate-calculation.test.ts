import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateEstimate, updateItemQuantity } from '../lib/estimate/calculation'
import { evaluateMaterialFormula } from '../lib/estimate/formula'
import { validateEstimatePayload } from '../lib/estimate/validation'
import type { EstimateItem } from '../lib/types/estimate'

const item: EstimateItem = {
  material_id: 'material-1',
  name: '바닥 타일',
  spec: '600×600',
  unit: '㎡',
  price: 30_000,
  quantity: 10,
  subtotal: 300_000,
}

test('견적 금액을 자재 단가와 수량에서 다시 계산한다', () => {
  const result = calculateEstimate({
    items: [{ ...item, subtotal: 1 }],
    laborCost: 100_000,
    etcCost: 50_000,
    marginRate: 20,
    pyeong: 10,
  })

  assert.equal(result.materialCost, 300_000)
  assert.equal(result.totalCost, 450_000)
  assert.equal(result.estimatePrice, 540_000)
  assert.equal(result.expectedProfit, 90_000)
  assert.equal(result.pricePerPyeong, 54_000)
})

test('수량 변경 시 소계를 함께 갱신한다', () => {
  assert.deepEqual(updateItemQuantity(item, 2.5), {
    ...item,
    quantity: 2.5,
    subtotal: 75_000,
  })
})

test('자재 수식은 숫자, 사칙연산, 괄호, p와 h만 처리한다', () => {
  assert.equal(evaluateMaterialFormula('(p * 3.3058) + (h * 2)', { p: 10, h: 3 }), 39.058)
  assert.equal(evaluateMaterialFormula('process.exit()', { p: 10, h: 3 }), 1)
  assert.equal(evaluateMaterialFormula('10 / 0', { p: 10, h: 3 }), 1)
})

test('서버 입력 검증은 조작된 소계를 단가와 수량으로 교정한다', () => {
  const result = validateEstimatePayload({
    site_name: '성수 카페',
    pyeong: 20,
    usage: '카페',
    height: '2.8',
    items: [{ ...item, subtotal: 1 }],
    labor_cost: 100_000,
    etc_cost: 0,
    margin_rate: 20,
    memo: '',
  })

  assert.equal(result.success, true)
  if (result.success) assert.equal(result.data.items[0].subtotal, 300_000)
})

test('음수 비용과 빈 자재 목록을 거부한다', () => {
  const result = validateEstimatePayload({
    site_name: '성수 카페',
    pyeong: 20,
    usage: '카페',
    items: [],
    labor_cost: -1,
    etc_cost: 0,
    margin_rate: 20,
  })

  assert.equal(result.success, false)
})
