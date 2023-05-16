import { Router } from "express";
import { passportCall } from "../config/passportCall.js";
import { autorization } from "../middlewares/autorization.middleware.js";
import transport from "../utils/email.util.js";
import { emailUser } from "../config/app/index.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const html = `
      <html>
        <div>
          <p>Visite el siguiente link para restablecer su contraseña</p>
          <button><a href="http://localhost:3000/forgotpassword">restablecer contraseña</a></button>
        </div>
      </html>
      `;

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "restablecer contraseña",
      html,
      attachments: [],
    };

    const result = await transport.sendMail(mailOptions);

    res.json({ message: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
