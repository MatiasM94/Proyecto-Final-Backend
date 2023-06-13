import multer from "multer";
import __dirname from "./util.js";

const profile = "profile";
const product = "product";
const identificacion = "identificacion";
const comprobanteDedomicilio = "comprobanteDeDomicilio";
const comprobanteDeEstadoDeCuenta = "comprobanteDeEstadoDeCuenta";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fieldname } = file;
    if (fieldname !== profile && fieldname !== product) {
      cb(null, __dirname + "/public/documents");
      return;
    }
    cb(null, __dirname + "/public/" + fieldname + "s");
  },
  filename: function (req, file, cb) {
    if (req.uploadedFile) {
      req.uploadedFile += 1;
      cb(null, file.originalname);
      return;
    }
    req.uploadedFile = 1;
    cb(null, file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  const { fieldname, originalname } = file;

  switch (fieldname) {
    case profile:
      cb(null, true);
      break;
    case product:
      cb(null, true);

      break;
    case identificacion:
      cb(null, true);

      break;
    case comprobanteDedomicilio:
      cb(null, true);

      break;
    case comprobanteDeEstadoDeCuenta:
      cb(null, true);

      break;

    default:
      if (req.fileErrorName) {
        req.fileErrorName.push({ file: originalname });
        req.totalErrorFiles += 1;
        cb(null, false);
        break;
      }
      req.fileErrorName = [{ file: originalname }];
      req.totalErrorFiles = 1;
      cb(null, false);
      break;
  }
};

export const uploader = multer({ storage, fileFilter });
