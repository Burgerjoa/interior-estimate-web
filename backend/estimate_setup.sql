-- 견적 시스템용 Supabase 테이블 생성 스크립트

-- materials 테이블 (자재 DB)
CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('철거', '바닥', '벽체', '천장', '도장', '전기', '설비', '목공', '기타')),
  name TEXT NOT NULL,
  spec TEXT,
  unit TEXT NOT NULL CHECK (unit IN ('㎡', 'm', 'EA', '톤', 'L', 'kg', '식', '개소', 'm²', 'm³')),
  price INTEGER NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- estimates 테이블 (견적)
CREATE TABLE IF NOT EXISTS estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL,
  pyeong DECIMAL(10, 2) NOT NULL CHECK (pyeong > 0),
  usage TEXT NOT NULL CHECK (usage IN ('카페', '식당', '사무실', '매장', '병원', '학원', '기타')),
  height TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  labor_cost INTEGER NOT NULL DEFAULT 0 CHECK (labor_cost >= 0),
  etc_cost INTEGER NOT NULL DEFAULT 0 CHECK (etc_cost >= 0),
  margin_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00 CHECK (margin_rate >= 0 AND margin_rate <= 100),
  total_cost INTEGER NOT NULL DEFAULT 0 CHECK (total_cost >= 0),
  estimate_price INTEGER NOT NULL DEFAULT 0 CHECK (estimate_price >= 0),
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- materials 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_name ON materials(name);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at DESC);

-- estimates 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_estimates_site_name ON estimates(site_name);
CREATE INDEX IF NOT EXISTS idx_estimates_usage ON estimates(usage);
CREATE INDEX IF NOT EXISTS idx_estimates_created_at ON estimates(created_at DESC);

-- updated_at 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- materials 테이블 updated_at 트리거
DROP TRIGGER IF EXISTS update_materials_updated_at ON materials;
CREATE TRIGGER update_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- estimates 테이블 updated_at 트리거
DROP TRIGGER IF EXISTS update_estimates_updated_at ON estimates;
CREATE TRIGGER update_estimates_updated_at
    BEFORE UPDATE ON estimates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 활성화
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 인증된 사용자만 접근 가능
CREATE POLICY "Authenticated users can view materials"
  ON materials FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert materials"
  ON materials FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update materials"
  ON materials FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete materials"
  ON materials FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view estimates"
  ON estimates FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert estimates"
  ON estimates FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update estimates"
  ON estimates FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete estimates"
  ON estimates FOR DELETE
  USING (auth.role() = 'authenticated');

-- 코멘트 추가
COMMENT ON TABLE materials IS '인테리어 자재 마스터 데이터';
COMMENT ON TABLE estimates IS '견적 정보 및 이력';
COMMENT ON COLUMN materials.category IS '공종 분류';
COMMENT ON COLUMN materials.name IS '자재명';
COMMENT ON COLUMN materials.spec IS '규격';
COMMENT ON COLUMN materials.unit IS '단위';
COMMENT ON COLUMN materials.price IS '단가(원)';
COMMENT ON COLUMN estimates.site_name IS '현장명';
COMMENT ON COLUMN estimates.pyeong IS '평형';
COMMENT ON COLUMN estimates.usage IS '용도';
COMMENT ON COLUMN estimates.height IS '층고';
COMMENT ON COLUMN estimates.items IS '선택된 자재 목록 JSON';
COMMENT ON COLUMN estimates.labor_cost IS '인건비(원)';
COMMENT ON COLUMN estimates.etc_cost IS '기타비용(원)';
COMMENT ON COLUMN estimates.margin_rate IS '마진율(%)';
COMMENT ON COLUMN estimates.total_cost IS '총 원가(원)';
COMMENT ON COLUMN estimates.estimate_price IS '견적가(원)';
