// 

const mongoose = require('mongoose')
const validator = require('validator')




async function main() {
    await mongoose.connect('mongodb://localhost:27017/task-manager-api', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        if (error) {
            return console.log('Database not connecting!', error)
        }
        console.log('Database connected succesfully!')
    });
}

main()