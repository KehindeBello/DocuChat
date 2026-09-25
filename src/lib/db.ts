import { config } from "./config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: config.DATABASE_URL})
export const prisma = new PrismaClient({ 
  adapter, 
  log: config.NODE_ENV === 'development' 
  ? ['info','query','warn','error'] : ['warn', 'error']
});