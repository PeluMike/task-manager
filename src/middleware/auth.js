const User = require('../models/users')
const jwt = require('jsonwebtoken')


const auth = async (req,res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisaxode')
        const user =await User.findOne({_id:decoded._id, 'tokens.token':token})
        
        if (!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch{
        res.status(401).send({"error":"pls authenticate!"})
    }
    
}

module.exports = auth