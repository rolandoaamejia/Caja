import multer from 'multer';
import { v4 as uuid } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
})

export default multer({
    storage,
    fileFilter: function (req: any, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.xlsx') {
            return callback(null, false);
        }
        callback(null, true)
    },
    limits: {
        // fileSize: 1024 * 1024

    }
});