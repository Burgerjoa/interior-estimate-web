'use client'

import { useState } from 'react'
import Image from 'next/image'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

interface ReferenceProject {
  id: number
  title: string
  category: string
  description: string
  image: string
  features: string[]
}

const projects: ReferenceProject[] = [
  {
    id: 1,
    title: '카페 공간 레퍼런스',
    category: '카페',
    description: '우드 톤과 식재를 활용해 따뜻한 분위기를 만든 카페 공간',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200',
    features: ['우드 톤', '오픈 바', '그린 포인트'],
  },
  {
    id: 2,
    title: '다이닝 공간 레퍼런스',
    category: '레스토랑',
    description: '조도와 좌석 간격을 조절해 머무는 경험에 집중한 다이닝 공간',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    features: ['간접 조명', '좌석 구획', '집중형 동선'],
  },
  {
    id: 3,
    title: '리테일 공간 레퍼런스',
    category: '리테일',
    description: '제품이 자연스럽게 시선에 들어오도록 진열 동선을 정리한 매장 공간',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    features: ['상품 진열', '순환 동선', '포인트 조명'],
  },
  {
    id: 4,
    title: '워크스페이스 레퍼런스',
    category: '오피스',
    description: '개인 업무와 협업 공간을 분리해 집중도를 높인 오피스 공간',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    features: ['업무 좌석', '협업 공간', '수납 동선'],
  },
  {
    id: 5,
    title: '뷰티 공간 레퍼런스',
    category: '뷰티',
    description: '밝은 마감과 균일한 조명으로 정돈된 인상을 만든 서비스 공간',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200',
    features: ['밝은 마감', '거울 조명', '대기 공간'],
  },
  {
    id: 6,
    title: '오피스 라운지 레퍼런스',
    category: '오피스',
    description: '짧은 휴식과 가벼운 미팅을 함께 수용하는 공용 라운지',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
    features: ['휴게 좌석', '캐주얼 미팅', '개방형 배치'],
  },
]

const categories = ['전체', ...Array.from(new Set(projects.map((project) => project.category)))]

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedProject, setSelectedProject] = useState<ReferenceProject | null>(null)

  const filteredProjects =
    selectedCategory === '전체'
      ? projects
      : projects.filter((project) => project.category === selectedCategory)

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="pt-40 pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="section-eyebrow">Reference</p>
            <div className="mt-6 grid items-end gap-8 lg:grid-cols-[1fr_420px]">
              <h1 className="text-5xl font-semibold tracking-[-0.04em] text-theme-primary md:text-7xl">
                공간 레퍼런스
              </h1>
              <p className="leading-7 text-theme-secondary">
                업종별 공간의 분위기와 구성 요소를 확인하고,
                준비 중인 프로젝트의 방향을 구체화해보세요.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-theme-accent-20 py-6">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-6 lg:px-8">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-theme-accent text-white'
                    : 'border border-theme-accent-20 text-theme-secondary hover:border-theme-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              {filteredProjects.map((project) => (
                <article key={project.id} className="surface-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="group block w-full text-left"
                    aria-label={`${project.title} 상세 보기`}
                  >
                    <div className="relative h-72 overflow-hidden md:h-80">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 text-xs font-medium text-white">
                        {project.category}
                      </span>
                    </div>
                    <div className="p-7">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h2 className="text-2xl font-semibold text-theme-primary">{project.title}</h2>
                          <p className="mt-3 leading-7 text-theme-secondary">{project.description}</p>
                        </div>
                        <span className="mt-1 shrink-0 text-theme-secondary transition-transform group-hover:translate-x-1" aria-hidden="true">
                          →
                        </span>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-6 pb-20 text-xs leading-6 text-theme-secondary lg:px-8">
          화면의 공간 이미지는 레이아웃 확인을 위한 Unsplash 샘플 이미지입니다.
        </div>
      </main>

      {selectedProject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-[#fffaf0] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-72 md:h-96">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center bg-black text-xl text-white"
                aria-label="상세 화면 닫기"
              >
                ×
              </button>
            </div>
            <div className="p-8 md:p-10">
              <p className="section-eyebrow">{selectedProject.category}</p>
              <h2 id="project-dialog-title" className="mt-4 text-3xl font-semibold text-theme-primary md:text-4xl">
                {selectedProject.title}
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-theme-secondary">
                {selectedProject.description}
              </p>
              <div className="mt-10 border-t border-theme-accent-20 pt-8">
                <h3 className="font-semibold text-theme-primary">공간 구성 키워드</h3>
                <ul className="mt-5 grid gap-3 text-theme-secondary md:grid-cols-3">
                  {selectedProject.features.map((feature) => (
                    <li key={feature} className="border border-theme-accent-20 px-4 py-3">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
