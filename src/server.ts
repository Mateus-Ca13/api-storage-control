import helmet from "helmet";
import cors from "cors";
import express from 'express'
import mainRouter from "./router";
const app = express()
const PORT = 8000

app.use(helmet());
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
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