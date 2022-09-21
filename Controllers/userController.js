//modules
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const sendMail = require('../Middlewares/mail.js')

const User = db.users;

const signup = async( req, res) => {
    try {
        const {firstName, lastName, email, userName, password, passwordCheck } = req.body;
        const data = {
            firstName,
            lastName,
            email,
            userName,
            password: await bcrypt.hash(password, 10),
            passwordCheck,
        };

        const user= await User.create(data);

            if(user) { 
                let token = jwt.sign({ id: user.id }, 'process.env.secretKey', {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });
                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 *60, httpOnly: true});
                console.log("user", JSON.stringify(user, null, 2));
                console.log(token);
                console.log(sendMail());

                return res.status(201).render('home');
            } else {
                return res.status(409).send("Information incorrect")
            }
    } catch(error) {
        console.log(error);
    }
};



//authentication
const login = async (req, res) => {
    try {
    const {userName, password} = req.body;

        const user = await User.findOne({
            where: {
                userName: req.body.userName
            }
            });

        if(user) {
            const isSame = await bcrypt.compare(password, user.password);

            if(isSame) {
                let token = jwt.sign({ id: user.id}, 'process.env.secretKey', {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                res.cookie("jwt", token, {mixAge: 1 * 24 * 60 * 60, httpOnly: true});
                console.log("user", JSON.stringify(user, null, 2));
                console.log(token);

                return res.status(201).render('home');
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
    }
} catch (error) {
    console.log(error)
}
};

module.exports = {
    signup,
    login
};