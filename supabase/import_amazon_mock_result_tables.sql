-- =========================================================
-- BuySafe Amazon mock result data
-- ?ㅼ젣 ?ㅺ퀎 ?뚯씠釉붾쭔 ?ъ슜?⑸땲??
--
-- ?ъ슜 ?뚯씠釉?
-- svc_user, svc_session, svc_query_log, res_hs_mapin_fin,
-- res_regulation_std, res_taxcalc_std, res_combtax_risk,
-- reason_res, svc_news_map, svc_query_result, svc_result_view_log
-- =========================================================

BEGIN;

-- =========================================================
-- 0. ?ъ떎?됱쓣 ?꾪븳 湲곗〈 mock ?곗씠???뺣━
-- =========================================================

DELETE FROM svc_result_view_log
WHERE view_log_id BETWEEN 39001 AND 39007;

DELETE FROM svc_query_result
WHERE query_result_id BETWEEN 38001 AND 38007;

DELETE FROM svc_news_map
WHERE news_map_id BETWEEN 37001 AND 37007;

DELETE FROM reason_res
WHERE reason_id BETWEEN 36001 AND 36028;

DELETE FROM res_combtax_risk
WHERE combined_id BETWEEN 35001 AND 35007;

DELETE FROM res_taxcalc_std
WHERE calc_id BETWEEN 33001 AND 33007;

DELETE FROM res_regulation_std
WHERE risk_id BETWEEN 32001 AND 32007;

DELETE FROM res_hs_mapin_fin
WHERE mapping_id BETWEEN 31001 AND 31007;

DELETE FROM svc_query_log
WHERE query_log_id IN (
  'dddddddd-dddd-dddd-dddd-dddddddddd01',
  'dddddddd-dddd-dddd-dddd-dddddddddd02',
  'dddddddd-dddd-dddd-dddd-dddddddddd03',
  'dddddddd-dddd-dddd-dddd-dddddddddd04',
  'dddddddd-dddd-dddd-dddd-dddddddddd05',
  'dddddddd-dddd-dddd-dddd-dddddddddd06',
  'dddddddd-dddd-dddd-dddd-dddddddddd07'
);

DELETE FROM svc_session
WHERE session_id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1';

-- =========================================================
-- 1. ?ъ슜??/ ?몄뀡 / URL 議고쉶 濡쒓렇
-- ?곹뭹 snapshot? 蹂꾨룄 ?꾩떆 ?뚯씠釉??놁씠 svc_query_log.option_json????ν빀?덈떎.
-- =========================================================

INSERT INTO svc_user (
  user_id, login_type, social_id, email, user_nm, profile_img_url,
  last_login_at, is_active, created_at, updated_at
) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EMAIL', NULL, 'henry@example.com', 'Henry', NULL, NOW(), TRUE, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO svc_session (
  session_id, user_id, session_key, device_type, user_agent, ip_hash,
  started_at, ended_at, created_at
) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'amazon_mock_sess_001', 'PC', 'Mozilla/5.0 Chrome', 'amazon_mock_ip_001', NOW() - INTERVAL '1 hour', NULL, NOW());

INSERT INTO svc_query_log (
  query_log_id, session_id, user_id, query_type, input_type, input_value,
  product_id, option_json, request_status, error_msg, requested_at, created_at
) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddd01', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'INIT', 'URL', 'https://www.amazon.com/Marshall-Acton-Bluetooth-Speaker-Cream/dp/B0BBYF2SXX', 3001, '{"asin":"B0BBYF2SXX","slug":"Marshall","title":"Marshall Acton III Bluetooth Home Speaker, Cream","brand":"Marshall","category":"Bluetooth speaker","option":"Cream","seller":"BuySafe Mock Store","originCountry":"China","unitPriceUsd":279.99,"shippingUsd":18.50,"currency":"USD","country":"US"}'::jsonb, 'SUCCESS', NULL, NOW() - INTERVAL '55 minute', NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd02', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'INIT', 'URL', 'https://www.amazon.com/-/ko/dp/B0DD8SHVZL', 3002, '{"asin":"B0DD8SHVZL","slug":"Sony","title":"Sony MDR-M1 Professional Reference Closed Monitor Headphones","brand":"Sony","category":"Studio monitor headphones","option":"Black","seller":"BuySafe Mock Store","originCountry":"Thailand","unitPriceUsd":248.00,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb, 'SUCCESS', NULL, NOW() - INTERVAL '50 minute', NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd03', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'INIT', 'URL', 'https://www.amazon.com/dp/B0DBMM6S89', 3003, '{"asin":"B0DBMM6S89","slug":"Garmin","title":"Garmin Forerunner 55 GPS Running Smartwatch (Black) Power Bundle","brand":"Garmin","category":"GPS running smartwatch","option":"Black","seller":"BuySafe Mock Store","originCountry":"Taiwan","unitPriceUsd":189.00,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb, 'SUCCESS', NULL, NOW() - INTERVAL '45 minute', NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd04', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'INIT', 'URL', 'https://www.amazon.com/-/ko/dp/B0DZ75TN5F', 3004, '{"asin":"B0DZ75TN5F","slug":"iPad","title":"Apple iPad 11-inch: A16 chip, Liquid Retina Display, 128GB, Wi-Fi 6, 12MP Cameras, Touch ID, All-Day Battery Life - Blue","brand":"Apple","category":"Tablet computer","option":"Blue / 128GB / Wi-Fi","seller":"BuySafe Mock Store","originCountry":"China","unitPriceUsd":299.00,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb, 'SUCCESS', NULL, NOW() - INTERVAL '40 minute', NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd05', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'INIT', 'URL', 'https://www.amazon.com/-/ko/dp/B07NWMVMT1', 3005, '{"asin":"B07NWMVMT1","slug":"Magnesium","title":"NOW Supplements, Magnesium Glycinate 100 mg, Highly Absorbable Form, 180 Tablets","brand":"NOW","category":"Dietary supplement","option":"180 Tablets","seller":"BuySafe Mock Store","originCountry":"United States","unitPriceUsd":24.99,"shippingUsd":5.49,"currency":"USD","country":"US"}'::jsonb, 'SUCCESS', NULL, NOW() - INTERVAL '35 minute', NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd06', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'INIT', 'URL', 'https://www.amazon.com/-/ko/dp/B000SE5SY6', 3006, '{"asin":"B000SE5SY6","slug":"Omega3","title":"NOW Foods Supplements, Ultra Omega-3 Molecularly Distilled and Enteric Coated, 180 Softgels","brand":"NOW Foods","category":"Omega-3 supplement","option":"180 Softgels","seller":"BuySafe Mock Store","originCountry":"United States","unitPriceUsd":31.99,"shippingUsd":4.99,"currency":"USD","country":"US"}'::jsonb, 'SUCCESS', NULL, NOW() - INTERVAL '30 minute', NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd07', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'INIT', 'URL', 'https://www.amazon.com/-/ko/dp/B07PGR2Z62', 3007, '{"asin":"B07PGR2Z62","slug":"CalvinKlein","title":"Calvin Klein Men''s Cotton Classics 7-Pack Boxer Brief, 7 Black, Large","brand":"Calvin Klein","category":"Men''s underwear","option":"7 Black / Large","seller":"BuySafe Mock Store","originCountry":"Imported","unitPriceUsd":59.68,"shippingUsd":0,"currency":"USD","country":"US"}'::jsonb, 'SUCCESS', NULL, NOW() - INTERVAL '25 minute', NOW());

-- =========================================================
-- 2. HS 理쒖쥌 寃곌낵
-- =========================================================

INSERT INTO res_hs_mapin_fin (
  mapping_id, product_id, hs_id, predicted_hs, mapping_method,
  confidence_score, is_final, created_at
) VALUES
(31001, 3001, 851822, '8518220000', 'AI',      84.00, TRUE, NOW() - INTERVAL '55 minute'),
(31002, 3002, 851830, '8518309000', 'AI',      90.00, TRUE, NOW() - INTERVAL '50 minute'),
(31003, 3003, 910212, '9102120000', 'AI',      82.00, TRUE, NOW() - INTERVAL '45 minute'),
(31004, 3004, 847130, '8471300000', 'AI',      88.00, TRUE, NOW() - INTERVAL '40 minute'),
(31005, 3005, 210690, '2106909099', 'RULE+AI', 76.00, TRUE, NOW() - INTERVAL '35 minute'),
(31006, 3006, 210690, '2106909099', 'RULE+AI', 74.00, TRUE, NOW() - INTERVAL '30 minute'),
(31007, 3007, 610711, '6107110000', 'AI',      86.00, TRUE, NOW() - INTERVAL '25 minute');

-- =========================================================
-- 3. 洹쒖젣 / ?몄쬆 寃곌낵
-- =========================================================

INSERT INTO res_regulation_std (
  risk_id, product_id, hs_id, is_restricted, kc_required,
  risk_level, risk_summary, created_at
) VALUES
(32001, 3001, 851822, FALSE, TRUE,  'MEDIUM', 'Bluetooth ?ㅽ뵾而ㅻ줈 ?꾪뙆/KC ?뺤씤???꾩슂?????덉뒿?덈떎.', NOW() - INTERVAL '54 minute'),
(32002, 3002, 851830, FALSE, FALSE, 'LOW',    '?좎꽑 紐⑤땲???ㅻ뱶??mock ?덈ぉ?쇰줈 ?쒗븳 ?꾪뿕????뒿?덈떎.', NOW() - INTERVAL '49 minute'),
(32003, 3003, 910212, FALSE, TRUE,  'MEDIUM', 'GPS/Bluetooth 諛??댁옣 諛고꽣由??뱀꽦?쇰줈 KC쨌諛고꽣由??뺤씤???꾩슂?⑸땲??', NOW() - INTERVAL '44 minute'),
(32004, 3004, 847130, FALSE, TRUE,  'MEDIUM', 'Wi-Fi ?쒕툝由욧낵 ?댁옣 諛고꽣由щ줈 媛쒖씤?ъ슜 ?섎웾 諛?KC 硫댁젣 議곌굔 ?뺤씤???꾩슂?⑸땲??', NOW() - INTERVAL '39 minute'),
(32005, 3005, 210690, FALSE, FALSE, 'HIGH',   '嫄닿컯蹂댁“?앺뭹?쇰줈 ?깅텇쨌?⑸웾쨌媛쒖씤?듦? ?섎웾 ?쒗븳 ?뺤씤???꾩슂?⑸땲??', NOW() - INTERVAL '34 minute'),
(32006, 3006, 210690, FALSE, FALSE, 'HIGH',   '?댁쑀 湲곕컲 Omega-3 蹂댁땐?쒕줈 ?앺뭹쨌?깅텇 愿???섏엯 寃?좉? ?꾩슂?⑸땲??', NOW() - INTERVAL '29 minute'),
(32007, 3007, 610711, FALSE, FALSE, 'LOW',    '?쇰컲 ?섎쪟 ?덈ぉ?쇰줈 諛고꽣由?룹쟾?뙿룹떇??愿???쒗븳 ?꾪뿕????뒿?덈떎.', NOW() - INTERVAL '24 minute');

-- =========================================================
-- 4. ?멸툑 怨꾩궛 寃곌낵
-- exchange rate: 1 USD = 1,380 KRW
-- =========================================================

INSERT INTO res_taxcalc_std (
  calc_id, product_id, mapping_id, price_id, cif_amount,
  duty_amount, vat_amount, etc_tax, total_tax, total_cost, created_at
) VALUES
(33001, 3001, 31001, 34001, 411916.00, 32953.00, 44487.00,    0.00, 77440.00, 489356.00, NOW() - INTERVAL '54 minute'),
(33002, 3002, 31002, 34002, 342240.00, 27379.00, 36962.00,    0.00, 64341.00, 406581.00, NOW() - INTERVAL '49 minute'),
(33003, 3003, 31003, 34003, 260820.00, 20866.00, 28169.00,    0.00, 49035.00, 309855.00, NOW() - INTERVAL '44 minute'),
(33004, 3004, 31004, 34004, 412620.00,     0.00, 41262.00,    0.00, 41262.00, 453882.00, NOW() - INTERVAL '39 minute'),
(33005, 3005, 31005, 34005,  42062.00,  3365.00,  4543.00,    0.00,  7908.00,  49970.00, NOW() - INTERVAL '34 minute'),
(33006, 3006, 31006, 34006,  51032.00,  4083.00,  5512.00,    0.00,  9595.00,  60627.00, NOW() - INTERVAL '29 minute'),
(33007, 3007, 31007, 34007,  82358.00,     0.00,     0.00,    0.00,     0.00,  82358.00, NOW() - INTERVAL '24 minute');

-- =========================================================
-- 5. ?⑹궛怨쇱꽭 ?꾪뿕 寃곌낵
-- =========================================================

INSERT INTO res_combtax_risk (
  combined_id, product_id, receiver_key, seller_key,
  risk_level, warning_msg, created_at
) VALUES
(35001, 3001, 'recv_henry_home', 'seller_amazon_mock', 'LOW',    '?숈씪 ?섏랬??湲곗? ?⑹궛怨쇱꽭 吏뺥썑 ?놁쓬', NOW() - INTERVAL '54 minute'),
(35002, 3002, 'recv_henry_home', 'seller_amazon_mock', 'LOW',    '?⑥씪 ?ㅻ뱶??二쇰Ц 湲곗? ?⑹궛怨쇱꽭 ?꾪뿕 ??쓬', NOW() - INTERVAL '49 minute'),
(35003, 3003, 'recv_henry_home', 'seller_amazon_mock', 'MEDIUM', '?꾩옄湲곌린 諛섎났 援щℓ ???숈씪 ?낇빆???⑹궛怨쇱꽭 媛?μ꽦 ?뺤씤 ?꾩슂', NOW() - INTERVAL '44 minute'),
(35004, 3004, 'recv_henry_home', 'seller_amazon_mock', 'MEDIUM', '怨좉? ?꾩옄湲곌린? ?숈씪???낇빆 二쇰Ц???덉쑝硫??⑹궛怨쇱꽭 媛?μ꽦 ?덉쓬', NOW() - INTERVAL '39 minute'),
(35005, 3005, 'recv_henry_home', 'seller_amazon_mock', 'MEDIUM', '嫄닿컯蹂댁“?앺뭹 蹂듭닔 援щℓ ???섎웾 ?쒗븳 諛??⑹궛怨쇱꽭 ?숈떆 ?뺤씤 ?꾩슂', NOW() - INTERVAL '34 minute'),
(35006, 3006, 'recv_henry_home', 'seller_amazon_mock', 'MEDIUM', '蹂댁땐??諛섎났 二쇰Ц ?대젰怨??④퍡 寃???꾩슂', NOW() - INTERVAL '29 minute'),
(35007, 3007, 'recv_henry_home', 'seller_amazon_mock', 'LOW',    '?쇰컲 ?섎쪟 ?⑥씪 二쇰Ц 湲곗? ?⑹궛怨쇱꽭 ?꾪뿕 ??쓬', NOW() - INTERVAL '24 minute');

-- =========================================================
-- 6. ?ㅻ챸 / 洹쇨굅
-- =========================================================

INSERT INTO reason_res (
  reason_id, target_type, target_id, explanation, reason_type,
  reference_url, created_at
) VALUES
(36001, 'HS',         31001, 'Bluetooth Home Speaker ?ㅼ썙?쒕? 洹쇨굅濡??숈씪 ?명겢濡쒖? ??蹂듭닔 ?ㅽ뵾而ㅻ쪟濡?遺꾨쪟?덉뒿?덈떎.', 'AI_SUMMARY',   'https://example.com/hs/851822', NOW() - INTERVAL '54 minute'),
(36002, 'TAX',        33001, '?곹뭹媛? 諛곗넚鍮꾨? ?⑹궛??CIF 湲덉븸??愿?몄? 遺媛?몃? 怨꾩궛?덉뒿?덈떎.', 'CALC_LOGIC', 'https://example.com/tax/speaker', NOW() - INTERVAL '54 minute'),
(36003, 'REGULATION', 32001, 'Bluetooth 湲곕뒫???덉뼱 ?꾪뙆/KC 愿???뺤씤 臾멸뎄瑜??몄텧?⑸땲??', 'RULE_SUMMARY', 'https://example.com/reg/bluetooth', NOW() - INTERVAL '54 minute'),
(36004, 'RISK',       35001, '?⑥씪 二쇰Ц mock ?곗씠?곕줈 ?⑹궛怨쇱꽭 ?꾪뿕????쾶 ?됯??덉뒿?덈떎.', 'RISK_SUMMARY', 'https://example.com/risk/low', NOW() - INTERVAL '54 minute'),
(36005, 'HS',         31002, 'Professional Reference Closed Monitor Headphones ?뺣낫瑜?洹쇨굅濡??ㅻ뱶?곕쪟濡?遺꾨쪟?덉뒿?덈떎.', 'AI_SUMMARY', 'https://example.com/hs/851830', NOW() - INTERVAL '49 minute'),
(36006, 'TAX',        33002, '?ㅻ뱶??怨쇱꽭媛寃?湲곗??쇰줈 愿?몄? 遺媛?몃? 怨꾩궛?덉뒿?덈떎.', 'CALC_LOGIC', 'https://example.com/tax/headphones', NOW() - INTERVAL '49 minute'),
(36007, 'REGULATION', 32002, '?좎꽑 ?ㅻ뱶?곗쑝濡?媛?뺥븯??臾댁꽑 ?몄쬆 ?꾪뿕????쾶 ?됯??덉뒿?덈떎.', 'RULE_SUMMARY', 'https://example.com/reg/headphones', NOW() - INTERVAL '49 minute'),
(36008, 'RISK',       35002, '?숈씪 ?섏랬??諛섎났 二쇰Ц 吏뺥썑媛 ?놁뼱 ?⑹궛怨쇱꽭 ?꾪뿕????뒿?덈떎.', 'RISK_SUMMARY', 'https://example.com/risk/low', NOW() - INTERVAL '49 minute'),
(36009, 'HS',         31003, 'GPS Running Smartwatch ?뺣낫瑜?洹쇨굅濡??꾧린???먮ぉ?쒓퀎瑜섎줈 遺꾨쪟?덉뒿?덈떎.', 'AI_SUMMARY', 'https://example.com/hs/910212', NOW() - INTERVAL '44 minute'),
(36010, 'TAX',        33003, '?ㅻ쭏?몄썙移??곹뭹媛 湲곗??쇰줈 愿?몄? 遺媛?몃? 怨꾩궛?덉뒿?덈떎.', 'CALC_LOGIC', 'https://example.com/tax/smartwatch', NOW() - INTERVAL '44 minute'),
(36011, 'REGULATION', 32003, 'GPS/Bluetooth/諛고꽣由??뱀꽦?쇰줈 ?몄쬆 諛??댁넚 ?뺤씤???꾩슂?⑸땲??', 'RULE_SUMMARY', 'https://example.com/reg/watch', NOW() - INTERVAL '44 minute'),
(36012, 'RISK',       35003, '?꾩옄湲곌린 諛섎났 援щℓ 媛?μ꽦??以묎컙 ?섏??쇰줈 ?쒖떆?덉뒿?덈떎.', 'RISK_SUMMARY', 'https://example.com/risk/medium', NOW() - INTERVAL '44 minute'),
(36013, 'HS',         31004, 'iPad??CPU, ??μ옣移? ?붿뒪?뚮젅?대? 媛뽰텣 ?대????먮룞?먮즺泥섎━湲곌린濡?遺꾨쪟?덉뒿?덈떎.', 'AI_SUMMARY', 'https://example.com/hs/847130', NOW() - INTERVAL '39 minute'),
(36014, 'TAX',        33004, '?쒕툝由?mock ?덈ぉ? 愿?몄쑉 0%, 遺媛??10%濡?怨꾩궛?덉뒿?덈떎.', 'CALC_LOGIC', 'https://example.com/tax/tablet', NOW() - INTERVAL '39 minute'),
(36015, 'REGULATION', 32004, 'Wi-Fi 諛?諛고꽣由??댁옣 ?쒗뭹?쇰줈 媛쒖씤?ъ슜 ?섎웾怨?KC 議곌굔???뺤씤?⑸땲??', 'RULE_SUMMARY', 'https://example.com/reg/tablet', NOW() - INTERVAL '39 minute'),
(36016, 'RISK',       35004, '怨좉? ?꾩옄湲곌린? ?숈씪???낇빆 二쇰Ц???덉쑝硫??⑹궛怨쇱꽭 媛?μ꽦???덉뒿?덈떎.', 'RISK_SUMMARY', 'https://example.com/risk/medium', NOW() - INTERVAL '39 minute'),
(36017, 'HS',         31005, 'Magnesium Glycinate supplement??嫄닿컯蹂댁“?앺뭹 ?깃꺽??議곗젣?덉쑝濡?遺꾨쪟?덉뒿?덈떎.', 'AI_SUMMARY', 'https://example.com/hs/210690', NOW() - INTERVAL '34 minute'),
(36018, 'TAX',        33005, '?곹뭹媛? 諛곗넚鍮꾨? 湲곗??쇰줈 蹂댁땐??mock ?몄븸??怨꾩궛?덉뒿?덈떎.', 'CALC_LOGIC', 'https://example.com/tax/supplement', NOW() - INTERVAL '34 minute'),
(36019, 'REGULATION', 32005, '嫄닿컯蹂댁“?앺뭹? ?깅텇, ?⑸웾, ?섎웾 ?쒗븳 ?뺤씤???꾩슂?⑸땲??', 'RULE_SUMMARY', 'https://example.com/reg/supplement', NOW() - INTERVAL '34 minute'),
(36020, 'RISK',       35005, '蹂댁땐??蹂듭닔 援щℓ ???섎웾 ?쒗븳怨??⑹궛怨쇱꽭瑜??④퍡 ?뺤씤?댁빞 ?⑸땲??', 'RISK_SUMMARY', 'https://example.com/risk/medium', NOW() - INTERVAL '34 minute'),
(36021, 'HS',         31006, 'Omega-3 softgels??蹂댁땐???깃꺽??議곗젣?덉쑝濡?遺꾨쪟?덉뒿?덈떎.', 'AI_SUMMARY', 'https://example.com/hs/210690', NOW() - INTERVAL '29 minute'),
(36022, 'TAX',        33006, 'Omega-3 蹂댁땐??mock 怨쇱꽭媛寃⑹뿉 愿?몄? 遺媛?몃? 怨꾩궛?덉뒿?덈떎.', 'CALC_LOGIC', 'https://example.com/tax/omega3', NOW() - INTERVAL '29 minute'),
(36023, 'REGULATION', 32006, '?댁쑀 湲곕컲 ?깅텇?쇰줈 ?앺뭹쨌?깅텇 愿???섏엯 寃?좉? ?꾩슂?⑸땲??', 'RULE_SUMMARY', 'https://example.com/reg/fishoil', NOW() - INTERVAL '29 minute'),
(36024, 'RISK',       35006, '蹂댁땐??諛섎났 二쇰Ц ?대젰怨??④퍡 寃?좏빐???⑸땲??', 'RISK_SUMMARY', 'https://example.com/risk/medium', NOW() - INTERVAL '29 minute'),
(36025, 'HS',         31007, 'Cotton boxer briefs ?뺣낫瑜?洹쇨굅濡??⑥꽦??硫댁젣 ?덊듃 ?띿샆瑜섎줈 遺꾨쪟?덉뒿?덈떎.', 'AI_SUMMARY', 'https://example.com/hs/610711', NOW() - INTERVAL '24 minute'),
(36026, 'TAX',        33007, '미국발 개인사용 의류 mock 상품가가 $200 이하라 목록통관 면세 대상으로 계산했습니다.', 'CALC_LOGIC', 'https://example.com/tax/apparel', NOW() - INTERVAL '24 minute'),
(36027, 'REGULATION', 32007, '?쇰컲 ?섎쪟濡??앺뭹쨌諛고꽣由?룹쟾??愿???쒗븳 ?꾪뿕????뒿?덈떎.', 'RULE_SUMMARY', 'https://example.com/reg/apparel', NOW() - INTERVAL '24 minute'),
(36028, 'RISK',       35007, '?⑥씪 ?섎쪟 二쇰Ц 湲곗? ?⑹궛怨쇱꽭 ?꾪뿕????뒿?덈떎.', 'RISK_SUMMARY', 'https://example.com/risk/low', NOW() - INTERVAL '24 minute');

-- =========================================================
-- 7. ?댁뒪
-- =========================================================

INSERT INTO svc_news_map (
  news_map_id, hs_id, risk_type, title, source_nm, source_url,
  published_at, is_active, created_at
) VALUES
(37001, 851822, 'WIRELESS',   'Bluetooth ?ㅽ뵾而?吏곴뎄 ???꾪뙆 ?몄쬆 ?뺤씤 ?꾩슂', 'Import News', 'https://example.com/news/bluetooth-speaker', NOW() - INTERVAL '3 day', TRUE, NOW()),
(37002, 851830, 'AUDIO',      '?ㅻ뱶?걔룹씠?댄룿瑜??듦? 遺꾨쪟 李멸퀬?ы빆', 'Customs Insight', 'https://example.com/news/headphones', NOW() - INTERVAL '5 day', TRUE, NOW()),
(37003, 910212, 'BATTERY',    '?ㅻ쭏?몄썙移??댁옣 諛고꽣由??쒗뭹 ?댁넚 ?뺤씤 ?꾩슂', 'Trade Watch', 'https://example.com/news/smartwatch', NOW() - INTERVAL '2 day', TRUE, NOW()),
(37004, 847130, 'ELECTRONIC', '?쒕툝由?PC 媛쒖씤?ъ슜 ?섏엯 ???뺤씤 ??ぉ', 'Market Brief', 'https://example.com/news/tablet', NOW() - INTERVAL '4 day', TRUE, NOW()),
(37005, 210690, 'FOOD',       '嫄닿컯蹂댁“?앺뭹 吏곴뎄 ?섎웾 ?쒗븳 諛??깅텇 ?뺤씤 ?덈궡', 'Food Import Daily', 'https://example.com/news/supplement', NOW() - INTERVAL '1 day', TRUE, NOW()),
(37006, 210690, 'FOOD',       'Omega-3 ???댁쑀 ?쒗뭹 ?섏엯 ???깅텇 寃???꾩슂', 'Food Import Daily', 'https://example.com/news/omega3', NOW() - INTERVAL '1 day', TRUE, NOW()),
(37007, 610711, 'APPAREL',    '?섎쪟 吏곴뎄 ???뚯옱蹂?HS 遺꾨쪟 李멸퀬?ы빆', 'Trade Daily', 'https://example.com/news/apparel', NOW() - INTERVAL '6 day', TRUE, NOW());

-- =========================================================
-- 8. 議고쉶 寃곌낵 ?곌껐
-- =========================================================

INSERT INTO svc_query_result (
  query_result_id, query_log_id, product_id, hs_mapping_id, taxcalc_id,
  regulation_id, combtax_risk_id, result_status, created_at
) VALUES
(38001, 'dddddddd-dddd-dddd-dddd-dddddddddd01', 3001, 31001, 33001, 32001, 35001, 'SUCCESS', NOW() - INTERVAL '54 minute'),
(38002, 'dddddddd-dddd-dddd-dddd-dddddddddd02', 3002, 31002, 33002, 32002, 35002, 'SUCCESS', NOW() - INTERVAL '49 minute'),
(38003, 'dddddddd-dddd-dddd-dddd-dddddddddd03', 3003, 31003, 33003, 32003, 35003, 'SUCCESS', NOW() - INTERVAL '44 minute'),
(38004, 'dddddddd-dddd-dddd-dddd-dddddddddd04', 3004, 31004, 33004, 32004, 35004, 'SUCCESS', NOW() - INTERVAL '39 minute'),
(38005, 'dddddddd-dddd-dddd-dddd-dddddddddd05', 3005, 31005, 33005, 32005, 35005, 'PARTIAL', NOW() - INTERVAL '34 minute'),
(38006, 'dddddddd-dddd-dddd-dddd-dddddddddd06', 3006, 31006, 33006, 32006, 35006, 'PARTIAL', NOW() - INTERVAL '29 minute'),
(38007, 'dddddddd-dddd-dddd-dddd-dddddddddd07', 3007, 31007, 33007, 32007, 35007, 'SUCCESS', NOW() - INTERVAL '24 minute');

-- =========================================================
-- 9. ?대엺 濡쒓렇
-- =========================================================

INSERT INTO svc_result_view_log (
  view_log_id, query_log_id, query_result_id, view_type, target_id, viewed_at, created_at
) VALUES
(39001, 'dddddddd-dddd-dddd-dddd-dddddddddd01', 38001, 'HS_REASON',  31001, NOW() - INTERVAL '53 minute', NOW()),
(39002, 'dddddddd-dddd-dddd-dddd-dddddddddd02', 38002, 'TAX_REASON', 33002, NOW() - INTERVAL '48 minute', NOW()),
(39003, 'dddddddd-dddd-dddd-dddd-dddddddddd03', 38003, 'RISK',       35003, NOW() - INTERVAL '43 minute', NOW()),
(39004, 'dddddddd-dddd-dddd-dddd-dddddddddd04', 38004, 'NEWS',       37004, NOW() - INTERVAL '38 minute', NOW()),
(39005, 'dddddddd-dddd-dddd-dddd-dddddddddd05', 38005, 'REGULATION', 32005, NOW() - INTERVAL '33 minute', NOW()),
(39006, 'dddddddd-dddd-dddd-dddd-dddddddddd06', 38006, 'REGULATION', 32006, NOW() - INTERVAL '28 minute', NOW()),
(39007, 'dddddddd-dddd-dddd-dddd-dddddddddd07', 38007, 'HS_REASON',  31007, NOW() - INTERVAL '23 minute', NOW());

COMMIT;

