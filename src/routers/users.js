const express = require('express')
const User = require('../models/users')
const multer = require('multer')
const sharp = require('sharp')

const auth = require('../middleware/auth')

const router = express.Router()

router.post('/users', async (req, res)=>{
   const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user, token})
    }catch (e){
        res.status(400).send(e)
    }
})


router.post('/user/login', async(req, res)=>{
   
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})


router.post('/user/logout', auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
    
} )


router.post('/user/logoutall',auth, async(req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/user/me',auth, async(req, res)=>{
    res.send(req.user)
})


router.patch('/user/update/me',auth, async (req, res)=>{
    const user = await req.user
    const updates = Object.keys(req.body) 
    const allowedUpadates = ["name", "password", "age", "email"]
    const isValidOperation = updates.every((update)=> allowedUpadates.includes(update))
    if (!isValidOperation){
        return res.status(400).send({"error":"Invalid update!"})
    }
    try{
        // const user = await User.findByIdAndUpdate(_id, req.body,{ new: true, runValidators:true})
        // const user = await User.findById(_id)
        updates.forEach((upadate)=> user[upadate] =req.body[upadate])
        await user.save()
       
        res.status(201).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})


router.delete('/user/delete/me',auth, async(req, res)=>{
    const _id = req.user._id
    try{
        // const user = await User.findByIdAndDelete(_id)
        // res.status(200).send({"message":"User deleted succesfully"})
        req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})



const upload = multer({
    limits: {
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/gm)){
            cb(new Error('File must be an image'))
        }
        cb(undefined, true)
    }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    try{
        const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    }catch(e){
        res.send(e)
    }
   
},(error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/user/avatar/delete', auth, async(req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/user/avatar/:id', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        if (!user || user.avatar){
            throw new Error()
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    }catch(e){
    }
})

module.exports = router