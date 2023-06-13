import { Router } from "express";
import { passportCall } from "../config/passportCall.js";
import { autorization } from "../middlewares/autorization.middleware.js";
import { userService } from "../repositories/index.js";
import { uploader } from "../utils/multer.js";

const router = Router();

router.post("/register", passportCall("register"), async (req, res) => {
  const { user } = req;
  try {
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Algo a fallado, ${error}` });
  }
});

router.patch(
  "/premium/:uid",
  passportCall("current"),
  autorization(["user", "premium"]),
  async (req, res) => {
    const { uid } = req.params;
    const updateUser = await userService.updateRole(uid);
    res.json({ updateUser });
  }
);

router.get("/verificacion", (req, res) => {
  const email = req.email;

  const token = generateToken({
    email,
  });
  res
    .cookie("emailToken", token, { maxAge: 60000 * 6, httpOnly: true })
    .json({ token });
});

router.post("/:uid/documents", uploader.any(), async (req, res) => {
  const { files } = req;
  const { uid } = req.params;
  if (!files) return res.json({ error: "wrong files" });

  const { fileErrorName, totalErrorFiles, uploadedFile } = req;

  const updateUser = await userService.updateDocumentation(uid, files);

  res.json({
    message: `documentos cargados correctamente: ${uploadedFile}`,
    totalWrongFiles: totalErrorFiles,
    wrongFiles: fileErrorName,
  });
});

export default router;
