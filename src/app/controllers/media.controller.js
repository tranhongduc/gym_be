const cloudinary = require('../configs/cloudinary.config');

// API upload file
const uploadMedia = async (req, res) => {
    try {
        const { mediaUrl, mediaType } = req.body;

        if (!mediaUrl || !mediaType) {
            return res.status(400).json({ error: 'Media URL and media type are required.' });
        }

        // Xác định resource type (image hoặc video)
        const resourceType = mediaType === 'video' ? 'video' : 'image';

        // Upload file lên Cloudinary
        const result = await cloudinary.uploader.upload(mediaUrl, {
            folder: 'workouts',
            resource_type: resourceType, // Phân biệt giữa image và video
        });

        // Trả về URL file từ Cloudinary
        res.json({
            message: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} uploaded successfully!`,
            mediaUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ error: 'Something went wrong during media upload.' });
    }
};

const uploadMediaS = async (req, res) => {
    try {
        const { mediaUrl, mediaType } = req.body;

        if (!mediaUrl || !mediaType) {
            return res.status(400).json({ error: 'Media URL and media type are required.' });
        }

        // Xác định resource type (image hoặc video)
        const resourceType = mediaType === 'video' ? 'video' : 'image';

        // Upload file lên Cloudinary
        const result = await cloudinary.uploader.upload(mediaUrl, {
            folder: 'small_exercise',
            resource_type: resourceType, // Phân biệt giữa image và video
        });

        // Trả về URL file từ Cloudinary
        res.json({
            message: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} uploaded successfully!`,
            mediaUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ error: 'Something went wrong during media upload.' });
    }
};

const uploadMediaF = async (req, res) => {
    try {
        const { mediaUrl, mediaType } = req.body;

        if (!mediaUrl || !mediaType) {
            return res.status(400).json({ error: 'Media URL and media type are required.' });
        }

        // Xác định resource type (image hoặc video)
        const resourceType = mediaType === 'video' ? 'video' : 'image';

        // Upload file lên Cloudinary
        const result = await cloudinary.uploader.upload(mediaUrl, {
            folder: 'foods',
            resource_type: resourceType, // Phân biệt giữa image và video
        });

        // Trả về URL file từ Cloudinary
        res.json({
            message: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} uploaded successfully!`,
            mediaUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ error: 'Something went wrong during media upload.' });
    }
};

const uploadMedia2 = async (req, res) => {
    try {
        const { mediaUrl, mediaType } = req.body;

        if (!mediaUrl || !mediaType) {
            return res.status(400).json({ error: 'Media URL and media type are required.' });
        }

        // Xác định resource type (image hoặc video)
        const resourceType = mediaType === 'video' ? 'video' : 'image';

        // Xác định thư mục upload dựa trên mediaType
        let folder;
        switch (mediaType) {
            case 'food':
                folder = 'foods';
                break;
            case 'small_exercise':
                folder = 'small_exercises';
                break;
            case 'image':
            case 'workouts':
                folder = 'workouts';
                break;
            default:
                return res.status(400).json({ error: 'Invalid media type.' });
        }

        // Upload file lên Cloudinary
        const result = await cloudinary.uploader.upload(mediaUrl, {
            folder,
            resource_type: resourceType, // Phân biệt giữa image và video
        });

        // Trả về URL file từ Cloudinary
        res.json({
            message: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} uploaded successfully!`,
            mediaUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ error: 'Something went wrong during media upload.' }, error.message);
    }
};


module.exports = {
    uploadMedia,uploadMedia2,uploadMediaS,uploadMediaF
};
