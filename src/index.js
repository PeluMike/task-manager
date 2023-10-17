const express = require('express')
const User = require('./models/users')
const Task = require('./models/tasks')
const usersRouter = require('./routers/users')
const tasksRouter = require('./routers/tasks')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3500

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits:{
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb){
//         if (!file.originalname.endsWith('.pdf')){
//             return cb(new Error('Provide a pdf file'))
//         }

//         cb(undefined, true)
//     }
// })


// app.post('/upload', upload.single('upload'), (req, res)=>{
//     res.send()
// }, (error, req, res,next )=>{
//     res.status(400).send({error: error.message})
// })

app.use(express.json())
app.use(usersRouter)
app.use(tasksRouter)


app.listen(port, () => {
    console.log('Server is up and running on ' + port)
})