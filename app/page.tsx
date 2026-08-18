import Link from 'next/link'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const serviceFlow = [
  {
    number: '01',
    title: '상담 접수',
    description: '업종, 면적, 예산과 희망 일정을 남겨 프로젝트의 기본 조건을 확인합니다.',
  },
  {
    number: '02',
    title: '공간 조건 확인',
    description: '운영 방식과 필요한 공사 범위를 바탕으로 우선순위와 방향을 정리합니다.',
  },
  {
    number: '03',
    title: '견적 제안',
    description: '자재, 공사 조건과 일정을 반영해 프로젝트에 필요한 견적을 제안합니다.',
  },
]

const projectPoints = [
  ['공간 유형', '카페, 외식, 리테일, 뷰티, 오피스 등 업종에 맞는 공간 구성을 검토합니다.'],
  ['예산 범위', '예산 안에서 우선 적용할 공사와 자재 범위를 구분해 견적 기준을 세웁니다.'],
  ['일정 조건', '오픈 예정일과 공사 가능 기간을 확인해 현실적인 진행 범위를 정리합니다.'],
  ['운영 동선', '고객과 직원의 이동, 설비 위치와 수납 등 실제 운영에 필요한 조건을 함께 살핍니다.'],
]

const sampleStats = [
  ['150+', '완료 프로젝트'],
  ['98%', '고객 만족도'],
  ['7년', '업계 경력'],
  ['24/7', '상담 접수'],
]

const sampleReviews = [
  {
    role: '카페 운영자',
    quote: '초기 상담에서 공사 범위와 우선순위를 나눠 설명해줘서 예산을 정리하기 수월했습니다.',
  },
  {
    role: '리테일 브랜드 담당자',
    quote: '매장 동선과 진열 방식을 함께 검토하면서 필요한 공간 구성을 빠르게 구체화할 수 있었습니다.',
  },
  {
    role: '오피스 운영팀',
    quote: '업무 공간과 공용 공간을 구분해 견적 항목을 확인할 수 있어 내부 검토가 편했습니다.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="relative flex min-h-screen items-center pt-36 pb-24">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="max-w-5xl">
              <p className="mb-8 text-xs font-semibold tracking-[0.32em] text-theme-secondary uppercase">
                Commercial Interior Design
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.045em] text-theme-primary md:text-7xl lg:text-8xl">
                공간을 읽고,
                <br />
                견적의 기준을 세웁니다
              </h1>
              <p className="mt-10 max-w-2xl text-lg leading-8 text-theme-secondary md:text-xl">
                카페, 리테일, 오피스 등 상업공간의 목적과 운영 방식을 살피고
                상담부터 견적까지 필요한 과정을 정리합니다.
              </p>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link href="/portfolio" className="button-primary">
                  공간 레퍼런스
                </Link>
                <Link href="/about" className="button-secondary">
                  ALVB 소개
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-theme-accent-20 py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <p className="section-eyebrow">Process</p>
              <h2 className="section-title">프로젝트 진행</h2>
              <p className="section-description">
                프로젝트의 기본 조건을 먼저 확인하고 필요한 범위를 단계별로 구체화합니다.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {serviceFlow.map((item) => (
                <article key={item.number} className="surface-card p-8">
                  <span className="text-sm font-semibold text-theme-secondary">{item.number}</span>
                  <h3 className="mt-10 text-2xl font-semibold text-theme-primary">{item.title}</h3>
                  <p className="mt-4 leading-7 text-theme-secondary">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#111] py-20 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-3 border-b border-white/15 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Project Results</p>
                  <span className="border border-white/25 px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-gray-300">
                    SAMPLE DATA
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">숫자로 보는 ALVB</h2>
              </div>
              <p className="text-xs text-gray-500">화면 구성을 위한 예시 수치입니다.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4">
              {sampleStats.map(([value, label]) => (
                <div key={label} className="border-b border-white/15 py-10 pr-6 md:border-b-0 md:border-r md:pl-8 first:pl-0 last:border-r-0">
                  <p className="text-4xl font-semibold tracking-tight md:text-5xl">{value}</p>
                  <p className="mt-3 text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-theme-accent-20 bg-theme-accent-5 py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="section-eyebrow">Project Checklist</p>
                <h2 className="section-title">함께 확인할 조건</h2>
                <p className="section-description">
                  같은 면적의 공간이라도 업종과 운영 방식에 따라 필요한 공사 범위는 달라집니다.
                </p>
              </div>
              <div className="divide-y divide-theme-accent-20 border-y border-theme-accent-20">
                {projectPoints.map(([title, description]) => (
                  <div key={title} className="grid gap-3 py-7 md:grid-cols-[220px_1fr]">
                    <h3 className="font-semibold text-theme-primary">{title}</h3>
                    <p className="leading-7 text-theme-secondary">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-theme-accent-20 py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="section-eyebrow">Client Voice</p>
                  <span className="border border-theme-accent-20 px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-theme-secondary">
                    SAMPLE
                  </span>
                </div>
                <h2 className="section-title">프로젝트 상담 후기</h2>
              </div>
              <p className="text-xs text-theme-secondary">화면 구성을 위한 예시 후기입니다.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {sampleReviews.map((review) => (
                <article key={review.role} className="surface-card flex min-h-64 flex-col justify-between p-8">
                  <p className="text-lg leading-8 text-theme-primary">“{review.quote}”</p>
                  <p className="mt-10 border-t border-theme-accent-20 pt-5 text-sm font-semibold text-theme-secondary">
                    {review.role} · SAMPLE
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-theme-accent-20 py-28">
          <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-end lg:px-8">
            <div>
              <p className="section-eyebrow">Start a Project</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-theme-primary md:text-5xl">
                준비 중인 공간이 있으신가요?
              </h2>
            </div>
            <Link href="/quote" className="button-primary shrink-0">
              온라인 견적 문의
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
