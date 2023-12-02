const jwt = require("jsonwebtoken");
const User = require('../models/userModels');


function auth(req, res, next) {
    try{ 

        const token = req.cookies.token;

        if(!token)
            return res.status(401).json({message: "Unauthorized!"});

        jwt.verify(token, process.env.JWT_KEY,(err, payload) => {
            if(err) {
                return res.status(401).json({error: "You must be logged in"})
            }

            const {user} = payload
            User.findById(user).then(userdata => {
                req.user = userdata
                
                next();
            })
 
        })
        
        
        

    }catch(err) {
    console.error(err);
    res.status(401).json({message: "Unauthorized!"});


    //cookie parser - express middleware koji ce procitati svaki nadolazeci
    //cookie i parsirati ga u res.cookies objekt da ga mozemo procitati
    }
}

module.exports = auth;