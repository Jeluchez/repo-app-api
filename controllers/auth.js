const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generarJWT } = require('../helpers/jwt');
const { default: axios } = require('axios');


const createUser = async (req, res = response) => {
    try {

        const { email, password } = req.body;

        // verificar que el email no exista
        const existeEmail = await User.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }

        const user = new User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        // Guardar user en BD
        await user.save();
        // send email
        // const error = await sendEmail({
        //     ...req.body,
        //     id: user['_id']
        // });

        // console.log(error);

        // if (error) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'Occur a error in the server'
        //     });
        // }
        // Generar el JWT
        const token = await generarJWT(user.id);

        res.json({
            ok: true,
            msg: "User Created",
            user,
            token
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Contact you to admin'
        });
    }
}

const confirmEmail = async (req, res) => {

    const id = req.params.id;

    try {
        // check if exists user
        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'The user is not exists'
            });
        }

        user.isVerifiedEmail = true;
        user.save();


        // Generar el JWT
        const token = await generarJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {

    }


}
const read = async (req, res) => {
    try {

        // Verificar si existe el correo
        const users = await User.find();


        res.json({
            ok: true,
            users
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Contact you to admin'
        });
    }
}

// login
const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        // Verificar si existe el correo
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado',
                code: 400
            });
        }
        // check id the account es verify
        // if(!user.isVerifiedEmail){
        //     return res.status(404).json({
        //         ok: false,
        //         msg: 'verify your acount'
        //     });
        // }
        // Validar el password
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(403).json({
                ok: false,
                msg: 'Password no es correcto',
                code: 403
            });
        }
        // // get if user is moderator
        // const mod = await Chat.findOne({ moderator: user._id }).exec();
        // // Generar el JWT
        const token = await generarJWT(user.id);
        res.json({
            ok: true,
            user,
            token,
            code: 200
            // moderator: mod?.moderator
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Contact you to admin'
        });
    }

}


// renewToken
const renewToken = async (req, res) => {

    const uid = req.uid;
    // console.log('id: ', uid);
    // Generar un nuevo JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por UID
    const user = await User.findById(uid);

    res.json({
        ok: true,
        user,
        token,
    })
}

const recieveOauth = async (req, res) => {

    const clientID = '53088d73f92fd54ccefe';
    const clientSecret = 'a713326b7451757f726e2dd6508fa1f7fa5cbb23';

    const requestToken = req.query.code
    
    try {
        const { data } = await
            axios({
                method: 'post',
                url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
                // Set the content type header, so that we get the response in JSON
                headers: {
                    accept: 'application/json'
                }
            })

        if (data.access_token) {
            res.redirect(`http://localhost:3000/success/${data.access_token}`);
        }
    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Contact you to admin',
            error: value
        });

    }

}






module.exports = {
    read,
    createUser,
    login,
    renewToken,
    confirmEmail,
    recieveOauth,
}
