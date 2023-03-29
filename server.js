"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3002;
app.use(
  bodyParser.json({
    limit: "20mb",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "20mb",
  })
);
app.use("/wpp", require("./whatsapp/munibot"));
app.get("/", (req, res) => {
  return res.send("Chatbot Funcionando 🤖🤖🤖");
});

app.listen(port, () => {
  console.log(`Escuchando peticiones en el puerto ${port}`);
});
