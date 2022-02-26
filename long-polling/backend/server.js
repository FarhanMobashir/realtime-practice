import express from "express";
import nanobuffer from "nanobuffer";
import morgan from "morgan";
import cors from "cors";

// set up a limited array
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

// this just seeds the server with at least one message
msg.push({
  user: "Mobashir",
  text: "Hii",
  time: Date.now(),
});

// setting up the server
const app = express();
app.use(cors());
app.use(morgan("dev"));

app.get("/", function (req, res) {
  setTimeout(() => {
    res.json({
      message: "Server is ready now",
    });
  }, 1000);
});

// routing
app.get("/poll", function (req, res) {
  // write code here
});

app.post("/poll", function (req, res) {
  // write code here
});

// starting the server
const port = 5000;
app.listen(port);
console.log(`Server listenting on http://localhost:${port}`);
