const { sequelize } = require("../models/index"); 
const { Op } = require('sequelize');
const db = require("../models/index");
const Food = db.foods;
const Foodrecipe = db.Foodrecipe;
const Recipe = db.recipes;


exports.createFood = async (req, res) => {
    try {
        // Kiểm tra xem req.body có dữ liệu gì
        console.log(req.body); // In ra req.body để xem

        const { name, description, type, dietMode, calories, cookTime, servingSize, userId } = req.body;

        // Kiểm tra xem name có được truyền lên hay không
        if (!name) {
            return res.status(400).json({ message: "Food name is required" });
        }

        // Kiểm tra nếu thực phẩm đã tồn tại
        const food = await Food.findOne({ where: { name: name } });
        if (food) {
            return res.status(400).json({ message: "Food already exists" });
        }

        // Tạo mới thực phẩm
        const newFood = await Food.create({
            name,
            description,
            type,
            dietMode,
            calories,
            cookingTime: cookTime,
            servingSize,
            userId
        });

        return res.status(201).json(newFood);
    } catch (error) {
        console.log(error);  // In ra chi tiết lỗi
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



// Lấy tất cả thực phẩm
exports.getAllFoods = async (req, res) => {
    try {
        const foods = await Food.findAll();
        return res.status(200).json(foods);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Lấy thực phẩm theo ID
exports.getFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findByPk(id);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }
        return res.status(200).json(food);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Cập nhật thực phẩm
exports.updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type, dietMode, calories, cookTime, servingSize, userId } = req.body;

        const food = await Food.findByPk(id);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        food.name = name || food.name;
        food.description = description || food.description;
        food.type = type || food.type;
        food.dietMode = dietMode || food.dietMode;  // Sửa thành dietMode
        food.calories = calories || food.calories;
        food.cookingTime = cookTime || food.cookingTime;
        food.servingSize = servingSize || food.servingSize;
        food.userId = userId || food.userId;

        await food.save();

        return res.status(200).json(food);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Xóa thực phẩm
exports.deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findByPk(id);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        await food.destroy();

        return res.status(200).json({ message: "Food deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Lấy thực phẩm theo ID kèm theo danh sách công thức
exports.getFoodByIdWithRecipes = async (req, res) => {
    try {
        const foodId = req.params.id;

        // Tìm món ăn theo ID và bao gồm nguyên liệu
        const food = await Food.findByPk(foodId, {
            include: {
                model: Recipe,
                as: 'recipes', // Alias phải khớp với alias trong định nghĩa mối quan hệ
                through: { attributes: ['quantity'] }, // Bao gồm trường `quantity` từ bảng trung gian
            },
        });

        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        return res.status(200).json({
            message: "Food found",
            food, // Trả về món ăn kèm nguyên liệu
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


// Tạo món ăn kèm theo danh sách công thức
// exports.createFoodWithRecipes = async (req, res) => {
//     try {
//         const { name, description, type, dietMode, calories, recipes, cookingTime, servingSize } = req.body;

//         // Kiểm tra nguyên liệu trong `recipes`
//         if (recipes && recipes.length > 0) {
//             const recipeIds = recipes.map(recipe => recipe.recipeId);
//             const existingRecipes = await Recipe.findAll({
//                 where: { id: recipeIds },
//             });

//             if (existingRecipes.length !== recipes.length) {
//                 return res.status(404).json({ message: "Some recipes not found" });
//             }
//         }

//         // Tạo món ăn
//         const food = await Food.create({
//             name,
//             description,
//             type,
//             dietMode,
//             calories,
//             cookingTime,
//             servingSize,
//         });

//         // Liên kết món ăn với nguyên liệu
//         if (recipes && recipes.length > 0) {
//             const foodRecipes = recipes.map(recipe => ({
//                 foodId: food.id,
//                 recipeId: recipe.recipeId,
//                 quantity: recipe.quantity,
//             }));

//             await Foodrecipe.bulkCreate(foodRecipes);
//         }

//         // Lấy món ăn kèm nguyên liệu
//         const createdFood = await Food.findByPk(food.id, {
//             include: {
//                 model: Recipe,
//                 as: 'recipes',
//                 through: { attributes: ['quantity'] },
//             },
//         });

//         return res.status(201).json({
//             message: "Food created successfully with recipes",
//             food: createdFood,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };

exports.createFoodWithRecipes = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            type, 
            dietMode, 
            calories, 
            recipes, 
            cookingTime, 
            servingSize, 
            allergies, 
            dietary, 
            urlImg, 
            urlVideo 
        } = req.body;

        // Kiểm tra nguyên liệu trong `recipes`
        if (recipes && recipes.length > 0) {
            const recipeIds = recipes.map(recipe => recipe.recipeId);
            const existingRecipes = await Recipe.findAll({
                where: { id: recipeIds },
            });

            if (existingRecipes.length !== recipes.length) {
                return res.status(404).json({ message: "Some recipes not found" });
            }
        }

        // Tạo món ăn
        const food = await Food.create({
            name,
            description,
            type,
            dietMode,
            calories,
            cookingTime,
            servingSize,
            allergies,
            dietary,
            urlImg,
            urlVideo
        });

        // Liên kết món ăn với nguyên liệu
        if (recipes && recipes.length > 0) {
            const foodRecipes = recipes.map(recipe => ({
                foodId: food.id,
                recipeId: recipe.recipeId,
                quantity: recipe.quantity,
            }));

            await Foodrecipe.bulkCreate(foodRecipes);
        }

        // Lấy món ăn kèm nguyên liệu
        const createdFood = await Food.findByPk(food.id, {
            include: {
                model: Recipe,
                through: { attributes: ['quantity'] },
            },
        });

        return res.status(201).json({
            message: "Food created successfully with recipes",
            food: createdFood,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};




exports.getAllFoodByType = async (req, res) => {
    try {
        const { type } = req.params;  // Lấy 'type' từ tham số URL
        const foods = await Food.findAll({
            where: {
                type: type // Lọc thực phẩm theo 'type'
            }
        });

        // Nếu không tìm thấy thực phẩm nào
        if (foods.length === 0) {
            return res.status(404).json({ message: `No foods found for type: ${type}` });
        }

        return res.status(200).json(foods); // Trả về danh sách thực phẩm
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getAllFoodByFilters = async (req, res) => {
    try {
        const { type, dietMode, maxCalories, minCalories, maxCookingTime, minCookingTime, allergies, dietary,  servings } = req.query;

        // Xây dựng điều kiện lọc động
        const whereConditions = {};

        // Lọc theo type (nếu có)
        if (type) {
            const validTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];  // Các loại bữa ăn hợp lệ
            if (!validTypes.includes(type)) {
                return res.status(400).json({ message: `Invalid type: ${type}. Valid types are: ${validTypes.join(', ')}` });
            }
            whereConditions.type = type;
        }

        // Lọc theo dietMode (nếu có)
        if (dietMode) {
            whereConditions.dietMode = dietMode;
        }
        if (allergies) {
            const validAllergies = ['Dairy', 'Nuts', 'Shellfish', 'Eggs'];  
            if (!validAllergies.includes(allergies)) {
                return res.status(400).json({ message: `Invalid type: ${allergies}. Valid types are: ${validAllergies.join(', ')}` });
            }
            whereConditions.allergies = allergies;
        }
        if (dietary) {
            const validDietary = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'];  
            if (!validDietary.includes(dietary)) {
                return res.status(400).json({ message: `Invalid type: ${dietary}. Valid types are: ${validDietary.join(', ')}` });
            }
            whereConditions.dietary = dietary;
        }


        // Lọc theo calories (nếu có)
        if (minCalories || maxCalories) {
            whereConditions.calories = {};
            if (minCalories) whereConditions.calories[Op.gte] = minCalories;
            if (maxCalories) whereConditions.calories[Op.lte] = maxCalories;
        }

        // Lọc theo cookingTime (nếu có)
        if (minCookingTime || maxCookingTime) {
            whereConditions.cookingTime = {};
            if (minCookingTime) whereConditions.cookingTime[Op.gte] = minCookingTime;
            if (maxCookingTime) whereConditions.cookingTime[Op.lte] = maxCookingTime;
        }

        if (type) {
            const validTypes = ['Dairy', 'Nuts', 'Shellfish', 'Eggs'];  // Các loại bữa ăn hợp lệ
            if (!validTypes.includes(type)) {
                return res.status(400).json({ message: `Invalid type: ${type}. Valid types are: ${validTypes.join(', ')}` });
            }
            whereConditions.type = type;
        }

        // Lọc theo servingSize (nếu có)
        if (servings) {
            whereConditions.servingSize = servings;
        }

        // Lấy danh sách thực phẩm với điều kiện lọc
        const foods = await Food.findAll({
            where: whereConditions
        });

        // Nếu không tìm thấy thực phẩm nào
        if (foods.length === 0) {
            return res.status(404).json({ message: 'No foods found for the given filters' });
        }

        return res.status(200).json(foods); // Trả về danh sách thực phẩm

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
