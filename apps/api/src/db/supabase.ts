import { createClient } from "@supabase/supabase-js";

import { getEnvConfig } from "../config/env";

const { SUPABASE_URL, SUPABASE_KEY } = getEnvConfig();

/**
 * Shared server-side Supabase client.
 *
 * Database logic remains in the backend by exposing this client only from `/apps/api`.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
