-- Supabase 테이블 생성 및 더미 데이터 삽입 SQL
-- Supabase 대시보드에서 SQL Editor에 복사/붙여넣기 하세요

-- 1. quotes 테이블 생성
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    business_type TEXT NOT NULL,
    project_type TEXT NOT NULL,
    area TEXT NOT NULL,
    budget TEXT NOT NULL,
    location TEXT NOT NULL,
    preferred_date TEXT,
    preferred_time TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 트리거 생성
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_business_type ON quotes(business_type);

-- 5. 더미 데이터 삽입 (2024년 1월~12월)
INSERT INTO quotes (name, phone, email, business_type, project_type, area, budget, location, message, created_at) VALUES
('김민수', '010-1234-5678', 'kim.ms@example.com', '카페', '풀인테리어', '30평', '5000-1억원', '서울 강남구', '감성적인 카페 인테리어를 원합니다. 따뜻한 느낌의 우드톤과 빈티지한 소품들로 꾸미고 싶어요.', '2024-01-15 10:30:00+09'),
('이지은', '010-2345-6789', 'lee.je@example.com', '음식점', '부분인테리어', '20평', '3000-5000만원', '서울 마포구', '기존 음식점을 리모델링하려고 합니다. 주방 설비는 그대로 두고 홀만 새롭게 바꾸고 싶습니다.', '2024-02-20 14:20:00+09'),
('박준호', '010-3456-7890', 'park.jh@example.com', '사무실', '풀인테리어', '50평', '1억원 이상', '서울 강남구', 'IT 스타트업 사무실입니다. 개방적이고 창의적인 분위기를 원합니다.', '2024-03-10 11:00:00+09'),
('최수진', '010-4567-8901', 'choi.sj@example.com', '헤어샵', '풀인테리어', '25평', '3000-5000만원', '서울 송파구', '모던하고 세련된 헤어샵을 만들고 싶습니다. 조명이 중요해요.', '2024-04-05 16:45:00+09'),
('정민재', '010-5678-9012', 'jung.mj@example.com', '의류매장', '부분인테리어', '35평', '5000-1억원', '서울 강남구', '기존 매장의 피팅룸과 계산대 부분만 리뉴얼하고 싶습니다.', '2024-05-12 13:30:00+09'),
('강서윤', '010-6789-0123', 'kang.sy@example.com', '병원', '풀인테리어', '60평', '1억원 이상', '서울 서초구', '치과병원 인테리어입니다. 환자들이 편안함을 느낄 수 있는 공간을 원합니다.', '2024-06-18 09:15:00+09'),
('윤태희', '010-7890-1234', 'yoon.th@example.com', '베이커리', '풀인테리어', '28평', '5000-1억원', '서울 용산구', '프랑스 감성의 베이커리를 만들고 싶습니다. 쇼케이스 배치가 중요해요.', '2024-07-22 15:00:00+09'),
('임지훈', '010-8901-2345', 'lim.jh@example.com', '스터디카페', '풀인테리어', '45평', '5000-1억원', '서울 관악구', '대학가 근처 스터디카페입니다. 집중할 수 있는 개인 공간이 많았으면 좋겠어요.', '2024-08-08 10:20:00+09'),
('한소희', '010-9012-3456', 'han.sh@example.com', '네일샵', '부분인테리어', '18평', '1000-3000만원', '서울 강남구', '기존 네일샵의 조명과 인테리어 소품만 교체하고 싶습니다.', '2024-09-14 14:50:00+09'),
('오민석', '010-0123-4567', 'oh.ms@example.com', '피트니스', '풀인테리어', '80평', '1억원 이상', '서울 강동구', '프리미엄 PT 전문 헬스장입니다. 고급스러운 느낌을 원합니다.', '2024-10-03 11:40:00+09'),
('신예은', '010-1111-2222', 'shin.ye@example.com', '꽃집', '부분인테리어', '15평', '1000-3000만원', '서울 마포구', '아늑한 동네 꽃집입니다. 빈티지한 느낌으로 부분 수리하고 싶어요.', '2024-11-19 16:10:00+09'),
('배준영', '010-2222-3333', 'bae.jy@example.com', '서점', '풀인테리어', '40평', '5000-1억원', '서울 종로구', '독립서점을 오픈합니다. 책과 어울리는 따뜻하고 아늑한 공간을 원합니다.', '2024-12-07 13:25:00+09');

-- 6. Row Level Security (RLS) 설정
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- 공개 사용자는 신청만 가능하고, 원본 데이터 조회/수정/삭제는 인증 사용자만 가능
CREATE POLICY "Anyone can submit quotes" ON quotes
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff can view quotes" ON quotes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can update quotes" ON quotes
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Staff can delete quotes" ON quotes
    FOR DELETE TO authenticated USING (true);

-- 공개 게시판은 개인정보를 제외한 뷰만 조회
CREATE OR REPLACE VIEW public_quotes
WITH (security_invoker = false)
AS
SELECT id, business_type, project_type, area, budget, location, created_at, updated_at
FROM quotes;

REVOKE ALL ON public_quotes FROM PUBLIC;
GRANT SELECT ON public_quotes TO anon, authenticated;
