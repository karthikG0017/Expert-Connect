const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const expressAsyncHandler = require('express-async-handler')

const register = expressAsyncHandler(async(req, res) => {
    const {name, email, password, role} = req.body;
    try {
        const existing = await User.findOne({email})
        if (existing) return res.status(400).send({message: "User already exists"})
        
        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashed, role})

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.send({token, user: {id: user._id, name: user.name, role: user.role}})
    } catch(err) {
        res.status(500).send({message: "Error in registration", payload:err.message})
    }
})

const login = expressAsyncHandler(async(req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) return res.status(404).send({message: "User not found"})

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).send({message: "Invalid credentials"})

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn:'7d'})
        res.send({token, user: {id: user._id, name: user.name, role: user.role}})
    } catch(err) {
        res.status(500).send({message: "Error in login"})
    } 
})

module.exports = {register, login}