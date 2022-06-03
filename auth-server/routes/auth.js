const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { jwtValidator } = require('../middlewares/jwt-vvalidation');
const { validator } = require('../middlewares/validations');

const router = Router();

//New User
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required - format email').isEmail(),
    check('password', 'Password is required - 6 characters min').isLength({min: 6}),
    validator
], createUser)

//User Login
router.post('/', [
    check('email', 'Email is required  - format email').isEmail(),
    check('password', 'Password is required - 6 characters min').isLength({min: 6}),
    validator
] ,loginUser)

//Validate token
router.get('/renew',jwtValidator,renewToken)



module.exports = router;