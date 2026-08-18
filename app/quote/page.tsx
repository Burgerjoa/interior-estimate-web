'use client'

import { useCallback, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface QuoteData {
  id: string
  business_type: string
  project_type: string
  area: string
  budget: string
  location: string
  created_at: string
  updated_at: string
}

export default function Quote() {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list')
  const [quotes, setQuotes] = useState<QuoteData[]>([])
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    business_type: '',
    project_type: '',
    area: '',
    budget: '',
    location: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
  })

  const fetchQuotes = useCallback(async () => {
    try {
      const response = await fetch('/api/quotes')
      if (response.ok) {
        const data = await response.json()
        setQuotes(data)
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create quote')
      }

      await fetchQuotes()
      setNotice({ type: 'success', message: '견적 요청이 등록되었습니다.' })

      // 초기화
      setFormData({
        name: '',
        phone: '',
        email: '',
        business_type: '',
        project_type: '',
        area: '',
        budget: '',
        location: '',
        preferred_date: '',
        preferred_time: '',
        message: '',
      })
      setSelectedQuote(null)
      setView('list')
    } catch (error) {
      console.error('Failed to submit quote:', error)
      setNotice({ type: 'error', message: '견적 요청을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.' })
    }
  }

  const handleViewDetail = (quote: QuoteData) => {
    setSelectedQuote(quote)
    setView('detail')
  }

  useEffect(() => {
    void fetchQuotes()
  }, [fetchQuotes])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {notice && (
        <div role="status" className={`fixed right-6 top-24 z-50 max-w-sm border px-5 py-4 text-sm shadow-lg ${notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {notice.message}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 inline-block">
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-theme-secondary">Online Quote</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-theme-primary">
              온라인 견적
            </h1>
            <p className="text-lg md:text-xl text-theme-secondary max-w-3xl mx-auto leading-relaxed font-light">
              프로젝트의 기본 정보를 남겨주시면 상담에 필요한 내용을 확인할 수 있습니다
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 border-t border-theme-accent-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* View: List */}
          {view === 'list' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-theme-primary tracking-tight">
                  공개 견적 사례 ({quotes.length})
                </h2>
                <button
                  onClick={() => {
                    setSelectedQuote(null)
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      business_type: '',
                      project_type: '',
                      area: '',
                      budget: '',
                      location: '',
                      preferred_date: '',
                      preferred_time: '',
                      message: '',
                    })
                    setView('create')
                  }}
                  className="bg-theme-accent text-white px-6 py-3 text-sm font-medium tracking-wide hover:opacity-90 transition-all duration-300"
                >
                  견적 신청하기
                </button>
              </div>

              {loading ? (
                <div className="border-2 border-theme-accent-20 bg-theme-accent-5 rounded-xl p-12 text-center">
                  <p className="text-theme-secondary text-lg">로딩 중...</p>
                </div>
              ) : quotes.length === 0 ? (
                <div className="border-2 border-theme-accent-20 bg-theme-accent-5 rounded-xl p-12 text-center">
                  <p className="text-theme-secondary text-lg">등록된 공개 견적 사례가 없습니다.</p>
                  <p className="text-theme-secondary text-sm mt-2">새 견적은 신청하기 버튼에서 접수할 수 있습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 테이블 헤더 */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-2 border-theme-accent-20 bg-theme-accent-5 font-medium text-sm text-theme-secondary">
                    <div className="col-span-1 text-center">번호</div>
                    <div className="col-span-2">업종</div>
                    <div className="col-span-4">제목</div>
                    <div className="col-span-2">위치</div>
                    <div className="col-span-2">평수</div>
                    <div className="col-span-1 text-center">날짜</div>
                  </div>

                  {/* 게시글 목록 */}
                  {quotes.map((quote, index) => (
                    <div
                      key={quote.id}
                      className="group border-2 border-theme-accent-20 hover:border-theme-accent-30 bg-theme-accent-5 backdrop-blur-sm transition-all duration-300 cursor-pointer"
                      onClick={() => handleViewDetail(quote)}
                    >
                      {/* 데스크톱 뷰 */}
                      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center">
                        <div className="col-span-1 text-center text-theme-secondary text-sm">
                          {quotes.length - index}
                        </div>
                        <div className="col-span-2">
                          <span className="bg-theme-accent text-white px-3 py-1 text-xs font-medium tracking-wide">
                            {quote.business_type}
                          </span>
                        </div>
                        <div className="col-span-4">
                          <h3 className="text-base font-bold text-theme-primary tracking-tight group-hover:text-theme-accent transition-colors">
                            {quote.project_type} - {quote.business_type} 인테리어
                          </h3>
                        </div>
                        <div className="col-span-2 text-theme-secondary text-sm">
                          {quote.location}
                        </div>
                        <div className="col-span-2 text-theme-secondary text-sm">
                          {quote.area}
                        </div>
                        <div className="col-span-1 text-center text-theme-secondary text-xs">
                          {formatDateShort(quote.created_at)}
                        </div>
                      </div>

                      {/* 모바일 뷰 */}
                      <div className="md:hidden p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-theme-secondary text-sm">#{quotes.length - index}</span>
                            <span className="bg-theme-accent text-white px-2 py-0.5 text-xs font-medium tracking-wide">
                              {quote.business_type}
                            </span>
                          </div>
                          <span className="text-theme-secondary text-xs">
                            {formatDateShort(quote.created_at)}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-theme-primary tracking-tight mb-2">
                          {quote.project_type} - {quote.business_type} 인테리어
                        </h3>
                        <div className="flex gap-4 text-theme-secondary text-sm">
                          <span>{quote.location}</span>
                          <span>{quote.area}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View: Create */}
          {view === 'create' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-theme-primary tracking-tight">
                  견적 신청하기
                </h2>
                <button
                  onClick={() => setView('list')}
                  className="border-2 border-theme-accent-20 text-theme-secondary px-6 py-3 text-sm font-medium tracking-wide hover:border-theme-accent-30 bg-theme-accent-5 transition-all duration-300"
                >
                  목록으로
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Info */}
                <div className="border-2 border-theme-accent-20 bg-theme-accent-5 backdrop-blur-sm rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-theme-primary tracking-tight">연락처 정보</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-theme-secondary mb-2">
                        이름 *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                        placeholder="홍길동"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-theme-secondary mb-2">
                        연락처 *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                        placeholder="010-1234-5678"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-theme-secondary mb-2">
                        이메일 *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="border-2 border-theme-accent-20 bg-theme-accent-5 backdrop-blur-sm rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-theme-primary tracking-tight">프로젝트 정보</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="business_type" className="block text-sm font-medium text-theme-secondary mb-2">
                        업종 *
                      </label>
                      <select
                        id="business_type"
                        name="business_type"
                        required
                        value={formData.business_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                      >
                        <option value="">선택해주세요</option>
                        <option value="카페">카페</option>
                        <option value="레스토랑">레스토랑</option>
                        <option value="리테일">리테일/샵</option>
                        <option value="오피스">오피스</option>
                        <option value="뷰티">뷰티/살롱</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="project_type" className="block text-sm font-medium text-theme-secondary mb-2">
                        인테리어 범위 *
                      </label>
                      <select
                        id="project_type"
                        name="project_type"
                        required
                        value={formData.project_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                      >
                        <option value="">선택해주세요</option>
                        <option value="풀인테리어">풀인테리어 (전체)</option>
                        <option value="부분인테리어">부분인테리어</option>
                        <option value="리모델링">리모델링</option>
                        <option value="상담필요">상담 후 결정</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="area" className="block text-sm font-medium text-theme-secondary mb-2">
                        평수 *
                      </label>
                      <input
                        type="text"
                        id="area"
                        name="area"
                        required
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                        placeholder="예: 30평"
                      />
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-theme-secondary mb-2">
                        예산
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                      >
                        <option value="">선택해주세요</option>
                        <option value="3000만원 이하">3,000만원 이하</option>
                        <option value="3000-5000만원">3,000만원 - 5,000만원</option>
                        <option value="5000-1억원">5,000만원 - 1억원</option>
                        <option value="1억원 이상">1억원 이상</option>
                        <option value="상담필요">상담 후 결정</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-theme-secondary mb-2">
                        위치 *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                        placeholder="서울시 강남구"
                      />
                    </div>
                  </div>
                </div>

                {/* Meeting Schedule */}
                <div className="border-2 border-theme-accent-20 bg-theme-accent-5 backdrop-blur-sm rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-theme-primary tracking-tight">미팅 희망 일정</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="preferred_date" className="block text-sm font-medium text-theme-secondary mb-2">
                        희망 날짜
                      </label>
                      <input
                        type="date"
                        id="preferred_date"
                        name="preferred_date"
                        value={formData.preferred_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="preferred_time" className="block text-sm font-medium text-theme-secondary mb-2">
                        희망 시간
                      </label>
                      <select
                        id="preferred_time"
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                      >
                        <option value="">선택해주세요</option>
                        <option value="오전 10-12시">오전 10-12시</option>
                        <option value="오후 12-2시">오후 12-2시</option>
                        <option value="오후 2-4시">오후 2-4시</option>
                        <option value="오후 4-6시">오후 4-6시</option>
                        <option value="협의">협의 후 결정</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Message */}
                <div className="border-2 border-theme-accent-20 bg-theme-accent-5 backdrop-blur-sm rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-theme-primary tracking-tight">추가 요청사항</h3>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-theme-secondary mb-2">
                      상세 내용
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-theme-accent-20 rounded-lg focus:ring-2 focus:border-theme-accent bg-white text-theme-primary"
                      placeholder="프로젝트에 대한 자세한 내용이나 원하시는 스타일 등을 자유롭게 작성해주세요."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="border-2 border-theme-accent-20 text-theme-secondary px-8 py-4 text-sm font-medium tracking-wide hover:border-theme-accent-30 bg-theme-accent-5 transition-all duration-300"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="bg-theme-accent text-white px-12 py-4 text-sm font-medium tracking-wide hover:opacity-90 transition-all duration-300"
                  >
                    견적 신청하기
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* View: Detail */}
          {view === 'detail' && selectedQuote && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-theme-primary tracking-tight">
                  견적 상세보기
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('list')}
                    className="border-2 border-theme-accent-20 text-theme-secondary px-6 py-3 text-sm font-medium tracking-wide hover:border-theme-accent-30 bg-theme-accent-5 transition-all duration-300"
                  >
                    목록으로
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Header Info */}
                <div className="border-2 border-theme-accent-20 bg-theme-accent-5 backdrop-blur-sm rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-3xl font-bold text-theme-primary tracking-tight">
                      익명 견적 신청
                    </h3>
                    <span className="bg-theme-accent text-white px-4 py-1.5 text-sm font-medium tracking-wide">
                      {selectedQuote.business_type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-theme-secondary">
                    <div>
                      <p className="text-sm opacity-75 mb-1">작성일</p>
                      <p className="font-medium">{formatDate(selectedQuote.created_at)}</p>
                    </div>
                    {selectedQuote.updated_at !== selectedQuote.created_at && (
                      <div>
                        <p className="text-sm opacity-75 mb-1">수정일</p>
                        <p className="font-medium">{formatDate(selectedQuote.updated_at)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="border-2 border-theme-accent-20 bg-theme-accent-5 backdrop-blur-sm rounded-xl p-8">
                  <h4 className="text-xl font-bold mb-4 text-theme-primary tracking-tight">프로젝트 정보</h4>
                  <div className="grid grid-cols-2 gap-4 text-theme-secondary">
                    <div>
                      <p className="text-sm opacity-75 mb-1">인테리어 범위</p>
                      <p className="font-medium">{selectedQuote.project_type}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75 mb-1">평수</p>
                      <p className="font-medium">{selectedQuote.area}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75 mb-1">예산</p>
                      <p className="font-medium">{selectedQuote.budget || '상담 후 결정'}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75 mb-1">위치</p>
                      <p className="font-medium">{selectedQuote.location}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-theme-secondary">
                  연락처와 요청사항은 담당자만 확인할 수 있도록 공개 화면에서 제외됩니다.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Info Section */}
      <section className="relative py-32 border-t border-theme-accent-20" style={{backgroundColor: 'rgba(var(--accent), 0.03)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative p-8 border-2 border-theme-accent-20 hover:border-theme-accent-30 transition-all duration-500 bg-theme-accent-5 backdrop-blur-sm text-center">
              <p className="mb-5 text-xs font-semibold tracking-[0.24em] text-theme-secondary">STEP 01</p>
              <h3 className="text-xl font-bold mb-3 text-theme-primary tracking-tight">기본 정보 접수</h3>
              <p className="text-theme-secondary leading-relaxed font-light">
                업종, 면적, 예산, 희망 일정과 연락처를 하나의 폼으로 입력합니다
              </p>
            </div>

            <div className="group relative p-8 border-2 border-theme-accent-20 hover:border-theme-accent-30 transition-all duration-500 bg-theme-accent-5 backdrop-blur-sm text-center">
              <p className="mb-5 text-xs font-semibold tracking-[0.24em] text-theme-secondary">STEP 02</p>
              <h3 className="text-xl font-bold mb-3 text-theme-primary tracking-tight">조건 확인</h3>
              <p className="text-theme-secondary leading-relaxed font-light">
                업종, 공사 범위, 예산과 일정을 바탕으로 상담에 필요한 조건을 정리합니다
              </p>
            </div>

            <div className="group relative p-8 border-2 border-theme-accent-20 hover:border-theme-accent-30 transition-all duration-500 bg-theme-accent-5 backdrop-blur-sm text-center">
              <p className="mb-5 text-xs font-semibold tracking-[0.24em] text-theme-secondary">STEP 03</p>
              <h3 className="text-xl font-bold mb-3 text-theme-primary tracking-tight">견적 검토</h3>
              <p className="text-theme-secondary leading-relaxed font-light">
                공사 조건과 자재 범위를 검토해 프로젝트에 필요한 견적을 준비합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  )
}
