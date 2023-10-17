const express = require('express')
const Task = require('../models/tasks')
const auth = require('../middleware/auth')
const { request } = require('express')

const router = express.Router()


router.post('/tasks', auth, async(req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        const tasks = await task.save()
        res.status(201).send(tasks)

    } catch (e) {
        res.status(500).send(e)
    }
})


//GET /task?completd=true
//GET /task?limit=true
router.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}


    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const task = await Task.find({owner:req.user._id, completed:req.query.completed})
        // console.log(req.query.completed) //another way of quering
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }

        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/task/:id', auth, async(req, res) => {
    const _id = req.params.id
    const task = await Task.findById({ _id, owner: req.user._id })
    try {
        if (!task) {
            res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/task/update/:id', auth, async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpadates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpadates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ "error": "Invalid upadate!" })
    }
    try {
        const task = await Task.findOneAndUpdate({ _id, owner: req.user._id })
        updates.forEach((upadate) => task[upadate] = req.body[upadate])
        await task.save()
        if (!task) {
            return res.status(404).send()
        }
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send()
    }

})

router.delete('/task/delete/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            res.status(404).send({ "message": "Task not found!" })
        }
        res.status(200).send({ "message": "Task deleted successfully!" })
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router