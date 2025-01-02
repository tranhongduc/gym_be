const { sequelize, } = require("../models/index"); 
const { Op } = require('sequelize');
const db = require("../models/index");
const Exercise = db.exercises;
const Round = db.rounds;
const SmallExercise = db.smallExercises;
const User = db.users;

// Tạo bài tập mới
exports.createExercise = async (req, res) => {
    try {
        const { type, time, num_of_exercises, calories, name, description } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!type || !time || !num_of_exercises || !calories) {
            return res.status(400).json({
                message: "Missing required fields: type, time, num_of_exercises, or calories",
            });
        }

        // Tạo bài tập
        const exercise = await Exercise.create({
            type,
            time,
            num_of_exercises,
            calories,
            name,
            description,
        });

        return res.status(201).json({
            message: "Exercise created successfully",
            exercise,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


// Lấy danh sách bài tập
exports.getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.findAll();
        return res.status(200).json(exercises);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Lấy bài tập theo ID
exports.getExerciseById = async (req, res) => {
    try {
        const { id } = req.params;
        const exercise = await Exercise.findByPk(id);

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        return res.status(200).json(exercise);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Cập nhật bài tập
exports.updateExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, duration, calories, level } = req.body;

        const exercise = await Exercise.findByPk(id);

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        exercise.name = name || exercise.name;
        exercise.description = description || exercise.description;
        exercise.duration = duration || exercise.duration;
        exercise.calories = calories || exercise.calories;
        exercise.level = level || exercise.level;

        await exercise.save();

        return res.status(200).json({
            message: "Exercise updated successfully",
            exercise,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Xóa bài tập
exports.deleteExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const exercise = await Exercise.findByPk(id);

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        await exercise.destroy();

        return res.status(200).json({ message: "Exercise deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Hàm thêm một bài tập (exercise), tự động tạo Round và các Small Exercise liên quan
exports.addExercise = async (req, res) => {
    const { name, description, type, time, calories, rounds , urlImg, urlVideo} = req.body;
  
    const t = await db.sequelize.transaction();
  
    try {

        // Tính tổng số bài tập nhỏ
      const num_of_exercises = rounds.reduce((total, roundData) => {
        return total + (roundData.smallExercises ? roundData.smallExercises.length : 0);
      }, 0);
      // 1. Tạo Exercise với đầy đủ các trường
      const exercise = await Exercise.create(
        {
          name,
          description,
          type,
          time,
          calories,
          num_of_exercises,
          urlImg, urlVideo
        },
        { transaction: t }
      );
  
      // 2. Tạo các Round và SmallExercise như trước
      for (const roundData of rounds) {
        const round = await Round.create(
          {
            exerciseId: exercise.id,
            name: roundData.name,
            description: roundData.description,
            order: roundData.order,
          },
          { transaction: t }
        );
  
        for (const smallExerciseData of roundData.smallExercises) {
          await SmallExercise.create(
            {
              roundId: round.id,
              name: smallExerciseData.name,
              description: smallExerciseData.description,
              duration: smallExerciseData.duration,
              urlImg: smallExerciseData.urlImg, 
              urlVideo: smallExerciseData.urlVideo
            },
            { transaction: t }
          );
        }
      }
  
      await t.commit();
  
      res.status(201).json({
        message: "Exercise, rounds, and small exercises created successfully",
        exercise,
      });
    } catch (error) {
      await t.rollback();
  
      res.status(500).json({
        message: "Error creating exercise, rounds, or small exercises",
        error: error.message,
      });
    }
};
  

exports.getExercises = async (req, res) => {
  try {
    // Lấy tất cả bài tập và liên kết với các vòng (rounds) và bài tập nhỏ (smallExercises)
    const exercises = await Exercise.findAll({
      include: [
        {
          model: Round,
          as: 'rounds', // Alias được định nghĩa trong model Round
          include: [
            {
              model: SmallExercise,
              as: 'smallExercises', // Alias được định nghĩa trong model SmallExercise
            },
          ],
        },
      ],
    });

    // Chuyển dữ liệu sang định dạng mà bạn cần (bao gồm name, time, calories, url_img, rounds, smallExercises)
    const exerciseData = exercises.map((exercise) => ({
      name: exercise.name,
      time: exercise.time,
      calories: exercise.calories,
      url_img: exercise.url_img, // Giả sử bạn có trường `url_img` trong bảng Exercise
      rounds: exercise.rounds.map((round) => ({
        name: round.name,
        description: round.description,
        order: round.order,
        smallExercises: round.smallExercises.map((smallExercise) => ({
          name: smallExercise.name,
          description: smallExercise.description,
          duration: smallExercise.duration,
        })),
      })),
    }));

    // Trả về kết quả
    res.status(200).json({
      message: 'Exercises retrieved successfully',
      exercises: exerciseData,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving exercises',
      error: error.message,
    });
  }
};

exports.getExercisesToUser= async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
        where: { id },
        // include: ["requests"],
    });
    

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Ánh xạ mức độ của activityLevel và BMI
    const activityLevelMapping = {
      low: 10,
      moderate: 20,
      high: 30,
    };

    const bmiMapping = {
      underweight: 1500,
      normal: 2000,
      overweight: 2500,
    };

    // Lấy chỉ số từ người dùng
    const { activityLevel, bmi } = user;

    let whereCondition = {};

    if (activityLevel) {
      const requiredExercises = activityLevelMapping[activityLevel];
      if (requiredExercises) {
        whereCondition.num_of_exercises = {
          [Op.lte]: requiredExercises,
        };
      }
    }

    if (bmi) {
      let bmiCategory;
      if (bmi < 18.5) bmiCategory = 'underweight';
      else if (bmi >= 18.5 && bmi < 25) bmiCategory = 'normal';
      else bmiCategory = 'overweight';

      const requiredCalories = bmiMapping[bmiCategory];
      if (requiredCalories) {
        whereCondition.calories = {
          [Op.lte]: requiredCalories,
        };
      }
    }

    // Truy vấn bài tập với điều kiện
    const exercises = await Exercise.findAll({
      attributes:  ['name', 'time',  'num_of_exercises', 'calories', 'url_img', 'url_video'],
      where: whereCondition,
    });

    // Trả về kết quả
    res.status(200).json({
      message: 'Exercises retrieved successfully',
      data: exercises,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving exercises',
      error: error.message,
    });
  }
};


  


  // Lấy ngẫu nhiên 2 bài tập
exports.getRandomExercises = async (req, res) => {
    try {
        // Lấy danh sách tất cả bài tập
        const exercises = await Exercise.findAll({
            attributes: ['name', 'time', 'calories', 'url_img', 'url_video'], // Chỉ lấy các trường cần thiết
        });

        if (exercises.length < 2) {
            return res.status(400).json({
                message: "Not enough exercises to select randomly",
            });
        }

        // Trộn danh sách bài tập và lấy 2 bài tập ngẫu nhiên
        const shuffled = exercises.sort(() => 0.5 - Math.random());
        const randomExercises = shuffled.slice(0, 2);

        return res.status(200).json(randomExercises);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};



// Lấy danh sách bài tập theo type
exports.getExercisesByType = async (req, res) => {
  const { type } = req.params; // Lấy type từ route params

  try {
    // Lấy danh sách bài tập theo type
    const exercises = await Exercise.findAll({
      where: { type }, // Điều kiện lọc theo type
      attributes: ['url_img', 'url_video', 'name', 'time', 'calories'], // Chỉ lấy các trường cần thiết
      include: [
        {
          model: Round,
          as: 'rounds', // Alias từ model
          attributes: [], // Không cần lấy các trường của round
          include: [
            {
              model: SmallExercise,
              as: 'smallExercises', // Alias từ model
              attributes: [], // Không cần lấy các trường của smallExercise
            },
          ],
        },
      ],
      // Tính tổng số bài tập nhỏ từ các round
      group: ['Exercise.id'], // Group by Exercise để tính toán chính xác
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('rounds.smallExercises.id')),
            'totalSmallExercises',
          ],
        ],
      },
    });

    // Trả về danh sách bài tập
    res.status(200).json({
      message: 'Exercises retrieved successfully by type',
      exercises,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving exercises by type',
      error: error.message,
    });
  }
};


exports.getExerciseById1 = async (req, res) => {
  try {
    // Lấy id bài tập từ tham số URL
    const { id } = req.params;

    // Lấy bài tập theo id và liên kết với các vòng (rounds) và bài tập nhỏ (smallExercises)
    const exercise = await Exercise.findOne({
      where: { id },  // Tìm bài tập với id cụ thể
      include: [
        {
          model: Round,
          as: 'rounds', // Alias được định nghĩa trong model Round
          include: [
            {
              model: SmallExercise,
              as: 'smallExercises', // Alias được định nghĩa trong model SmallExercise
            },
          ],
        },
      ],
    });

    // Nếu không tìm thấy bài tập
    if (!exercise) {
      return res.status(404).json({
        message: 'Exercise not found',
      });
    }

    // Chuyển dữ liệu sang định dạng bạn cần
    const exerciseData = {
      name: exercise.name,
      time: exercise.time,
      calories: exercise.calories,
      url_img: exercise.urlImg, 
      num: exercise.num_of_exercises,
      rounds: exercise.rounds.map((round) => ({
        name: round.name,
        description: round.description,
        order: round.order,
        smallExercises: round.smallExercises.map((smallExercise) => ({
          id: smallExercise.id,
          name: smallExercise.name,
          description: smallExercise.description,
          duration: smallExercise.duration,
        })),
      })),
    };

    // Trả về kết quả
    res.status(200).json({
      message: 'Exercise retrieved successfully',
      exercise: exerciseData,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving exercise',
      error: error.message,
    });
  }
};
