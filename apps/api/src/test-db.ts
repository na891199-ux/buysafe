import { supabase } from "./db/index.js";

async function checkResultTables() {
  console.log("Checking result tables...");

  const { count, error } = await supabase
    .from("svc_query_log")
    .select("*", { count: "exact", head: true })
    .eq("option_json->>asin", "B0DZ75TN5F");

  if (error) {
    console.error("Database check failed:", error.message);
    process.exit(1);
  }

  console.log("svc_query_log table found.");
  console.log("iPad mock row count:", count);
}

checkResultTables();
