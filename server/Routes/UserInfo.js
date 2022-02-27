const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { UserInfo } = require('../models');


//upload image
const storage = multer.diskStorage({
    destination: (req, file, callBck) => {
        callBck(null, 'Images/User')
    },
    filename: (req, file, callBck) => {
        callBck(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: '5000000' },
    fileFilter: (req, file, callBck) => {
        const fileTypes = /jpeg|png|jpg/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return callBck(null, true)
        }
        callBck('Give proper file format to upload')
    }
}).single('image')



router.post('/', upload, async (req, res) => {

    const user = {
        firstName: req.body.firstName,
        LastName: req.body.lastName,
        image: req.file.path,
        phoneNumbre: req.body.phoneNumbre,
        email: req.body.email,
        adress: req.body.adress,
    }

    await UserInfo.create(user);
    res.json(user);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await UserInfo.findByPk(id);
    res.json(user);
});




module.exports = router;