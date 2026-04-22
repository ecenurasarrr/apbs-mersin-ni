import "dotenv/config";
import { defineConfig } from "prisma/config";

const url =
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  "";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url,
  },
});
