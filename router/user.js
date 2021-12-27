const Express = require("express");
const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const router = Express.Router();
const User = require("../model/UserModel");
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


const jwt_secret = process.env.Jwt_secret
router.post("/register", async (req, res) => {
    const bodyInfo = req.body
    if (!bodyInfo || Object.keys(bodyInfo).length === 0) res.sendStatus(422)

    bcrypt.hash(bodyInfo.Password, 12)
        .then((password) => {
            const newUser = User(bodyInfo);
            newUser.Password = password;
            newUser.save()
                .then((userCreated) => {
                    const token = jwt.sign({ id: userCreated._id }, jwt_secret)
                    res.status(200).send({ token })
                })
                .catch((err) => {
                    if (err.name == Mongoose.Error.ValidationError.name) res.send(422)
                    if (err.code == 11000) res.status(409).send({ ErrMsg: "Email Already exists" })
                    else res.sendStatus(500)
                })
        })
        .catch((err) => res.sendStatus(500))
})

router.post("/login", (req, res) => {
    const bodyInfo = req.body
    if (!bodyInfo) res.sendStatus(422)

    User.findOne({ Email: bodyInfo.Email })
        .then((user) => {
            if(!user) res.status(404).send({ErrMsg:"Email doesn't exist"})
            bcrypt.compare(bodyInfo.Password,user.Password)
            .then((condition)=> {
                if (condition) {
                    const token = jwt.sign({ id: user._id }, jwt_secret)
                    res.status(201).send({ token })
                }
                else res.status(401).send({ErrMsg:"Please Try Again"})
            })
        })
        .catch((err) => {
            console.error(err)
            res.sendStatus(500)
        })
})

module.exports = router