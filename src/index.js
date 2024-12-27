const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const PORT = 3000;

const authRoute = require("./app/routes/auth.route");
const foodRoute = require("./app/routes/food.route");
const recipeRoute = require("./app/routes/recipe.route");

const server = http.createServer(app);

app.use(cors());
app.use(morgan("short"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// auth route
app.use("/api/auth", authRoute);
app.use("/api/foods", foodRoute);
app.use("/api/recipes", recipeRoute);


server.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
