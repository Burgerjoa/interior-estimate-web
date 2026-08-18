import type { EstimateItem } from '@/lib/types/estimate'

interface SelectedMaterialsProps {
  groups: Record<string, EstimateItem[]>
  count: number
  onQuantityChange: (materialId: string, quantity: number) => void
  onRemove: (materialId: string) => void
}

export default function SelectedMaterials({ groups, count, onQuantityChange, onRemove }: SelectedMaterialsProps) {
  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">선택된 자재 ({count}개)</h2>
      {count === 0 ? (
        <p className="py-8 text-center text-gray-500">자재를 추가하세요.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-2 rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700">{category}</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.material_id} className="flex flex-col gap-3 rounded-lg bg-gray-50 p-3 md:flex-row md:items-center">
                    <div className="grid flex-1 gap-3 md:grid-cols-4 md:items-center">
                      <div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-gray-500">{item.spec}</p></div>
                      <p className="text-sm text-gray-600">{item.price.toLocaleString()}원 / {item.unit}</p>
                      <label className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="sr-only">{item.name} 수량</span>
                        <input
                          type="number"
                          className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                          value={item.quantity}
                          onChange={(event) => onQuantityChange(item.material_id, Number.parseFloat(event.target.value) || 0)}
                          min="0"
                          step="0.1"
                        />
                        {item.unit}
                      </label>
                      <p className="text-right text-sm font-semibold">{item.subtotal.toLocaleString()}원</p>
                    </div>
                    <button type="button" onClick={() => onRemove(item.material_id)} className="text-sm text-red-600 hover:text-red-800">삭제</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
