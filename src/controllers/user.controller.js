import { Router } from "express";
import { passportCall } from "../config/passportCall.js";
import { autorization } from "../middlewares/autorization.middleware.js";
import { userService } from "../repositories/index.js";
import { uploader } from "../utils/multer.js";

const router = Router();

router.get(
  "/",
  passportCall("current"),
  autorization(["admin"]),
  async (req, res) => {
    try {
      const users = await userService.find();
      res.json({ message: "Estos son los usuarios", users: users });
    } catch (error) {
      req.logger.error(error.message);
      res.status(500).json({ error: error });
    }
  }
);

router.post("/register", passportCall("register"), async (req, res) => {
  const { user } = req;
  try {
    res.json({ user });
  } catch (error) {
    req.logger.error(error.message);
    res
      .status(500)
      .json({ error: "An internal problem occurred on the server" });
  }
});

router.patch(
  "/premium/:uid",
  passportCall("current"),
  autorization(["user", "premium", "admin"]),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const updateUser = await userService.updateRole(uid);
      if (updateUser.error) {
        req.logger.warn(updateUser.error);
        return res.status(400).json(updateUser);
      }
      res.json({ updateUser });
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.delete(
  "/:uid",
  passportCall("current"),
  autorization(["admin"]),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const deleteUser = await userService.deleteOne(uid);
      if (deleteUser.error) {
        req.logger.warn(deleteUser.error);
        return res.status(400).json(deleteUser);
      }
      res.json({ deleteUser });
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
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
  if (!files) {
    req.logger.warn("wrong files");
    return res.json({ error: "wrong files" });
  }

  const { fileErrorName, totalErrorFiles, uploadedFile } = req;

  const updateUser = await userService.updateDocumentation(uid, files);
  req.logger.debug(
    `documentos cargados correctamente: ${uploadedFile}, wrongFiles: ${fileErrorName}`
  );
  res.json({
    message: `documentos cargados correctamente: ${uploadedFile}`,
    totalWrongFiles: totalErrorFiles,
    wrongFiles: fileErrorName,
  });
});

export default router;
