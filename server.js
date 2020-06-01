var express = require("express");
var cors = require("cors");
var serveStatic = require("serve-static");

app = express();
app.use(cors());
app.use(serveStatic(__dirname + "/dist"));

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log("server started " + port);
