const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const ProductRoute = require("./Routes/ProductR");
const AuthRoute = require("./Routes/AuthR");
const CartRoute = require("./Routes/CartR");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./public"));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ success: "Server Started" });
});

const port = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB connected`);
  })
  .catch((err) => console.log("connection error: " + err));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.use("/auth", AuthRoute);
app.use("/products", ProductRoute);
app.use("/cart", CartRoute);
