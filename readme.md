# API de Controle de Estoque - Divino Oleiro

API para controle de estoque de produtos, com gerenciamento de usuários, produtos, categorias, estoques e movimentações.

## Funcionalidades

*   **Autenticação:** Sistema de login com JWT (Access Token e Refresh Token).
*   **Usuários:** CRUD de usuários com diferentes níveis de acesso (ADMIN, USER, SUPER_ADMIN).
*   **Produtos:** CRUD de produtos com informações detalhadas, como código de barras, unidade de medida, estoque mínimo, etc.
*   **Categorias:** CRUD de categorias para organização dos produtos.
*   **Estoques:** Gerenciamento de múltiplos estoques (Central, Secundário) com status (Ativo, Manutenção, Inativo).
*   **Movimentações:** Registro de entradas, saídas e transferências de produtos entre estoques.
*   **Dashboard:** Visão geral do estoque, com informações sobre produtos abaixo do estoque mínimo, etc.
*   **Mapeamento de NFe:** Mapeamento de produtos da NFe para produtos do sistema.
*   **Relatórios:** Geração de relatórios de movimentações, estoque atual, etc.

## Tecnologias Utilizadas

*   **Backend:** Node.js com Express e TypeScript
*   **ORM:** Prisma
*   **Banco de Dados:** PostgreSQL
*   **Validação:** Zod
*   **Autenticação:** JWT (jsonwebtoken) e bcryptjs
*   **Segurança:** Helmet e CORS

## Como Iniciar

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    JWT_SECRET="SUA_CHAVE_SECRETA"
    REFRESH_TOKEN_SECRET="SUA_CHAVE_SECRETA_REFRESH"
    ```
4.  **Execute as migrações do banco de dados:**
    ```bash
    npx prisma migrate dev
    ```
5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## Endpoints da API

*   `/auth` - Login e autenticação
*   `/products` - Produtos
*   `/dashboard` - Visão geral do C.E.
*   `/stocks` - Estoques
*   `/users` - Usuários
*   `/nfe-codes` - Códigos cProd
*   `/movements` - Movimentações
*   `/categories` - Categorias
*   `/reports` - Relatórios