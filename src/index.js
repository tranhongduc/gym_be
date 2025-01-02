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
const exerciseRoute = require("./app/routes/exercise.route");
const round = require("./app/routes/round.route");
const smallExerciseRoute = require("./app/routes/small_exercise.route");
const mediaRoute = require("./app/routes/media.route");
const userRoute = require("./app/routes/user.route");
const favoriteRoute = require("./app/routes/favorite.route");

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
app.use("/api/exercises", exerciseRoute);
app.use("/api/rounds", round);
app.use("/api/small-exercises", smallExerciseRoute);
app.use("/api/media", mediaRoute);
app.use("/api/user", userRoute);
app.use("/api/favorite", favoriteRoute);


server.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
