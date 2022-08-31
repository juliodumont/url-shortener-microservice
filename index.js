require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
let bodyParser = require("body-parser");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

let urlList = { length: 0 };

const addToUrlList = (url) => {
  urlList = {
    ...urlList,
    [urlList.length + 1]: url,
    length: urlList.length + 1,
  };
};

app.post("/api/shorturl", (req, res) => {
  const urlRegexTest = /^(https?|http):\/\/[^\s$.?#].[^\s]*$/gm.test(
    req.body.url
  );
  if (urlRegexTest === true) {
    addToUrlList(req.body.url);
    res.json({ original_url: req.body.url, short_url: urlList.length });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:url", (req, res) => {
  const url = urlList[req.params.url];
  res.status(301).redirect(url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
