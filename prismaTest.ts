
import { PrismaClient } from './generated/prisma/client'

const prisma = new PrismaClient();

async function main() {
  console.log("Prisma Client carregado!");
}

main()
  .then(() => console.log("OK"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
