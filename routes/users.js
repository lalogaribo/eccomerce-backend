const User = require('../models/user');
const express = require('express');
const router = express.Router();


router.get(`/`, async (req, res) =>{
    try {
        const allUsers = await User.find().select('-password ');
        res.status(200).send(allUsers)
    } catch (e) {
        res.status(500).send({success: false, message: 'No users created'})
    }
})

router.put('/:userId', async (req, res) => {
    const {userId} = req.params;

    try {
        let user = await User.findByIdAndUpdate(userId, {...req.body}, {new: true})
        res.status(200).send({success: true, user})
    } catch (e) {
        res.status(404).send({success: false, message: 'User with given id doesnt exist'})
    }
})

router.post('/', async (req, res) =>{
    let user = new User({...req.body})

    try {
        await user.save()
        res.status(201).send({success: true, user})
    } catch (e) {
        res.status(404).send({success: false, message: 'An error'})
    }
})

router.get('/:userId', async (req, res) => {
    const {userId} = req.params;

    try {
        let user = await User.findById(userId).select('-password')
        res.status(200).send({success: true, user})
    } catch (e) {
        res.status(404).send({success: false, message: 'User with given id doesnt exist'})
    }
})


router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateJwtToken()
        res.send({ user, token });
    } catch (e) {
        res.status(404).send(e.message)
    }
})

router.post('/register', async (req, res) =>{
    let user = new User({...req.body})

    try {
        await user.save()
        res.status(201).send({success: true, user})
    } catch (e) {
        res.status(404).send({success: false, message: 'An error'})
    }
})

module.exports =router;