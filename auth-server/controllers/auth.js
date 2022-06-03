const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res) => {

    const { name, email, password } = req.body;
    const stringPass = String(password)

    try {
        //Verificate email
        const user = await User.findOne({ email });
        const username = await User.findOne({ name });
        if (user){
            return res.status(400).json({
                ok: false,
                msg: 'This email already exist'
            });
        }

        if (username){
            return res.status(400).json({
                ok: false,
                msg: 'This username already exist'
            });
        }

        //User Model
        const userdb = new User(req.body);

        //Hashear password
        const salt = await bcrypt.genSaltSync(10);
        userdb.password =  await bcrypt.hashSync( stringPass, salt );

        // Generate JsonWebToken (JWT)
        const token = await generateJWT(userdb.id, name);

        //Create User in DB
        await userdb.save();

        // Sucess response
        return res.status(201).json({
            ok: true,
            uid: userdb.id,
            name,
            email,
            token
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Contact the administrator to solve'
        })
    }
    
};

const loginUser =  async (req, res) => {

    const { email, password } = req.body;
    const stringPass = String(password)

    try {
        //Confirm user already exist in DB
        const userdb = await User.findOne({ email });
        if(!userdb){
            return res.status(400).json({
                ok: false,
                msg: 'This user no exist (email no registered)'
            })
        };
        //confirm password
        const validPassword = bcrypt.compareSync(stringPass, userdb.password);
        if (!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'This password not match with the user'
            })
        };

        // Generate JsonWebToken (JWT)
        const token = await generateJWT(userdb.id, userdb.name);

        // Sucess response
        return res.status(200).json({
            ok: true,
            uid: userdb.id,
            name: userdb.name,
            email: userdb.email,
            token
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Contact the administrator to solve'
        })
    }
};

const renewToken = async (req, res) => {

    const { uid } = req;

    //Search in DB
    const userdb = await User.findById(uid)
    
    // Generate JsonWebToken (JWT)
    const token = await generateJWT(uid, userdb.name); 

    return res.json({
        ok: true,
        uid,
        name: userdb.name,
        email: userdb.email,
        token
    })
};


module.exports = {
    createUser,
    loginUser,
    renewToken
}