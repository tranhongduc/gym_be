const db = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randToken = require("rand-token");
const jwtConfig = require("../configs/jwt.config");
const promisify = require("util").promisify;
const User = db.users;
const AuthService = require("../services/authService/auth.service");
const { error } = require("console");

// exports.register = async (req, res) => {
//     try {
        
//         const {
//             email,
//             password,
//             repeatPassword,
//             name,
//             dob,
//             phoneNumber,
//             sex,
//             weight,
//             height,
//             avatar,
//         } = req.body;

//         const user = await User.findOne({ where: { email: email } });
//         if (user) {
//             return res.status(400).json({ message: "Email already exists" });
//         }

//         if (password !== repeatPassword) {
//             return res.status(400).json({
//                 message: "Password and repeat password are not the same",
//             });
//         }

//         const hashedPassword = await bcrypt.hashSync(password, 10);
//         let status = "active";
//         let role = "user";

//         const newUser = await User.create({
//             role: role,
//             email: email,
//             password: hashedPassword,
//             name: name,
//             dob: dob,
//             phoneNumber: phoneNumber,
//             sex: sex,
//             weight: weight || null,
//             height: height || null,
//             avatar: avatar || null,
//             status: status,
//         });

//         const userWithoutPassword = newUser.toJSON();
//         delete userWithoutPassword.password;

//         return res.status(201).json(userWithoutPassword);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

exports.register = async (req, res) => {
    try {
        const {
            email,
            password,
            repeatPassword,
            name,
            dob,
            phoneNumber,
            sex,
            weight,
            height,
            avatar,
            activityLevel,
            goal,
        } = req.body;

        

        // Kiểm tra email đã tồn tại chưa
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Kiểm tra mật khẩu có khớp không
        if (password !== repeatPassword) {
            return res.status(400).json({
                message: "Password and repeat password are not the same",
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10); // Ensure bcrypt is imported

        // Tính toán BMI nếu có đủ thông tin trọng lượng và chiều cao
        let bmi = null;
        if (weight && height) {
            const heightInMeters = height / 100;  // Chuyển chiều cao từ cm sang mét
            bmi = weight / (heightInMeters * heightInMeters);
            bmi = parseFloat(bmi.toFixed(2));  // Làm tròn BMI đến 2 chữ số thập phân
        }

        let status = 1;
        let role = "user";

        // Tạo người dùng mới
        const newUser  = await User.create({
            role: role,
            email: email,
            password: hashedPassword,
            name: name,
            dob: dob,
            phoneNumber: phoneNumber,
            sex: sex,
            weight: weight || null,
            height: height || null,
            avatar: avatar || null, // Ensure avatar is allowed in the model
            status: status,
            activityLevel: activityLevel || null,
            goal: goal || null,
            bmi: bmi || null,  // Lưu giá trị BMI vào cơ sở dữ liệu
        });

        // Xóa mật khẩu khỏi dữ liệu trả về
        const userWithoutPassword = newUser .toJSON();
        delete userWithoutPassword.password;

        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if email exists
        const user = await User.scope("withPassword").findOne({
            where: { email: email },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compareSync(
            password,
            user.password
        );
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessTokenLife = jwtConfig.accessTokenLife;
        const accessTokenSecret = jwtConfig.accessTokenSecret;

        const dataForAccessToken = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        };

        const accessToken = await AuthService.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife
        );
        if (!accessToken) {
            return res.status(401).json({ message: "Login failed" }, error.message);
        }

        let refreshToken = randToken.generate(jwtConfig.refreshTokenSize);
        if (!user.refreshToken) {
            // user has no refresh token
            await User.update(
                { refreshToken: refreshToken },
                { where: { id: user.id } }
            );
        } else {
            // user has refresh token
            refreshToken = user.refreshToken;
        }

        // remove password and refresh token from user object
        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;
        delete userWithoutPassword.refreshToken;

        return res.status(200).json({
            msg: "Login successfully",
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        // get access token from header
        const accessTokenFromHeader = req.accessToken;
        if (!accessTokenFromHeader) {
            return res
                .status(400)
                .json({ message: "Access token is required" });
        }

        // get refresh token from body
        const refreshTokenFromBody = req.body.refreshToken;
        if (!refreshTokenFromBody) {
            return res
                .status(400)
                .json({ message: "Refresh token is required" });
        }

        // verify access token
        const accessTokenSecret = jwtConfig.accessTokenSecret;
        const accessTokenLife = jwtConfig.accessTokenLife;

        const decodedAccessToken = await AuthService.decodeToken(
            accessTokenFromHeader,
            accessTokenSecret
        );
        if (!decodedAccessToken) {
            return res.status(401).json({ message: "Access token is invalid" });
        }

        // get user from access token
        const userId = decodedAccessToken.payload.id;
        const user = await User.scope("withPassword").findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // check refresh token
        if (user.refreshToken !== refreshTokenFromBody) {
            return res
                .status(400)
                .json({ message: "Refresh token is invalid" });
        }

        // generate new access token
        const dataForAccessToken = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        };

        const newAccessToken = await AuthService.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife
        );
        if (!newAccessToken) {
            return res.status(401).json({ message: "Refresh token failed" });
        }

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.logout = async (req, res) => {
    try {
        // get user from access token
        const { id } = req.user;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // remove refresh token from user
        await User.update({ refreshToken: null }, { where: { id: user.id } });

        return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.checkDatabaseConnection = async (req, res) => {
    try {
      // Truy vấn cơ sở dữ liệu để kiểm tra kết nối
      await db.sequelize.authenticate(); // Xác minh kết nối
  
      // Nếu kết nối thành công, trả về thông báo
      return res.status(200).json({ success: true, message: 'Database connected!' });
    } catch (error) {
      console.error('Database connection error:', error);
      // Nếu kết nối không thành công, trả về lỗi
      return res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
    }
  };

  