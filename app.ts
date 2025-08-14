const express = require('express')
const app = express()
const PORT = 8000

app.use(express.json())

app.listen(PORT, () => {
  console.log(`Servidor ativo em http://localhost:${PORT}`);
});