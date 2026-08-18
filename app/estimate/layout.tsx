import AuthGuard from '@/components/AuthGuard'

export default function EstimateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div>
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">ALVB 견적 시스템</h1>
                </div>
                <div className="ml-6 flex space-x-8">
                  <a
                    href="/estimate"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    견적 작성
                  </a>
                  <a
                    href="/estimate/materials"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    자재 관리
                  </a>
                  <a
                    href="/estimate/history"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    견적 이력
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </div>
    </AuthGuard>
  )
}
