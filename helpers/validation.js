const {check} = require('express-validator')

exports.registerValidator = [
    check('name', 'Name field is required').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail().normalizeEmail(),
    check('mobile', 'Mobile number should conatain 11 digits').isLength({
        min:11,
        max:11
    }),
    check('password', 'Password must be greater than 6 character, and contains atleast one uppercase, one lowercase, one number, and one special character').isStrongPassword({
        minLength:6,
        minLowercase:1,        
        minUppercase:1,        
        minNumbers:1,        
        minSymbols:1,        
    }),
    check('image').custom((value, {req}) => { 
        if(req.file?.mimetype === 'image/jpeg' || req.file?.mimetype === 'image/png'){
            return true
        }else {
            return false
        }
    }).withMessage('Please upload an image jpeg/png')
]

exports.emailVerificationValidator = [
    check('email', 'Please enter valid email').isEmail().normalizeEmail(),  
]