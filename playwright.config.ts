import { defineConfig, devices } from "@playwright/test";

const localSupabaseUrl = process.env.E2E_SUPABASE_URL || "http://127.0.0.1:54321";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_SUPABASE_URL: localSupabaseUrl,
      VITE_SUPABASE_ANON_KEY: process.env.E2E_SUPABASE_ANON_KEY || "",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
