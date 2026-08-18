'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocs() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => setSpec(data))
  }, [])

  return (
    <div className="min-h-screen">
      <div className="bg-theme-accent text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">ALVB Quotes API</h1>
          <p className="text-lg opacity-90">견적 관리 API 문서</p>
          <p className="text-sm opacity-75 mt-2">
            공개 조회와 견적 접수 API를 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {spec ? (
          <SwaggerUI spec={spec} />
        ) : (
          <div className="p-8 text-center text-theme-secondary">
            Loading API documentation...
          </div>
        )}
      </div>
    </div>
  )
}
