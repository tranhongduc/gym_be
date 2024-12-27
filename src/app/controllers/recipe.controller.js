const db = require('../models/index');
const Recipe = db.Recipe;  // Đổi tên biến để tránh trùng với tên model
const Food = db.Food;
const Foodrecipe = db.Foodrecipe;

// Tạo nguyên liệu
exports.createrecipe = async (req, res) => {
    try {
        const { name, description , unit } = req.body;

        if (!name) {
            return res.status(400).json({ message: "recipe name is required" });
        }

        const newRecipe = await Recipe.create({ name, description ,unit });
        return res.status(201).json(newRecipe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Lấy tất cả nguyên liệu
exports.getAllrecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        return res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Lấy nguyên liệu theo ID
exports.getrecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);

        if (!recipe) {
            return res.status(404).json({ message: "recipe not found" });
        }

        return res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Gán nguyên liệu vào món ăn
exports.addrecipeToFood = async (req, res) => {
    try {
        const { foodId, recipeId, quantity } = req.body;

        // Kiểm tra thông tin đầu vào
        if (!foodId || !recipeId || !quantity) {
            return res.status(400).json({ message: "foodId, recipeId, and quantity are required" });
        }

        // Kiểm tra xem foodId và recipeId có tồn tại trong bảng tương ứng không
        const food = await Food.findByPk(foodId);
        const recipe = await Recipe.findByPk(recipeId);

        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Kiểm tra nếu nguyên liệu đã được gán cho món ăn này rồi
        const existingFoodrecipe = await Foodrecipe.findOne({
            where: { foodId, recipeId }
        });

        if (existingFoodrecipe) {
            return res.status(400).json({ message: "Recipe already added to this food" });
        }

        // Thêm nguyên liệu vào món ăn
        const newFoodrecipe = await Foodrecipe.create({ foodId, recipeId, quantity });

        return res.status(201).json({ message: "Recipe added to Food successfully", data: newFoodrecipe });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Lấy danh sách món ăn sử dụng một nguyên liệu
exports.getFoodsByrecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const recipe = await Recipe.findByPk(recipeId, {
            include: {
                model: Food,
                through: { attributes: ['quantity'] },
            },
        });

        if (!recipe) {
            return res.status(404).json({ message: "recipe not found" });
        }

        return res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
