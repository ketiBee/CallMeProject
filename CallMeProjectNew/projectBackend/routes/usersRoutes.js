const router = require('express').Router()
const User = require('../models/userModels');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


//spremi podatke o korisniku/REGISTRACIJA KORISNIKA
router.post('/register', async (req, res) => {

    try{
        let { fullname, email, password } = req.body;
    
         if(!fullname) {
            return res.send({
                success: false,
                message: 'Error: fullname cannot be blank!'
            });
        }
         if(!email) {
            return res.send({
                success: false,
                message: 'Error: email cannot be blank!'
            });
        }
        if(!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank!'
            });
        }
    
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.send({
                success: false,
                message: 'Error: Account with that email already exists!'
            });
        }
    
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
    
        const newUser = new User({
            fullname: fullname,
            email: email,
            password: passwordHash
        });

        const savedUser = await newUser.save();
        

        // //login access token with JWT

        // const token = jwt.sign({
        //     user: savedUser._id
        // }, process.env.JWT_KEY);

        // //send the token in a HTTP-only cookie

        // res.cookie("token", token, {
        //     httpOnly: true,
        // }).send();
        
       
    
    }catch(err) {
        console.error(err);
        res.status(500).send();}   
});


    //dohvati sve korisnike
router.get('/', (req, res) => {
        User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: '+err));
    });
    
    //LOGIN KORISNIKA
router.post("/login", async (req, res) => {
        try{
    
            let { email, password } = req.body;
    
            if(!email) {
                return res.send({
                    success: false,
                    message: 'Error: email cannot be blank!'
                });
            }
            if(!password) {
                return res.send({
                    success: false,
                    message: 'Error: Password cannot be blank!'
                });
            }
    
            const existingUser = await User.findOne({email});
            if(!existingUser) {
                return res.send({
                    success: false,
                    message: 'Error: Wrong email or password'
                });
            }
    
            const passwordCorrect = await bcrypt.compare(
                password, 
                existingUser.password
                );

            if(!passwordCorrect) {
                return res.send({
                    success: false,
                    message: 'Error: Wrong email or password'
                });
            }
    
            const token = jwt.sign({
                user: existingUser._id
            }, process.env.JWT_KEY);
    
        
    
            res.cookie("token", token, {
                httpOnly: true,
                
            }).send();

      }catch(err) {
        console.error(err);
        res.status(500).send();
        }
    });

router.get("/logout", (req, res) => {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        }).send();
    });

    //a way to check if you ar logged in
router.get("/loggedIn", (req, res) => {
    const token=req.cookies.token;
    res.send(token); ///???
})

router.get('/protected-data', auth, (req,res) => {

    
    const userData = req.user;
    res.json(userData);
  
    
  })

    module.exports = router;