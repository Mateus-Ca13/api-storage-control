import helmet from "helmet";
import cors from "cors";
import express from 'express'
import mainRouter from "./router";
import cookieParser from 'cookie-parser';
const app = express()
const PORT = 8000

app.use(helmet());
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173", "http://localhost:5174", // URL do frontend
    "http://127.0.0.1:5173", "http://127.0.0.1:5174" // Para cobrir diferentes navegadores/configs // Permitir apenas o frontend,

  ],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', mainRouter)

app.listen(PORT, () => {
  console.log(`
    ---------------------------------------------------
    API disponível em http://localhost:${PORT}/api/v1/
    ---------------------------------------------------`);
});