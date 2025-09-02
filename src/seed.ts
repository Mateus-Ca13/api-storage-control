// prisma/seed.ts
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar categorias
  const catAlimentos = await prisma.category.create({ data: { name: "Alimentos" } });
  const catBebidas = await prisma.category.create({ data: { name: "Bebidas" } });
  const catLimpeza = await prisma.category.create({ data: { name: "Limpeza" } });
  const catHigiene = await prisma.category.create({ data: { name: "Higiene" } });

  const produtos = [];

  for (let i = 1; i <= 50; i++) {
    const categoria = [catAlimentos, catBebidas, catLimpeza, catHigiene][Math.floor(Math.random() * 4)];
    const medida = ["UN", "KG", "L", "M"][Math.floor(Math.random() * 4)];

    produtos.push({
      name: `Produto ${i}`,
      measurement: medida as "UN" | "KG" | "L" | "M",
      codebar: `00000000${i}`,
      categoryId: categoria.id,
      minimumAmount: Math.floor(Math.random() * 10) + 1,
      description: `Descrição do Produto ${i}`,
    });
  }

  await prisma.product.createMany({ data: produtos });

  console.log("Seed de 50 produtos finalizado!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });


  // npx ts-node src/seed.ts -> comando para rodar o seed