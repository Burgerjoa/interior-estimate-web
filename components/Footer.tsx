import Link from 'next/link'

const links = [
  ['회사 소개', '/about'],
  ['공간 레퍼런스', '/portfolio'],
  ['온라인 견적', '/quote'],
  ['견적 시스템 데모', '/estimate-demo'],
  ['직원 로그인', '/login'],
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#111] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <p className="text-xl font-semibold">ALVB</p>
            <p className="mt-4 leading-7 text-gray-400">
              상업공간의 기획부터 견적까지 필요한 정보를 정리하고,
              프로젝트 상담을 온라인으로 연결합니다.
            </p>
          </div>
          <nav aria-label="푸터 메뉴" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-300">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-gray-500 md:flex-row md:justify-between">
          <span>출시 전 개발이 중단된 사내 프로젝트로, 현재 정보는 예시 데이터입니다.</span>
          <span>ALVB · Commercial Interior Design</span>
        </div>
      </div>
    </footer>
  )
}
