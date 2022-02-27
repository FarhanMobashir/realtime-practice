import express from "express";
import nanobuffer from "nanobuffer";
import morgan from "morgan";
import cors from "cors";

// set up a limited array
const msg = new nanobuffer(50); // [] => 50 lenght
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  setTimeout(() => {
    res.json({
      message: "Server is ready now",
    });
  }, 0);
});

// routing
// * getting all the message
app.get("/poll", function (req, res) {
  return res.json({
    msg: getMsgs(),
  });
});

app.post("/poll", function (req, res) {
  console.log(req.body);
  const { user, text } = req.body;
  msg.push({
    user,
    text,
    time: Date.now(),
  });
  res.json({
    status: "OK",
    message: req.body,
  });
});

// starting the server
const port = 5000;
app.listen(port);
console.log(`Server listenting on http://localhost:${port}`);
