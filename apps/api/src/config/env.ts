import "dotenv/config";

const requiredEnv = ["SUPABASE_URL", "SUPABASE_KEY"] as const;

type RequiredEnvKey = (typeof requiredEnv)[number];

type EnvConfig = Record<RequiredEnvKey, string>;

function getRequiredEnvVar(key: RequiredEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getEnvConfig(): EnvConfig {
  return {
    SUPABASE_URL: getRequiredEnvVar("SUPABASE_URL"),
    SUPABASE_KEY: getRequiredEnvVar("SUPABASE_KEY"),
  };
}
