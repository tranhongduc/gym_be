const db = require("../models/index");
const Food = db.Food;
const Foodrecipe = db.Foodrecipe;
const Recipe = db.Recipe;


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
exports.createFoodWithRecipes = async (req, res) => {
    try {
        const { name, description, type, dietMode, calories, recipes, cookingTime, servingSize } = req.body;

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
                as: 'recipes',
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
