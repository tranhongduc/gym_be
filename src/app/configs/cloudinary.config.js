const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: 'dk03p4gra',
    api_key: '165484976389168',
    api_secret: 'FgLIgDk96h1PcekiI--fLTGepdM',
});

module.exports = cloudinary;
