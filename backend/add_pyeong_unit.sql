-- materials 테이블의 unit 체크 제약조건에 '평' 추가

-- 기존 제약조건 삭제
ALTER TABLE materials DROP CONSTRAINT IF EXISTS materials_unit_check;

-- 새로운 제약조건 추가 ('평' 포함)
ALTER TABLE materials ADD CONSTRAINT materials_unit_check
  CHECK (unit IN ('㎡', 'm', 'EA', '톤', 'L', 'kg', '식', '개소', 'm²', 'm³', '평'));
