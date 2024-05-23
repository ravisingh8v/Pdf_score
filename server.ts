import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import app from "./index";
const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "";

app.listen(port, hostname, () => {
  console.log(`server is running on port:${port} and host:${hostname}`);
});
