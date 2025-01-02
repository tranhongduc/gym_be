const db = require("../models/index");
const User = db.users;

exports.profile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findOne({
            where: { id },
            // include: ["requests"],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

         // Convert date of birth to dd/mm/yyyy format
         const dob = new Date(user.dob);
         const day = String(dob.getDate()).padStart(2, '0');
         const month = String(dob.getMonth() + 1).padStart(2, '0'); // Months are 0-based
         const year = dob.getFullYear();
 
         const formattedDob = `${day}/${month}/${year}`;


          // Calculate the age (birth)
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();

        // If the birthdate hasn't passed this year yet, subtract 1 from age
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
       

         return res.status(200).json({
            ...user.toJSON(),
            dob: formattedDob,
            birth: age // Add calculated age (birth)
        });
        } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.user; // Lấy ID từ token đã xác thực
        const {
            name,
            phoneNumber,
            dob,
            sex,
            weight,
            height,
            avatar,
            activityLevel,
            goal
        } = req.body; // Dữ liệu gửi từ client

        // Tìm người dùng theo ID
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cập nhật thông tin
        await user.update({
            name,
            phoneNumber,
            dob,
            sex,
            weight,
            height,
            avatar,
            activityLevel,
            goal
        });

        // Trả về thông tin đã cập nhật
        return res.status(200).json({
            message: "User profile updated successfully",
            user: user.toJSON()
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
