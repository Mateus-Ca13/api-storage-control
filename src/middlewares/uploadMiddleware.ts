import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // guarda em RAM, mais rápido
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
