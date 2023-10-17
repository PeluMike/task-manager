
const mongodb = require('mongodb')


const { MongoClient, ObjectId } = mongodb

// const id = new ObjectId
// console.log(id)
// console.log(id.getTimestamp())

const connectionUrl = 'mongodb://127.0.0.1/27017'
const dataBase = 'task-manager'

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client)=>{
    if (error){
        return console.log('An error occur!')
    }

    const db = client.db(dataBase)

  db.collection('tasks').deleteMany({
        completed: true
  }).then((result)=>{
        console.log(result)
  }).catch((error)=>{
        console.log(error)
  })
})