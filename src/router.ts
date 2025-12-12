import { Router } from "express";
import productRoutes from "./routes/productRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import authRoutes from "./routes/authRoutes";
import stockRoutes from "./routes/stockRoutes";
import movementRoutes from "./routes/movementsRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRoutes";



const mainRouter = Router();

const availableRoutes = [
  '/auth -> Login e autenticação',
  '/products -> Produtos',
    '/dashboard -> Visão geral do C.E.',
    '/stocks -> Estoques',
    '/users -> Usuários',
    '/nfe-codes -> Códigos cProd',
    '/movements -> Movimentações',
    '/categories -> Categorias',
    '/reports (NÃO DISPONÍVEL) -> Relatórios'
]


mainRouter.use('/auth', authRoutes)
mainRouter.use('/products', productRoutes)
mainRouter.use('/dashboard', dashboardRoutes)
mainRouter.use('/stocks', stockRoutes)
mainRouter.use('/categories', categoryRoutes)
mainRouter.use('/movements', movementRoutes)
mainRouter.use('/users', userRoutes)

mainRouter.use('/', (req, res) => {
  res.send(` 
    API de Controle de Estoque - Divino Oleiro 
    Rotas disponíveis:
    ------------------------
    ` 
    + availableRoutes.join('\n '))
})

export default mainRouter;