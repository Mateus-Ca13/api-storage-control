// prisma/seed.ts
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar categorias
  const catAlimentos = await prisma.category.create({ data: { name: "Alimentos", colorPreset: 4 } });
  const catBebidas = await prisma.category.create({ data: { name: "Bebidas", colorPreset: 1 } });
  const catLimpeza = await prisma.category.create({ data: { name: "Limpeza", colorPreset: 2 } });
  const catHigiene = await prisma.category.create({ data: { name: "Higiene", colorPreset: 3 } });

  const produtos = [];

  for (let i = 1; i <= 50; i++) {
    const categoria = [catAlimentos, catBebidas, catLimpeza, catHigiene][Math.floor(Math.random() * 4)];
    const medida = ["UN", "KG", "L", "M"][Math.floor(Math.random() * 4)];

    produtos.push({
      name: `Produto ${i}`,
      measurement: medida as "UN" | "KG" | "L" | "M",
      codebar: `00000000${i}`,
      categoryId: categoria.id,
      minStock: Math.floor(Math.random() * 10) + 1,
      description: `Descrição do Produto ${i}`,
    });
  }

  await prisma.product.createMany({ data: produtos });
  console.log("Seed de 50 produtos finalizado!");

  const estoques = []
  for (let i = 1; i <= 10; i++) {
    estoques.push({
      name: `Estoque ${i}`,
      type: ["CENTRAL", "SECONDARY"][Math.floor(Math.random() * 2)] as "CENTRAL" | "SECONDARY",
      status: ["ACTIVE", "MAINTENANCE", "INACTIVE"][Math.floor(Math.random() * 3)] as "ACTIVE" | "MAINTENANCE" | "INACTIVE",
    });

  }

  await prisma.stock.createMany({ data: estoques });
  console.log("Seed de 10 estoques finalizado!");

  const produtosEstocados = [];

  for (let i = 0; i < 50; i++) {
    produtosEstocados.push({
      productId: Math.floor(Math.random() * produtos.length) + 1,
      stockId: Math.floor(Math.random() * estoques.length) + 1,
      quantity: Math.floor(Math.random() * 10) + 1,
    });
  }
  await prisma.stockedProduct.createMany({ data: produtosEstocados, skipDuplicates: true});
  console.log("Seed de 50 produtos em estoque finalizado!");

  const usuarios = [];
  for (let i = 1; i <= 5; i++) {
    usuarios.push({
      name: `Usuário ${i}`,
      username: `usuario${i}`,
      email: `usuario${i}@gmail.com`,
      password: "senha123",
      role: ["ADMIN", "USER"][Math.floor(Math.random() * 2)] as "ADMIN" | "USER",
    });
  }

  await prisma.user.createMany({ data: usuarios });
  console.log("Seed de 5 usuários finalizado!");
    

  const lotesdeMovimentacoes = [];

  for(let i = 1; i <= 10; i++){
    lotesdeMovimentacoes.push({
      type: ["ENTRY", "EXIT", "TRANSFER"][Math.floor(Math.random() * 3)] as "ENTRY" | "EXIT" | "TRANSFER",
      originStockId: Math.floor(Math.random() * estoques.length) + 1,
      destinationStockId: Math.floor(Math.random() * estoques.length) + 1,
      observations: `Observação da movimentação ${i}`,
      userCreatorId: Math.floor(Math.random() * usuarios.length) + 1,
    }
    )
  }
  await prisma.movementBatch.createMany({ data: lotesdeMovimentacoes });
  console.log("Seed de 10 lotes de movimentação finalizado!");

  const produtosMovimentados = [];
  for(let i = 1; i <= 50; i++){
    produtosMovimentados.push({
      productId: Math.floor(Math.random() * produtos.length) + 1,
      movementBatchId: Math.floor(Math.random() * lotesdeMovimentacoes.length) + 1,
      quantity: Math.floor(Math.random() * 10) + 1,
      pricePerUnit: Math.floor(Math.random() * 100) + 1,
    })
  }
  await prisma.movementProduct.createMany({ data: produtosMovimentados });
  console.log("Seed de 50 produtos movimentados finalizado!");

  console.log("Seed finalizada!");

  }





main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });


  // npx ts-node src/seed.ts -> comando para rodar o seed