import { Router } from "express";
import transport from "../utils/email.util.js";
import { nodemailerConfig } from "../config/app/index.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const html = `
      <html>
        <div>
          <p>Visite el siguiente link para restablecer su contraseña</p>
          <button><a href="http://localhost:8000/forgotpassword/restorepassword">restablecer contraseña</a></button>
        </div>
      </html>
      `;

    const mailOptions = {
      from: nodemailerConfig.emailUser,
      to: email,
      subject: "restablecer contraseña",
      html,
      attachments: [],
    };

    const result = await transport.sendMail(mailOptions);

    const token = generateToken({
      email: email,
    });

    if (result.accepted.length > 0)
      return res
        .cookie("emailToken", token, { maxAge: 60000 * 6, httpOnly: true })
        .json({ message: result.accepted, token });
    if (result.rejected.length > 0) {
      req.logger.warn(result.rejected);
      return res.json({ message: result.rejected });
    }
  } catch (error) {
    req.logger.error(error.message);
    res
      .status(500)
      .json({ error: "An internal problem occurred on the server" });
  }
});

export default router;
