const db = require('../models'); // Import database models
const cloudinary = require('../configs/cloudinary.config'); // Import Cloudinary configuration
const Food = db.foods; // Mô hình Food
const Recipe = db.recipes; // Mô hình Recipe
const Foodrecipe = db.Foodrecipe; // Bảng liên kết giữa Food và Recipe
const { faker } = require('@faker-js/faker'); // Sử dụng faker-js để tạo dữ liệu ngẫu nhiên


// Folder Cloudinary chứa ảnh và video
const imageFolder = 'foods/pic';
const videoFolder = 'foods/vi';
// nhìn lại chú ý bên ảnh video bên  bài tập


// Hàm lấy ảnh ngẫu nhiên từ folder
const getRandomImageUrl = async () => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: imageFolder, // Lọc theo folder ảnh
            max_results: 100, // Số lượng tệp tối đa lấy
        });

        const images = result.resources;
        if (images.length === 0) return null;
        
        const randomImage = faker.helpers.arrayElement(images);
        return randomImage.secure_url; // Trả về URL của ảnh ngẫu nhiên
    } catch (error) {
        console.error("Error getting image from Cloudinary:", error);
        return null;
    }
};

// Hàm lấy video ngẫu nhiên từ folder
const getRandomVideoUrl = async () => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: videoFolder, // Lọc theo folder video
            resource_type: 'video', // Chỉ lấy video
            max_results: 100, // Số lượng tệp tối đa lấy
        });

        const videos = result.resources;
        if (videos.length === 0) return null;
        
        const randomVideo = faker.helpers.arrayElement(videos);
        return randomVideo.secure_url; // Trả về URL của video ngẫu nhiên
    } catch (error) {
        console.error("Error getting video from Cloudinary:", error);
        return null;
    }
};




const seedFood = async () => {
    try {
        const foodCount = 50; // Số lượng món ăn muốn tạo
        const foodPromises = []; // Mảng chứa các lời hứa (Promises) khi tạo món ăn

        for (let i = 0; i < foodCount; i++) {
            // Tạo thông tin món ăn ngẫu nhiên
            const name = faker.commerce.productName(); // Tên món ăn
            const description = faker.lorem.sentence(); // Mô tả món ăn
            const type = faker.helpers.arrayElement(['Breakfast', 'Lunch', 'Dinner']); // Loại món ăn (ENUM)
            const allergies = faker.helpers.arrayElement(['Dairy', 'Nuts', 'Shellfish', 'Eggs']); // Dị ứng (ENUM)
            const dietary = faker.helpers.arrayElement(['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo']); // Thực phẩm theo chế độ ăn (ENUM)
            const dietMode = faker.helpers.arrayElement(['Low-carb', 'High-protein', 'Balanced', 'Detox']); // Chế độ ăn (STRING)
            const calories = faker.number.int({ min: 100, max: 1000 }); // Lượng calo (INTEGER)
            const cookingTime = faker.number.int({ min: 10, max: 120 }); // Thời gian nấu (phút) (INTEGER)
            const servingSize = faker.number.int({ min: 1, max: 6 }); // Số lượng phục vụ (INTEGER)


            const urlImg = await getRandomImageUrl();
            const urlVideo = await getRandomVideoUrl();

            // Tạo món ăn mới
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

           // Lấy ngẫu nhiên 1 đến 4 nguyên liệu từ bảng `recipes`
           const recipeCount = faker.number.int({ min: 1, max: 4 });
           const recipes = await Recipe.findAll({
               attributes: ['id'],
               limit: recipeCount,
           });

           // Tạo mối quan hệ giữa món ăn và các nguyên liệu
           const foodRecipes = recipes.map(recipe => ({
               foodId: food.id, // ID món ăn mới
               recipeId: recipe.id, // ID nguyên liệu
               quantity: faker.number.int({ min: 1, max: 4 }), // Số lượng ngẫu nhiên
           }));

            // Tạo mối quan hệ trong bảng Foodrecipe
            await Foodrecipe.bulkCreate(foodRecipes);
        }

        console.log(`${foodCount} foods created successfully!`);
        process.exit(0); // Thoát sau khi chạy xong
    } catch (error) {
        console.error('Error seeding food data:', error.message);
        process.exit(1); // Thoát với lỗi
    }
};

seedFood();
