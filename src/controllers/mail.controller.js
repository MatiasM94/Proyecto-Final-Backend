import { Router } from "express";
import { passportCall } from "../config/passportCall.js";
import { autorization } from "../middlewares/autorization.middleware.js";
import transport from "../utils/email.util.js";
import { emailUser } from "../config/app/index.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  console.log(email);
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
      from: emailUser,
      to: email,
      subject: "restablecer contraseña",
      html,
      attachments: [],
    };

    const result = await transport.sendMail(mailOptions);

    const token = generateToken({
      email: email,
    });
    console.log("desde back", token);
    if (result.accepted.length > 0)
      return res
        .cookie("emailToken", token, { maxAge: 60000 * 6, httpOnly: true })
        .json({ message: result.accepted, token });
    if (result.rejected.length > 0)
      return res.json({ message: result.rejected });

    res
      .cookie("emailToken", token, { maxAge: 60000 * 6, httpOnly: true })
      .json({ message: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
