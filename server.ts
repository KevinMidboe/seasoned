import express, { Express, Request, Response } from "express";

import path from "path";
const history = require("connect-history-api-fallback");

const publicPath = path.join(__dirname, "..", "public");

const app: Express = express();

app.get("/_healthz", (_, res) => {
  res.status(200).send("ok");
});

app.use("/", express.static(publicPath));
app.use(history({ index: "/" }));

app.get("/", (req: Request, res: Response) => {
  console.log("trying to get:", req.path);
  res.sendFile(`${publicPath}/index.html`);
});

const port = process.env.PORT || 5001;
console.log("Server runnning at port:", port);

app.listen(port);
