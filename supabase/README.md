# BuySafe Test Database

The `/result` flow uses the project's real result tables.

Run this file in Supabase SQL Editor:

```text
supabase/import_amazon_mock_result_tables.sql
```

The API reads data through `svc_query_log.option_json->>asin`, then joins:

```text
svc_query_result
res_hs_mapin_fin
res_taxcalc_std
res_regulation_std
res_combtax_risk
reason_res
```

Endpoint:

```text
GET http://localhost:5174/api/product-lookup?url={amazon-url}
```
