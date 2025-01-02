'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
require('dotenv').config();
const db = {};

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        logging: false,
        dialect: 'mysql',
        dialectOptions: {
            useUTC: false,
        },
        timezone: process.env.DB_TIMEZONE,
    },
);

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

db.sequelize = sequelize;


db.users = require('./user.model')(sequelize, Sequelize);
db.foods = require('./food.model')(sequelize, Sequelize);
db.recipes = require('./recipe.model')(sequelize, Sequelize);
db.Foodrecipe = require('./food_recipe.model')(sequelize, Sequelize);
db.exercises = require('./exercise.model')(sequelize, Sequelize);
db.favorite = require('./favorites.model')(sequelize, Sequelize);
db.rounds = require('./round.model')(sequelize, Sequelize);
db.smallExercises = require('./small_exercise.model')(sequelize, Sequelize);

db.foods.belongsToMany(db.recipes, {through: db.Foodrecipe, foreignKey: 'foodId', otherKey: 'recipeId', as: 'recipes'});
db.recipes.belongsToMany(db.foods, {through: db.Foodrecipe, foreignKey: 'recipeId', otherKey: 'foodId', as: 'foods' });

db.exercises.hasMany(db.rounds, { foreignKey: 'exerciseId', as: 'rounds' });
db.rounds.belongsTo(db.exercises, { foreignKey: 'exerciseId', as: 'exercise' });
db.rounds.hasMany(db.smallExercises, { foreignKey: 'roundId', as: 'smallExercises' });
db.smallExercises.belongsTo(db.rounds, { foreignKey: 'roundId', as: 'round' });


module.exports = db;
