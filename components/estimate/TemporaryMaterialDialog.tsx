import type { MaterialUnit } from '@/lib/types/estimate'
import { isMaterialUnit } from '@/lib/estimate/validation'

export interface TemporaryMaterialDraft {
  name: string
  spec: string
  unit: MaterialUnit
  price: number
  quantity: number
}

interface TemporaryMaterialDialogProps {
  value: TemporaryMaterialDraft
  onChange: (value: TemporaryMaterialDraft) => void
  onCancel: () => void
  onAdd: () => void
}

const units: MaterialUnit[] = ['평', '㎡', 'm', 'EA', '톤', 'L', 'kg', '식', '개소']

export default function TemporaryMaterialDialog({ value, onChange, onCancel, onAdd }: TemporaryMaterialDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="temporary-material-title">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 id="temporary-material-title" className="mb-4 text-xl font-bold">DB에 없는 자재 추가</h2>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">자재명 *
            <input type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} placeholder="예: 특수 마감재" />
          </label>
          <label className="block text-sm font-medium text-gray-700">규격
            <input type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" value={value.spec} onChange={(event) => onChange({ ...value, spec: event.target.value })} placeholder="예: 1200x600" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">단위 *
              <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" value={value.unit} onChange={(event) => isMaterialUnit(event.target.value) && onChange({ ...value, unit: event.target.value })}>
                {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">단가 (원) *
              <input type="number" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" value={value.price || ''} onChange={(event) => onChange({ ...value, price: Number.parseInt(event.target.value) || 0 })} min="0" />
            </label>
          </div>
          <label className="block text-sm font-medium text-gray-700">수량 *
            <input type="number" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" value={value.quantity} onChange={(event) => onChange({ ...value, quantity: Number.parseFloat(event.target.value) || 1 })} min="0" step="0.1" />
          </label>
          <div className="flex justify-between rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-600">소계</span><span className="font-semibold">{(value.price * value.quantity).toLocaleString()}원</span></div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">취소</button>
          <button type="button" onClick={onAdd} className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">추가</button>
        </div>
      </div>
    </div>
  )
}
