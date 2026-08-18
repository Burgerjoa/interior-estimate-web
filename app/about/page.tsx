import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const services = [
  {
    title: '공간 기획',
    description: '업종과 운영 방식, 필요한 좌석과 설비를 바탕으로 공간의 우선순위를 정리합니다.',
  },
  {
    title: '설계·시공 범위',
    description: '철거, 목공, 전기, 설비, 마감 등 프로젝트에 필요한 공사 범위를 구분합니다.',
  },
  {
    title: '견적 상담',
    description: '면적과 예산, 일정 조건을 확인하고 자재와 공사 항목을 기준으로 견적을 검토합니다.',
  },
]

const process = [
  ['문의 접수', '업종, 위치, 면적과 희망 일정을 확인합니다.'],
  ['조건 확인', '운영 동선과 필요한 설비, 공사 범위를 정리합니다.'],
  ['견적 검토', '자재와 공사 항목을 나누어 예산 범위를 검토합니다.'],
  ['진행 협의', '일정과 우선순위를 조율하고 다음 단계를 협의합니다.'],
]

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="pt-40 pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="section-eyebrow">About ALVB</p>
            <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-tight tracking-[-0.04em] text-theme-primary md:text-7xl">
              공간의 목적을 이해하는 것부터
              <br />
              시작합니다.
            </h1>
            <div className="mt-12 grid gap-8 border-t border-theme-accent-20 pt-8 text-theme-secondary md:grid-cols-2">
              <p className="max-w-xl text-lg leading-8">
                ALVB는 카페, 외식, 리테일, 뷰티, 오피스 등 상업공간을 위한
                인테리어 상담과 견적 업무를 하나의 흐름으로 연결합니다.
              </p>
              <p className="max-w-xl text-lg leading-8">
                보기 좋은 공간뿐 아니라 실제 운영에 필요한 동선과 설비,
                예산과 일정을 함께 확인해 프로젝트의 기준을 구체화합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-theme-accent-20 py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <p className="section-eyebrow">What We Do</p>
              <h2 className="section-title">서비스 범위</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {services.map((service) => (
                <article key={service.title} className="surface-card p-8">
                  <h3 className="text-2xl font-semibold text-theme-primary">{service.title}</h3>
                  <p className="mt-6 leading-7 text-theme-secondary">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-theme-accent-20 bg-theme-accent-5 py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="section-eyebrow">Process</p>
                <h2 className="section-title">상담 진행 과정</h2>
                <p className="section-description">
                  처음부터 모든 조건이 정해져 있지 않아도 됩니다. 확인 가능한 정보부터 순서대로 정리합니다.
                </p>
              </div>
              <ol className="divide-y divide-theme-accent-20 border-y border-theme-accent-20">
                {process.map(([title, description], index) => (
                  <li key={title} className="grid gap-3 py-7 md:grid-cols-[60px_150px_1fr]">
                    <span className="text-sm text-theme-secondary">0{index + 1}</span>
                    <strong className="text-theme-primary">{title}</strong>
                    <span className="text-theme-secondary">{description}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-t border-theme-accent-20 py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="section-eyebrow">Space Type</p>
            <h2 className="section-title">상업공간 중심의 프로젝트</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {['카페 · 외식', '리테일 · 뷰티', '오피스 · 업무공간'].map((space) => (
                <div key={space} className="surface-card p-7">
                  <p className="text-xl font-semibold text-theme-primary">{space}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
