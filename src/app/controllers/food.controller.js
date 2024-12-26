const db = require("../models/index");
const Food = db.Food;

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
