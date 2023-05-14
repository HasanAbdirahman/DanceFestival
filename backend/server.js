const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config();
require("./config/database");
app.use(express.json());

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

// declaring
const userRoute = require("./routes/users");
const productRoute = require("./routes/products");

app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening on port ${port}`));
