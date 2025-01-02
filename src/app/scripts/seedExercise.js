const db = require('../models'); // Import database models
const Exercise = db.exercises;
const Round = db.rounds;
const SmallExercise = db.smallExercises;
const cloudinary = require('../configs/cloudinary.config'); // Import Cloudinary configuration
const { faker } = require('@faker-js/faker'); // Sử dụng faker-js để tạo dữ liệu ngẫu nhiên


// // Folder Cloudinary chứa ảnh và video cho bài tập và bài tập nhỏ
// const exerciseImageFolder = 'workouts/pic';  // Folder ảnh cho bài tập
// const exerciseVideoFolder = 'workouts/vi';  // Folder video cho bài tập
// const smallExerciseImageFolder = 'small_exercises/pic'; // Folder ảnh cho bài tập nhỏ
// const smallExerciseVideoFolder = 'small_exercises/vi'; // Folder video cho bài tập nhỏ

// // Hàm lấy ảnh ngẫu nhiên từ folder
// const getRandomImageUrl = async (folder) => {
//   try {
//     const result = await cloudinary.api.resources({
//       type: 'upload',
//       prefix: folder, // Lọc theo folder ảnh
//       max_results: 100, // Số lượng tệp tối đa lấy
//     });

//     const images = result.resources;
//     if (images.length === 0) return null;

//     const randomImage = faker.helpers.arrayElement(images);
//     return randomImage.secure_url; // Trả về URL của ảnh ngẫu nhiên
//   } catch (error) {
//     console.error("Error getting image from Cloudinary:", error);
//     return null;
//   }
// };

// // Hàm lấy video ngẫu nhiên từ folder
// const getRandomVideoUrl = async (folder) => {
//     try {
//       const result = await cloudinary.api.resources({
//         type: 'upload',
//         prefix: folder, // Lọc theo folder video
//         resource_type: 'video', // Chỉ lấy video
//         max_results: 100, // Số lượng tệp tối đa lấy
//       });
  
//       const videos = result.resources;
//       if (videos.length === 0) return null;
  
//       const randomVideo = faker.helpers.arrayElement(videos);
//       return randomVideo.secure_url; // Trả về URL của video ngẫu nhiên
//     } catch (error) {
//       console.error("Error getting video from Cloudinary:", error);
//       return null;
//     }
//   };

//Chú ý rằng dùng để khi hết dữ liệu trong lần gọi trên admin api bị giới hạn 1 h nên gọi để mảng dữ liệu trước
  // Tạo 4 mảng dữ liệu để lưu trữ ảnh và video
let exerciseImages = [];
let exerciseVideos = [];
let smallExerciseImages = [];
let smallExerciseVideos = [];

// Hàm tải dữ liệu từ Cloudinary và gán vào mảng tương ứng
const preloadMediaData = async () => {
  try {
    const [exerciseImageData, exerciseVideoData, smallExerciseImageData, smallExerciseVideoData] = await Promise.all([
      cloudinary.api.resources({ type: 'upload', prefix: exerciseImageFolder, max_results: 100 }),
      cloudinary.api.resources({ type: 'upload', prefix: exerciseVideoFolder, resource_type: 'video', max_results: 100 }),
      cloudinary.api.resources({ type: 'upload', prefix: smallExerciseImageFolder, max_results: 100 }),
      cloudinary.api.resources({ type: 'upload', prefix: smallExerciseVideoFolder, resource_type: 'video', max_results: 100 }),
    ]);

    exerciseImages = exerciseImageData.resources.map((item) => item.secure_url);
    exerciseVideos = exerciseVideoData.resources.map((item) => item.secure_url);
    smallExerciseImages = smallExerciseImageData.resources.map((item) => item.secure_url);
    smallExerciseVideos = smallExerciseVideoData.resources.map((item) => item.secure_url);

    console.log('Media data preloaded successfully!');
  } catch (error) {
    console.error('Error preloading media data:', error.message);
  }
};


// const exerciseImage = [
//   'https://res.cloudinary.com/dk03p4gra/image/upload/v1735673163/small_exercises/pic/p7s6ukqri1rswdnofzv9.webp',
//   'https://res.cloudinary.com/dk03p4gra/image/upload/v1735673163/small_exercises/pic/vvbatn11a4wnsjwuznfy.webp',
//   'https://res.cloudinary.com/dk03p4gra/image/upload/v1735673163/small_exercises/pic/lftrxmchkfrtmyze1uan.webp',
//   'https://res.cloudinary.com/dk03p4gra/image/upload/v1735673163/small_exercises/pic/q8hdiw0jaaibg8dovf8x.webp',
//   'https://res.cloudinary.com/dk03p4gra/image/upload/v1735673163/small_exercises/pic/djscy0axakup9ldm5nsy.webp',
//   'https://res.cloudinary.com/dk03p4gra/image/upload/v1735673163/small_exercises/pic/mnd7vmhtr0a3t0rm5rry.webp',
// ];
// const exerciseVideo = [
//   'https://res.cloudinary.com/dk03p4gra/video/upload/v1735675332/small_exercises/vi/vbtbd4jjlndrespvwoya.mp4',
//   'https://res.cloudinary.com/dk03p4gra/video/upload/v1735675332/small_exercises/vi/dauchln2jsxqcb0hgdug.mp4',
//   'https://res.cloudinary.com/dk03p4gra/video/upload/v1735675332/small_exercises/vi/zwwhe7ywf3dojyuh5nic.mp4',
//   'https://res.cloudinary.com/dk03p4gra/video/upload/v1735675332/small_exercises/vi/gvzl1vo1hsvzxuxlfnmg.mp4',
//   'https://res.cloudinary.com/dk03p4gra/video/upload/v1735675332/small_exercises/vi/t2y4d45okjhh27vmjnj9.mp4',
// ];

// Hàm tạo dữ liệu ngẫu nhiên cho bài tập, vòng tập và bài tập nhỏ
const seedExercise = async () => {
  try {
    const exerciseCount = 10; // Số lượng bài tập muốn tạo
    const exercisePromises = []; // Mảng chứa các lời hứa (Promises) khi tạo bài tập

    for (let i = 0; i < exerciseCount; i++) {
      // Tạo thông tin bài tập ngẫu nhiên
      const name = faker.lorem.words(3); // Tên bài tập
      const description = faker.lorem.sentence(); // Mô tả bài tập
      const type = faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced']); // Loại bài tập
      const time =faker.number.int({ min: 5, max: 120 }); // Thời gian (phút)
      const calories =faker.number.int({ min: 50, max: 500 }); // Lượng calo tiêu thụ
      const roundsCount =faker.number.int({ min: 1, max: 5 }); // Số vòng tập ngẫu nhiên từ 1 đến 5


      const urlImg =  faker.helpers.arrayElement(exerciseImages); // Lấy ảnh ngẫu nhiên từ folder workout
      const urlVideo = faker.helpers.arrayElement(exerciseVideos); // Lấy video ngẫu nhiên từ folder workout

      // Tạo bài tập mới
      const exercise = await Exercise.create({
        name,
        description,
        type,
        time,
        calories,
        num_of_exercises: 0, // Chưa có bài tập nhỏ, sẽ cập nhật sau
        urlImg,
        urlVideo,
      });

      // Tạo vòng tập cho bài tập này
      const rounds = [];
      let totalSmallExercises = 0; // Biến tính tổng số bài tập nhỏ

      for (let roundIndex = 0; roundIndex < roundsCount; roundIndex++) {
        const roundName = `Round ${roundIndex + 1}`;
        const roundDescription = faker.lorem.sentence();
        const roundOrder = roundIndex + 1;

        const round = await Round.create({
          exerciseId: exercise.id,
          name: roundName,
          description: roundDescription,
          order: roundOrder,
        });

        // Tạo bài tập nhỏ cho vòng này
        const smallExercisesCount =faker.number.int({ min: 2, max: 6 }); // Số bài tập nhỏ ngẫu nhiên cho mỗi vòng từ 2 đến 6
        totalSmallExercises += smallExercisesCount; // Cộng dồn vào tổng số bài tập nhỏ

        for (let smallExerciseIndex = 0; smallExerciseIndex < smallExercisesCount; smallExerciseIndex++) {
          const smallExerciseName = faker.lorem.words(2); // Tên bài tập nhỏ
          const smallExerciseDescription = faker.lorem.sentence(); // Mô tả bài tập nhỏ
          const smallExerciseDuration =faker.number.int({ min: 30, max: 300 }); // Thời gian cho mỗi bài tập nhỏ

          const smallExerciseUrlImg = await getRandomImageUrl(smallExerciseImageFolder); // Lấy ảnh bài tập nhỏ từ folder small_Exercise
          const smallExerciseUrlVideo = await getRandomVideoUrl(smallExerciseVideoFolder); // Lấy video bài tập nhỏ từ folder small_Exercise

          // Tạo bài tập nhỏ cho vòng
          await SmallExercise.create({
            roundId: round.id,
            name: smallExerciseName,
            description: smallExerciseDescription,
            duration: smallExerciseDuration,
            urlImg: smallExerciseUrlImg,
            urlVideo: smallExerciseUrlVideo,
          });
        }
      }

      // Cập nhật lại tổng số bài tập nhỏ cho bài tập
      await exercise.update({
        num_of_exercises: totalSmallExercises,
      });

      console.log(`Exercise ${name} created successfully with ${totalSmallExercises} small exercises!`);
    }

    console.log(`${exerciseCount} exercises created successfully!`);
    process.exit(0); // Thoát sau khi chạy xong
  } catch (error) {
    console.error('Error seeding exercise data:', error.message);
    process.exit(1); // Thoát với lỗi
  }
};

// seedExercise();

// Chạy preload và seed
(async () => {
  await preloadMediaData();
  await seedExercise();
})();