require('../src/db/mongoose')

const User = require('../src/models/users')
const Tasks = require('../src/models/tasks')

// User.findByIdAndUpdate('630aba7eb14b08c85dd2cdb8', { age: 40 }).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age: 40})
// }).then((response)=>{
//     console.log(response)
// }).catch((e)=>{
//     console.log(e)
// })


const findUserAndCount = async(id, age)=>{
    const upadateUser = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({age})
    return count
}

findUserAndCount('630b95c2f8869afc217bd975', 40).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})




// Tasks.findByIdAndRemove('630ad83aefd72dcc31d4286e', {}).then((task)=>{
//     console.log(task)
//     return Tasks.countDocuments({completed:false })
// }).then((num)=>{
//     console.log(num)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskCount = async(id, completed)=>{
    const deleteTask = await Tasks.findByIdAndDelete(id)
    const count = await Tasks.countDocuments({ completed:false })
    return count
}

deleteTaskCount("630b9b0a9f9106bb74619c2b").then((count)=>{
    console.log(count)
})


