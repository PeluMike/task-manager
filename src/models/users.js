const mongoose = require('mongoose')
const validator = require('validator')
const Tasks = require('./tasks')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim: true
    }, 
    age:{
        type: Number,
        validate(value){
            if (value < 1){
                throw new Error('No negetive number is allowed!!')
            }
        }
    },
    email:{
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is not valid!')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim: true,
        minlenght: 7,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('Passwords cannot be saved as password')
            }
            if(value.length <= 6){
                throw new Error('Password must be greater than 6')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
}
)

userSchema.virtual('tasks', {
    ref:'Taks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisisaxode')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject

}

userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email})
    // console.log(user)
    if (!user){
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('Unable to login!')
    }

    return user
}



userSchema.pre('save', async function(next){
    const user = this

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


userSchema.pre('remove', async function(next){
    const user = this
    await Tasks.deleteMany({owner:user._id})

    next()
})

const User = mongoose.model('Users', userSchema)

module.exports = User