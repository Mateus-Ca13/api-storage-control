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
    '/movements -> Movimentações',
    '/categories -> Categorias',
    '/nfe-codes (NÃO DISPONÍVEL) -> Códigos cProd',
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
    API de Controle de Estoque 
    Rotas disponíveis:
    ------------------------
    ` 
    + availableRoutes.join('\n '))
})

export default mainRouter;