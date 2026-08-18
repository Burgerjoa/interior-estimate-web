-- 공개 견적 게시판에서 개인정보가 직접 조회되지 않도록 정책과 뷰를 분리한다.

DROP POLICY IF EXISTS "Anyone can view quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can insert quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can update quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can delete quotes" ON quotes;
DROP POLICY IF EXISTS "Anyone can submit quotes" ON quotes;
DROP POLICY IF EXISTS "Staff can view quotes" ON quotes;
DROP POLICY IF EXISTS "Staff can update quotes" ON quotes;
DROP POLICY IF EXISTS "Staff can delete quotes" ON quotes;

CREATE POLICY "Anyone can submit quotes"
  ON quotes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can view quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can update quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff can delete quotes"
  ON quotes FOR DELETE
  TO authenticated
  USING (true);

DROP VIEW IF EXISTS public_quotes;
CREATE VIEW public_quotes
WITH (security_invoker = false)
AS
SELECT
  id,
  business_type,
  project_type,
  area,
  budget,
  location,
  created_at,
  updated_at
FROM quotes;

REVOKE ALL ON public_quotes FROM PUBLIC;
GRANT SELECT ON public_quotes TO anon, authenticated;
