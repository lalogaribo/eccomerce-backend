const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.post('/', async (req, res) =>{
    let user = User.new({...req.body})

    try {
        await user.save()
        res.status(201).send({success: true, user})
    } catch (e) {
        res.status(404).send({success: false, message: 'An error'})
    }
})

module.exports =router;