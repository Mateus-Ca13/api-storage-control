import multer from "multer";
import { sendErrorResponse } from "../utils/response";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

const uploadMiddleware = (req: any, res: any, next: any) => {
  const singleUpload = upload.single("file");

  singleUpload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return sendErrorResponse(res, err, 400, 'O tamanho do arquivo excede o limite permitido de 100MB.');
      }

      return sendErrorResponse(res, err, 400, 'Erro ao fazer upload do arquivo.');
    }

    if (err) {
      return sendErrorResponse(res, err, 500, 'Falha desconhecida ao fazer upload do arquivo.');
    }

    next();
  });
};

export default uploadMiddleware;

