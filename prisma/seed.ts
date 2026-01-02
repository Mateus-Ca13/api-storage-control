// prisma/seed.ts
import bcrypt from "bcrypt";
import prisma from "../src/lib/prismaClient";
import { UserCreateInput } from "../src/types/user";

async function seedSimple() {
  console.log("Iniciando seed...");

  const catAlimentos = await prisma.category.create({ data: { name: "Alimentos", colorPreset: 4 } });
  const catBebidas = await prisma.category.create({ data: { name: "Bebidas", colorPreset: 1 } });
  const catLimpeza = await prisma.category.create({ data: { name: "Limpeza", colorPreset: 2 } });
  const catHigiene = await prisma.category.create({ data: { name: "Higiene", colorPreset: 3 } });


  const produtos = [];

  for (let i = 1; i <= 10; i++) {
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

  const estoques = []
  for (let i = 1; i <= 2; i++) {
    estoques.push({
      name: `Estoque ${i}`,
      type: ["CENTRAL", "SECONDARY"][Math.floor(Math.random() * 2)] as "CENTRAL" | "SECONDARY",
      status: ["ACTIVE", "MAINTENANCE", "INACTIVE"][Math.floor(Math.random() * 3)] as "ACTIVE" | "MAINTENANCE" | "INACTIVE",
    });

  }

  await prisma.stock.createMany({ data: estoques });

    const passwordHash = bcrypt.hashSync("admin", 10);

    const usuarios: UserCreateInput = {
        name: `Mateus Cavichion`,
        username: `Cavichion`,
        email: `admin@gmail.com`,
        password: passwordHash,
        role: "SUPER_ADMIN",
      };

    await prisma.user.createMany({ data: usuarios });

  console.log("Seed finalizada!");
  
}

async function seedMassive() {
  console.log("Iniciando seed massiva...");

  const categories = [];
  for (let i = 1; i <= 50; i++) {
    categories.push({
      name: `Categoria ${i}`,
      colorPreset: Math.floor(Math.random() * 5) + 1,
    });
  }
  await prisma.category.createMany({ data: categories });
  const createdCategories = await prisma.category.findMany();

  const products = [];
  for (let i = 1; i <= 1000; i++) {
    const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
    const measurement = ["UN", "KG", "L", "M"][Math.floor(Math.random() * 4)];
    products.push({
      name: `Produto Massivo ${i}`,
      measurement: measurement as "UN" | "KG" | "L" | "M",
      codebar: `${String(i).padStart(7, '0')}`,
      categoryId: category.id,
      minStock: Math.floor(Math.random() * 50) + 1,
      description: `Descrição do Produto Massivo ${i}`,
      lastPrice: parseFloat((Math.random() * 100).toFixed(2)),
    });
  }
  await prisma.product.createMany({ data: products });

  const stocks = [];
  for (let i = 1; i <= 20; i++) {
    stocks.push({
      name: `Estoque Massivo ${i}`,
      type: ["CENTRAL", "SECONDARY"][Math.floor(Math.random() * 2)] as "CENTRAL" | "SECONDARY",
      status: ["ACTIVE", "MAINTENANCE", "INACTIVE"][Math.floor(Math.random() * 3)] as "ACTIVE" | "MAINTENANCE" | "INACTIVE",
    });
  }
  await prisma.stock.createMany({ data: stocks });
  const passwordHash = bcrypt.hashSync("admin", 10);

  const users: UserCreateInput[] = [
    {
      name: `Admin`,
      username: `admin`,
      email: `admin@example.com`,
      password: passwordHash,
      role: "ADMIN",
    },
    {
      name: `Super Admin`,
      username: `super_admin`,
      email: `superadmin@example.com`,
      password: passwordHash,
      role: "SUPER_ADMIN",
    },
  ];
  await prisma.user.createMany({ data: users });

  console.log("Seed massiva finalizada!");
  
}

async function cleanDb() {
  console.log("Limpando banco de dados...");
  await prisma.$transaction([
    prisma.stockedProduct.deleteMany(),
    prisma.movementProduct.deleteMany(),
    prisma.movementBatch.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.stock.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log("Banco de dados limpo!");
}


async function main() {
  // Captura o argumento passado após o --
    // Ex: npm run seed -- massive -> args[0] será 'massive'
    const args = process.argv.slice(2);
    const mode = args[0] 

    if (!mode) {
        console.error('❌ Por favor, especifique um modo de seed: simple, massive, clean');
        process.exit(1);
    }

    console.log(`🚀 Iniciando Seed no modo: [${mode.toUpperCase()}]`);

    switch (mode.toLowerCase()) {
        case 'simple':
            await seedSimple();
            break;
        case 'massive':
            await seedMassive();
            break;
        case 'clean': // Bônus: Útil para resetar sem dropar o schema
            await cleanDb();
            break;
        default:
            console.error(`❌ Modo "${mode}" não reconhecido.`);
            console.log('Opções disponíveis: single, massive, clean');
            process.exit(1);
    }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });


  // npx ts-node src/seed.ts -> comando para rodar o seed