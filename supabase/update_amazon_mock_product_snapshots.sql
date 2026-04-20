-- =========================================================
-- BuySafe Amazon mock product snapshot fix
--
-- /result 상품 정보는 svc_query_log.option_json의 상품 snapshot을 읽습니다.
-- 기존 import에서 asin/slug만 들어간 경우 Unknown product로 표시되므로
-- 아래 쿼리로 7개 테스트 상품 snapshot을 최신 테스트 페이지와 맞춥니다.
-- =========================================================

UPDATE svc_query_log
SET option_json = '{"asin":"B0BBYF2SXX","slug":"Marshall","title":"Marshall Acton III Bluetooth Home Speaker, Cream","brand":"Marshall","category":"Bluetooth speaker","option":"Cream","seller":"BuySafe Mock Store","originCountry":"China","unitPriceUsd":279.99,"shippingUsd":18.50,"currency":"USD","country":"US"}'::jsonb
WHERE option_json->>'asin' = 'B0BBYF2SXX'
   OR input_value LIKE '%B0BBYF2SXX%';

UPDATE svc_query_log
SET option_json = '{"asin":"B0DD8SHVZL","slug":"Sony","title":"Sony MDR-M1 Professional Reference Closed Monitor Headphones","brand":"Sony","category":"Studio monitor headphones","option":"Black","seller":"BuySafe Mock Store","originCountry":"Thailand","unitPriceUsd":248.00,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb
WHERE option_json->>'asin' = 'B0DD8SHVZL'
   OR input_value LIKE '%B0DD8SHVZL%';

UPDATE svc_query_log
SET option_json = '{"asin":"B0DBMM6S89","slug":"Garmin","title":"Garmin Forerunner 55 GPS Running Smartwatch (Black) Power Bundle","brand":"Garmin","category":"GPS running smartwatch","option":"Black","seller":"BuySafe Mock Store","originCountry":"Taiwan","unitPriceUsd":189.00,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb
WHERE option_json->>'asin' = 'B0DBMM6S89'
   OR input_value LIKE '%B0DBMM6S89%';

UPDATE svc_query_log
SET option_json = '{"asin":"B0DZ75TN5F","slug":"iPad","title":"Apple iPad 11-inch: A16 chip, Liquid Retina Display, 128GB, Wi-Fi 6, 12MP Cameras, Touch ID, All-Day Battery Life - Blue","brand":"Apple","category":"Tablet computer","option":"Blue / 128GB / Wi-Fi","seller":"BuySafe Mock Store","originCountry":"China","unitPriceUsd":299.00,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb
WHERE option_json->>'asin' = 'B0DZ75TN5F'
   OR input_value LIKE '%B0DZ75TN5F%';

UPDATE svc_query_log
SET option_json = '{"asin":"B07NWMVMT1","slug":"Magnesium","title":"NOW Supplements, Magnesium Glycinate 100 mg, Highly Absorbable Form, 180 Tablets","brand":"NOW","category":"Dietary supplement","option":"180 Tablets","seller":"BuySafe Mock Store","originCountry":"United States","unitPriceUsd":24.99,"shippingUsd":5.49,"currency":"USD","country":"US"}'::jsonb
WHERE option_json->>'asin' = 'B07NWMVMT1'
   OR input_value LIKE '%B07NWMVMT1%';

UPDATE svc_query_log
SET option_json = '{"asin":"B000SE5SY6","slug":"Omega3","title":"NOW Foods Supplements, Ultra Omega-3 Molecularly Distilled and Enteric Coated, 180 Softgels","brand":"NOW Foods","category":"Omega-3 supplement","option":"180 Softgels","seller":"BuySafe Mock Store","originCountry":"United States","unitPriceUsd":31.99,"shippingUsd":4.99,"currency":"USD","country":"US"}'::jsonb
WHERE option_json->>'asin' = 'B000SE5SY6'
   OR input_value LIKE '%B000SE5SY6%';

UPDATE svc_query_log
SET option_json = '{"asin":"B07PGR2Z62","slug":"CalvinKlein","title":"Calvin Klein Men''s Cotton Classics 7-Pack Boxer Brief, 7 Black, Large","brand":"Calvin Klein","category":"Men''s underwear","option":"7 Black / Large","seller":"BuySafe Mock Store","originCountry":"Imported","unitPriceUsd":59.68,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb
WHERE option_json->>'asin' = 'B07PGR2Z62'
   OR input_value LIKE '%B07PGR2Z62%';

-- 확인용
SELECT
  option_json->>'asin' AS asin,
  option_json->>'title' AS title,
  option_json->>'brand' AS brand,
  option_json->>'unitPriceUsd' AS unit_price_usd
FROM svc_query_log
WHERE option_json->>'asin' IN (
  'B0BBYF2SXX',
  'B0DD8SHVZL',
  'B0DBMM6S89',
  'B0DZ75TN5F',
  'B07NWMVMT1',
  'B000SE5SY6',
  'B07PGR2Z62'
)
ORDER BY requested_at;
