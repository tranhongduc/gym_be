const db = require('../models'); // Import database models
const Recipe = db.recipes; 
const { faker } = require('@faker-js/faker'); // Sử dụng faker-js thay vì faker

// Hàm tạo dữ liệu ngẫu nhiên
const ingredientNames = [
    'Tomato', 'Lemon', 'Garlic', 'Onion', 'Potato', 'Sugar', 'Salt', 'Flour',
    'Rice', 'Chicken', 'Beef', 'Pork', 'Cucumber', 'Carrot', 'Spinach', 'Milk', 'Butter', 'Olive oil'
];


const seedRecipes = async () => {
    try {
        const count = 50; // Số lượng công thức muốn tạo
        const recipes = [];

        for (let i = 0; i < count; i++) {
            const name = faker.helpers.arrayElement(ingredientNames); // Tên ngẫu nhiên cho công thức
            const unit = faker.helpers.arrayElement(['gram', 'kilogram', 'ml', 'l', 'pcs']); // Đơn vị ngẫu nhiên

            // Tạo và lưu công thức vào database
            const newRecipe = await Recipe.create({ name, unit });
            recipes.push(newRecipe);
        }

        console.log(`${recipes.length} recipes created successfully!`);
        process.exit(0); // Thoát sau khi chạy xong
    } catch (error) {
        console.error('Error seeding recipes:', error.message);
        process.exit(1); // Thoát với lỗi
    }
};

seedRecipes();
