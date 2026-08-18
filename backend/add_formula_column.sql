-- materials 테이블에 계산식 필드 추가
-- formula: 평수(p)와 층고(h)를 변수로 사용하는 계산식
-- 예시: "p * 3.3" (평수를 제곱미터로 변환)
-- 예시: "p * h * 0.5" (평수 * 층고 * 계수)
-- 예시: "10" (고정 수량)

ALTER TABLE materials ADD COLUMN IF NOT EXISTS formula TEXT;

COMMENT ON COLUMN materials.formula IS '수량 자동계산 공식 (p=평수, h=층고). 예: "p*3.3", "p*h*0.5"';
