//modules
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = db.users;

/* function idCheck() {
    User.update( 
        {
            status: "Active",
        },
        {
            where:{ id : User.userId },
        }
    );
} */

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
//************************************************************************************************************************************************* */
const tokenMail = jwt.sign(
    {
    data: 'Token Data'},
    'ourSecretKey', { expiresIn: '60m' }  
);


                const sendEmail = async () => {
                try {
                const transporter = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                    user: "adce9ef8b7b1e5",
                    pass: "49a4b0382b83d0"
                    },
                });

                await transporter.sendMail({
                    from: process.env.USER,
                    to: email,
                    subject: "Confirm your registration",
                    text: `Please ${firstName} click on the link to validate your registration,

                    http://localhost:3000/api/users/verify/${tokenMail}

                    Thanks`
                });
                console.log("email sent sucessfully");
                } catch (error) {
                console.log("email not sent");
                console.log(error);
                } 
                };

                sendEmail();
//************************************************************************************************************************************************* */             

                return res.status(201).render('verif');
            } else {
                return res.status(409).send("Information incorrect")
            }
    } catch(error) {
        console.log(error);
    }
};

//=====================================================================================
    

    const emailVerif = async (req, res)=>{
    const {token} = req.params;
    
    // Verifing the JWT token 
    jwt.verify(token, 'ourSecretKey', function(err, decoded) {
        if (err) {
            console.log(err);
            res.send(`Email verification failed, 
                    possibly the link is invalid or expired`);
        }
        else {

            //idCheck()
            User.update( 
                {
                    status: "Active",
                },
                {
                    where:{ id : 1 },
                }
            );
            
            res.send("Email verifified successfully");
        }
    });
}




//=====================================================================================


//authentication
const login = async (req, res) => {
    try {
    const {userName, password} = req.body;

        const user = await User.findOne({
            where: {
                userName: req.body.userName
            }
            });
    if(user.status != null) {
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
        } }else {
            return res.status(401).send("Email authentication failed");
    }
} catch (error) {
    console.log(error)
}
};

module.exports = {
    signup,
    login,
    emailVerif
};