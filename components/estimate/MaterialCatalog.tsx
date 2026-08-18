import type { Material, MaterialCategory } from '@/lib/types/estimate'

interface MaterialCatalogProps {
  materials: Material[]
  searchTerm: string
  categoryFilter: MaterialCategory | '전체'
  onSearchChange: (value: string) => void
  onCategoryChange: (value: MaterialCategory | '전체') => void
  onAdd: (material: Material) => void
  onOpenTemporaryMaterial: () => void
}

const categories: (MaterialCategory | '전체')[] = [
  '전체', '철거', '바닥', '벽체', '천장', '도장', '전기', '설비', '목공', '기타',
]

export default function MaterialCatalog({
  materials,
  searchTerm,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
  onAdd,
  onOpenTemporaryMaterial,
}: MaterialCatalogProps) {
  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">자재 검색 및 추가</h2>
        <button
          type="button"
          onClick={onOpenTemporaryMaterial}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700"
        >
          + DB에 없는 자재 추가
        </button>
      </div>

      <input
        type="search"
        aria-label="자재 검색"
        placeholder="자재명 또는 규격 검색..."
        className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
              categoryFilter === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="max-h-96 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              {['공종', '자재명', '규격', '단가', '단위', '추가'].map((heading) => (
                <th key={heading} className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {materials.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">검색 결과가 없습니다.</td></tr>
            ) : materials.map((material) => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="px-4 py-2"><span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">{material.category}</span></td>
                <td className="px-4 py-2 text-sm">{material.name}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{material.spec || '-'}</td>
                <td className="px-4 py-2 text-sm">{material.price.toLocaleString()}원</td>
                <td className="px-4 py-2 text-sm">{material.unit}</td>
                <td className="px-4 py-2 text-center">
                  <button type="button" onClick={() => onAdd(material)} className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700">추가</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
