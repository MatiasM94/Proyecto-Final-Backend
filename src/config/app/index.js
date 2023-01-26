import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const port = process.env.PORT;
