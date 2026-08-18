import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const businessTypes = ['카페', '레스토랑', '리테일', '오피스', '뷰티', '기타']
const projectTypes = ['풀인테리어', '부분인테리어', '리모델링', '상담필요']
const locations = [
  '서울 강남구', '서울 서초구', '서울 송파구', '서울 강동구',
  '서울 마포구', '서울 용산구', '서울 성동구', '서울 광진구',
  '경기 성남시', '경기 수원시', '경기 고양시', '경기 용인시',
  '부산 해운대구', '부산 부산진구', '대구 수성구', '대전 유성구'
]
const areas = ['15평', '20평', '25평', '30평', '35평', '40평', '50평', '60평', '70평', '80평']

const names = [
  '김민수', '이영희', '박철호', '정수진', '최동현',
  '강서연', '윤지호', '임하늘', '한민준', '오세아',
  '배준서', '송유진', '홍길동', '장미래', '신동엽'
]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString()
}

async function seedQuotes() {
  const startDate = new Date('2022-01-01')
  const endDate = new Date()

  const quotes = []

  // 2022년부터 현재까지 총 100개 정도의 게시글 생성
  for (let i = 0; i < 100; i++) {
    const business_type = getRandomElement(businessTypes)
    const project_type = getRandomElement(projectTypes)
    const location = getRandomElement(locations)
    const area = getRandomElement(areas)
    const name = getRandomElement(names)
    const created_at = getRandomDate(startDate, endDate)

    quotes.push({
      name,
      business_type,
      project_type,
      area,
      location,
      budget: '상담필요',
      message: `${business_type} ${project_type} 견적 문의입니다.`,
      created_at,
      updated_at: created_at
    })
  }

  // 날짜순 정렬
  quotes.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  console.log(`Inserting ${quotes.length} quotes...`)

  const { data, error } = await supabase
    .from('quotes')
    .insert(quotes)
    .select()

  if (error) {
    console.error('Error inserting quotes:', error)
  } else {
    console.log(`Successfully inserted ${data?.length} quotes!`)
  }
}

seedQuotes()
