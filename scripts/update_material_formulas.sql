-- 자재별 수량 자동 계산식 업데이트 (평 단위 기준)
-- p = 평수, h = 층고(m)

-- 바닥재 (평 단위 그대로 + 로스율)
UPDATE materials SET formula = 'p*1.1' WHERE category = '바닥' AND name LIKE '%타일%';
UPDATE materials SET formula = 'p*1.1' WHERE category = '바닥' AND name LIKE '%강화마루%';
UPDATE materials SET formula = 'p*1.1' WHERE category = '바닥' AND name LIKE '%장판%';
UPDATE materials SET formula = 'p*1.05' WHERE category = '바닥' AND name LIKE '%에폭시%';
UPDATE materials SET formula = 'p*1.05' WHERE category = '바닥' AND name LIKE '%우레탄%';

-- 벽체 (평수 × 층고 × 4면(둘레계수) × 로스율)
-- 1평 = 약 1.818m × 1.818m, 둘레 = 7.27m, 간소화하여 평당 벽면 = h*7.3
UPDATE materials SET formula = 'p*h*7.3*1.15' WHERE category = '벽체' AND name LIKE '%타일%';
UPDATE materials SET formula = 'p*h*7.3*1.15' WHERE category = '벽체' AND name LIKE '%도기질%';
UPDATE materials SET formula = 'p*h*7.3*1.1' WHERE category = '벽체' AND name LIKE '%석고보드%';
UPDATE materials SET formula = 'p*h*7.3*1.1' WHERE category = '벽체' AND name LIKE '%ALC%';

-- 천장 (평 단위 그대로 + 로스율)
UPDATE materials SET formula = 'p*1.05' WHERE category = '천장' AND name LIKE '%석고보드%';
UPDATE materials SET formula = 'p*1.05' WHERE category = '천장' AND name LIKE '%텍스%';
UPDATE materials SET formula = 'p*1.05' WHERE category = '천장' AND name LIKE '%천장틀%';

-- 도장 (벽면적 + 천장면적, 평 단위)
UPDATE materials SET formula = 'p*h*7.3 + p' WHERE category = '도장' AND name LIKE '%페인트%';
UPDATE materials SET formula = 'p*h*7.3 + p' WHERE category = '도장' AND name LIKE '%수성%';

-- 철거 (평 단위)
UPDATE materials SET formula = 'p' WHERE category = '철거' AND name LIKE '%바닥철거%';
UPDATE materials SET formula = 'p*h*7.3' WHERE category = '철거' AND name LIKE '%벽체철거%';
UPDATE materials SET formula = 'p' WHERE category = '철거' AND name LIKE '%천장철거%';

-- 전기 (평당 개소)
UPDATE materials SET formula = 'p*2' WHERE category = '전기' AND name LIKE '%콘센트%';
UPDATE materials SET formula = 'p*1.5' WHERE category = '전기' AND name LIKE '%스위치%';
UPDATE materials SET formula = 'p*2.5' WHERE category = '전기' AND name LIKE '%LED%';

-- 설비 (평당 개소)
UPDATE materials SET formula = 'p*0.5' WHERE category = '설비' AND name LIKE '%세면기%';
UPDATE materials SET formula = 'p*0.3' WHERE category = '설비' AND name LIKE '%양변기%';

-- 목공 (평당 개소 - 카페/식당 기준)
UPDATE materials SET formula = 'p*0.8' WHERE category = '목공' AND name LIKE '%테이블%';
UPDATE materials SET formula = 'p*3' WHERE category = '목공' AND name LIKE '%의자%';

-- 기타 (고정값 또는 평당)
UPDATE materials SET formula = '1' WHERE category = '기타' AND name LIKE '%운반비%';
UPDATE materials SET formula = 'p*0.1' WHERE category = '기타' AND name LIKE '%폐기물%';
UPDATE materials SET formula = '1' WHERE category = '기타' AND name LIKE '%양생비%';
UPDATE materials SET formula = '1' WHERE category = '기타' AND name LIKE '%청소비%';
UPDATE materials SET formula = '1' WHERE category = '기타' AND name LIKE '%감리비%';
UPDATE materials SET formula = '1' WHERE category = '기타' AND name LIKE '%설계비%';
