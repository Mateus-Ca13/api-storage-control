# API de Controle de Estoque

API para controle de estoque de produtos, com gerenciamento de usuários, produtos, categorias, estoques e movimentações.

## Funcionalidades

*   **Autenticação:** Sistema de login com JWT (Access Token e Refresh Token).
*   **Usuários:** CRUD de usuários com diferentes níveis de acesso (ADMIN, USER, SUPER_ADMIN).
*   **Produtos:** CRUD de produtos com informações detalhadas, como código de barras, unidade de medida, estoque mínimo, etc.
*   **Categorias:** CRUD de categorias para organização dos produtos.
*   **Estoques:** Gerenciamento de múltiplos estoques (Central, Secundário) com status (Ativo, Manutenção, Inativo).
*   **Movimentações:** Registro de entradas, saídas e transferências de produtos entre estoques.
*   **Dashboard:** Visão geral do estoque, com informações sobre produtos abaixo do estoque mínimo, etc.
*   **Mapeamento de NFe:** Mapeamento de produtos da NFe para produtos do sistema. (Em desenvolvimento)

## Tecnologias Utilizadas

*   **Backend:** Node.js com Express.js e TypeScript
*   **ORM:** Prisma
*   **Banco de Dados:** PostgreSQL
*   **Validação e tratamento:** Zod e Multer
*   **Autenticação:** JWT (jsonwebtoken), cookie-parser e bcryptjs
*   **Segurança:** Helmet e CORS
*   **Conversão de arquivos:** csvtojson

## Como Iniciar

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Mateus-Ca13/api-storage-control.git
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    DATABASE_PASSWORD="SENHA_DB"
    JWT_REFRESH_TOKEN_SECRET="SUA_CHAVE_SECRETA"
    JWT_ACCESS_TOKEN_SECRET="SUA_CHAVE_SECRETA"
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
*   `/movements` - Movimentações
*   `/categories` - Categorias
*   `/nfe-codes` - Códigos cProd (Em desenvolvimento)