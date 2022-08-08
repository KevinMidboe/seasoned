const express = require("express");
const path = require("path");
const history = require("connect-history-api-fallback");

const publicPath = path.join(__dirname, "public");

app = express();
app.use("/", express.static(publicPath));
app.use(history({ index: "/" }));

app.get("/", function (req, res) {
  res.sendFile(`${publicPath}/index.html`);
});

const port = process.env.PORT || 5001;
console.log("Server runnning at port:", port);

app.listen(port);
