-- =========================================================
-- BuySafe Amazon mock result link repair
--
-- 증상:
-- CalvinKlein 조회 시 Garmin 세금(49,035원)이 표시되는 등
-- svc_query_log -> svc_query_result -> res_* 연결이 어긋난 경우 보정합니다.
--
-- 이 쿼리는 상품 snapshot, 조회 결과 연결, 세금 계산 값을 모두
-- ASIN/product_id 기준으로 다시 맞춥니다.
-- =========================================================

BEGIN;

-- 1. 상품 snapshot 재보정
UPDATE svc_query_log
SET product_id = 3001,
    option_json = '{"asin":"B0BBYF2SXX","slug":"Marshall","title":"Marshall Acton III Bluetooth Home Speaker, Cream","brand":"Marshall","category":"Bluetooth speaker","option":"Cream","seller":"BuySafe Mock Store","originCountry":"China","unitPriceUsd":279.99,"shippingUsd":18.50,"currency":"USD","country":"US"}'::jsonb
WHERE input_value LIKE '%B0BBYF2SXX%' OR option_json->>'asin' = 'B0BBYF2SXX';

UPDATE svc_query_log
SET product_id = 3002,
    option_json = '{"asin":"B0DD8SHVZL","slug":"Sony","title":"Sony MDR-M1 Professional Reference Closed Monitor Headphones","brand":"Sony","category":"Studio monitor headphones","option":"Black","seller":"BuySafe Mock Store","originCountry":"Thailand","unitPriceUsd":248.00,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb
WHERE input_value LIKE '%B0DD8SHVZL%' OR option_json->>'asin' = 'B0DD8SHVZL';

UPDATE svc_query_log
SET product_id = 3003,
    option_json = '{"asin":"B0DBMM6S89","slug":"Garmin","title":"Garmin Forerunner 55 GPS Running Smartwatch (Black) Power Bundle","brand":"Garmin","category":"GPS running smartwatch","option":"Black","seller":"BuySafe Mock Store","originCountry":"Taiwan","unitPriceUsd":189.00,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb
WHERE input_value LIKE '%B0DBMM6S89%' OR option_json->>'asin' = 'B0DBMM6S89';

UPDATE svc_query_log
SET product_id = 3004,
    option_json = '{"asin":"B0DZ75TN5F","slug":"iPad","title":"Apple iPad 11-inch: A16 chip, Liquid Retina Display, 128GB, Wi-Fi 6, 12MP Cameras, Touch ID, All-Day Battery Life - Blue","brand":"Apple","category":"Tablet computer","option":"Blue / 128GB / Wi-Fi","seller":"BuySafe Mock Store","originCountry":"China","unitPriceUsd":299.00,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb
WHERE input_value LIKE '%B0DZ75TN5F%' OR option_json->>'asin' = 'B0DZ75TN5F';

UPDATE svc_query_log
SET product_id = 3005,
    option_json = '{"asin":"B07NWMVMT1","slug":"Magnesium","title":"NOW Supplements, Magnesium Glycinate 100 mg, Highly Absorbable Form, 180 Tablets","brand":"NOW","category":"Dietary supplement","option":"180 Tablets","seller":"BuySafe Mock Store","originCountry":"United States","unitPriceUsd":24.99,"shippingUsd":5.49,"currency":"USD","country":"US"}'::jsonb
WHERE input_value LIKE '%B07NWMVMT1%' OR option_json->>'asin' = 'B07NWMVMT1';

UPDATE svc_query_log
SET product_id = 3006,
    option_json = '{"asin":"B000SE5SY6","slug":"Omega3","title":"NOW Foods Supplements, Ultra Omega-3 Molecularly Distilled and Enteric Coated, 180 Softgels","brand":"NOW Foods","category":"Omega-3 supplement","option":"180 Softgels","seller":"BuySafe Mock Store","originCountry":"United States","unitPriceUsd":31.99,"shippingUsd":4.99,"currency":"USD","country":"US"}'::jsonb
WHERE input_value LIKE '%B000SE5SY6%' OR option_json->>'asin' = 'B000SE5SY6';

UPDATE svc_query_log
SET product_id = 3007,
    option_json = '{"asin":"B07PGR2Z62","slug":"CalvinKlein","title":"Calvin Klein Men''s Cotton Classics 7-Pack Boxer Brief, 7 Black, Large","brand":"Calvin Klein","category":"Men''s underwear","option":"7 Black / Large","seller":"BuySafe Mock Store","originCountry":"Imported","unitPriceUsd":59.68,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb
WHERE input_value LIKE '%B07PGR2Z62%' OR option_json->>'asin' = 'B07PGR2Z62';

-- 2. 결과 연결 재보정
UPDATE svc_query_result
SET product_id = 3001, hs_mapping_id = 31001, taxcalc_id = 33001, regulation_id = 32001, combtax_risk_id = 35001, result_status = 'SUCCESS'
WHERE query_log_id IN (SELECT query_log_id FROM svc_query_log WHERE option_json->>'asin' = 'B0BBYF2SXX');

UPDATE svc_query_result
SET product_id = 3002, hs_mapping_id = 31002, taxcalc_id = 33002, regulation_id = 32002, combtax_risk_id = 35002, result_status = 'SUCCESS'
WHERE query_log_id IN (SELECT query_log_id FROM svc_query_log WHERE option_json->>'asin' = 'B0DD8SHVZL');

UPDATE svc_query_result
SET product_id = 3003, hs_mapping_id = 31003, taxcalc_id = 33003, regulation_id = 32003, combtax_risk_id = 35003, result_status = 'SUCCESS'
WHERE query_log_id IN (SELECT query_log_id FROM svc_query_log WHERE option_json->>'asin' = 'B0DBMM6S89');

UPDATE svc_query_result
SET product_id = 3004, hs_mapping_id = 31004, taxcalc_id = 33004, regulation_id = 32004, combtax_risk_id = 35004, result_status = 'SUCCESS'
WHERE query_log_id IN (SELECT query_log_id FROM svc_query_log WHERE option_json->>'asin' = 'B0DZ75TN5F');

UPDATE svc_query_result
SET product_id = 3005, hs_mapping_id = 31005, taxcalc_id = 33005, regulation_id = 32005, combtax_risk_id = 35005, result_status = 'PARTIAL'
WHERE query_log_id IN (SELECT query_log_id FROM svc_query_log WHERE option_json->>'asin' = 'B07NWMVMT1');

UPDATE svc_query_result
SET product_id = 3006, hs_mapping_id = 31006, taxcalc_id = 33006, regulation_id = 32006, combtax_risk_id = 35006, result_status = 'PARTIAL'
WHERE query_log_id IN (SELECT query_log_id FROM svc_query_log WHERE option_json->>'asin' = 'B000SE5SY6');

UPDATE svc_query_result
SET product_id = 3007, hs_mapping_id = 31007, taxcalc_id = 33007, regulation_id = 32007, combtax_risk_id = 35007, result_status = 'SUCCESS'
WHERE query_log_id IN (SELECT query_log_id FROM svc_query_log WHERE option_json->>'asin' = 'B07PGR2Z62');

-- 3. 세금 값 재보정
UPDATE res_taxcalc_std
SET product_id = 3007,
    mapping_id = 31007,
    cif_amount = 82358.00,
    duty_amount = 0.00,
    vat_amount = 0.00,
    etc_tax = 0.00,
    total_tax = 0.00,
    total_cost = 82358.00
WHERE calc_id = 33007;

COMMIT;

-- 확인용: CK는 미국발 $59.68 개인사용 의류 mock이므로 total_tax 0원이 나와야 합니다.
SELECT
  q.option_json->>'asin' AS asin,
  q.option_json->>'title' AS title,
  r.taxcalc_id,
  t.cif_amount,
  t.duty_amount,
  t.vat_amount,
  t.total_tax,
  ROUND((t.duty_amount / NULLIF(t.cif_amount, 0)) * 100, 2) AS duty_rate_percent
FROM svc_query_log q
JOIN svc_query_result r ON r.query_log_id = q.query_log_id
JOIN res_taxcalc_std t ON t.calc_id = r.taxcalc_id
WHERE q.option_json->>'asin' = 'B07PGR2Z62';
