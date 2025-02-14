import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './configs/mongodb.js'

// initilize Express
const app = express()

// connect to database
await connectDB()

// middlewares
app.use(cors())

// Routes
app.get('/',(req,res) =>{
    res.send("API Working fine")
})

const port = process.env.PORT || 5000
app.listen(port , () => {
    console.log(`Server runing on port ${port}`)
})