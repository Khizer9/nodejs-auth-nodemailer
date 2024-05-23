const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const mailer = require('../helpers/mailer')

const userRegister = async (req, res) => {

    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: 'Errors',
            errors: error.array()
        })
    }

    try {
        const {name, email, mobile, password} = req.body;

        const isEmailExist = await User.findOne({email})
        if(isEmailExist){
            return res.status(400).json({
                success: false,
                msg: 'Email Already Exist!'
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            mobile,
            password: hashPassword,
            image: 'images/'+req?.file?.filename
        })

        const userData = await user.save();

        const msg = '<p> Hii '+name+', Please <a href="http://localhost:3000/mail-verification?id='+userData._id+'">verify</a> your email.</p>'

        mailer.sendMail(email, 'Mail Verification', msg)

        return res.status(200).json({
            success: true,
            message: 'User Registered Successfully',
            user: userData
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const mailVerification = async (req, res) => {
    try {

        if(req.query.id == undefined){
            return res.render('404')
        }

        const isIdExist = await User.findOne({_id: req.query.id});

        if(isIdExist?.is_verified == 1){
            return res.render('mail-verification', {message: 'Mail already verified!'})
        }

        if(isIdExist){
            User.findByIdAndUpdate({_id: req.query.id}, {
                $set: {
                    is_verified: true
                }
            });
            return res.render('mail-verification', {message: 'Mail has been verified Successfully!'})
        }else {
            return res.render('mail-verification', {message: 'User Not Found!'})
        }

    } catch (error) {
        console.log(error)
        return res.render('404')
    }
}

const sendEmailVerification = async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            })
        }

        const {email} = req.body;

        const userData = await User.findOne({email})

        if(!userData){
            return res.status(400).json({
                success: false,
                msg: "Email doesn't exists!"
            })
        }

        if(!userData?.is_verified == 1){
            return res.status(400).json({
                success: false,
                msg: `${userData?.email} mail is already verified!`
            })
        }

        const msg = '<p> Hii '+userData.name+', Please <a href="http://localhost:3000/mail-verification?id='+userData._id+'">verify</a> your email.</p>'

        mailer.sendMail(userData.email, 'Mail Verification', msg)

        return res.status(200).json({
            success: true,
            message: 'Verification link sent, please check!',
        })



    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports = {
    userRegister,
    mailVerification,
    sendEmailVerification
}