const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { UserInfo } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthCheck } = require('../Midellwers/AuthCheck');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);


//upload image
const storage = multer.diskStorage({
    destination: (req, file, callBck) => {
        callBck(null, '../Images/')
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


/**************** INSERT USER (register) ****************/
router.post('/', upload, (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (!err) {
            const user = {
                firstName: req.body.firstName,
                LastName: req.body.lastName,
                image: req.file.path,
                phoneNumbre: req.body.phoneNumbre,
                email: req.body.email,
                adress: req.body.adress,
                password: hash
            }
            await UserInfo.create(user);
            res.json(user);
        }
        else {
            res.json(err);
        }
    })
});

/**************** GET USER BY ID ****************/
router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    const user = await UserInfo.findByPk(id, {
        attributes: {
            exclude: ["password"]
        }
    });
    res.json(user);
});

/**************** GET ALL USERS ****************/
router.get('/', async (req, res) => {
    const users = await UserInfo.findAll({
        attributes: {
            exclude: ["password"]
        }
    });
    res.json(users);
});

/**************** LOGIN ****************/
router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await UserInfo.findOne({ where: { email: email } })

    if (!user) {
        res.json({ error: "Email not found" });
    } else {
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                res.json({ error: "Wrong password" });
            } else {
                const Token = jwt.sign({ id: user.id, fname: user.firstName, lname: user.LastName, image: user.image, email: user.email }, 'secretToken');
                res.json(Token);
            }
        });
    }
});

/****************** GET LOGGED USER *************/
router.get('/logedUser', AuthCheck, (req, res) => {
    res.json(req.user);
});

/****************** delete account *************/
router.delete('/deleteAccount', async (req, res) => {

    const id = req.body.id
    const password = req.body.password

    const user = await UserInfo.findByPk(id);

    if (!user) return res.json({ error: "user not axist" });

    bcrypt.compare(password, user.password).then((match) => {
        if (!match) return res.json({ error: "Wrong password" });

        UserInfo.destroy({ where: { id: id } });
        unlinkAsync(user.image);

        res.json("delete Succcess");
    })
});




module.exports = router;