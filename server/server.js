import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './Controllers/webhooks.js'
import educatorRoute from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js'
import userRouter from './routes/userRoutes.js'

// initilize Express
const app = express()

// connect to database and cloudinary
await connectDB()
await connectCloudinary()

// middlewares
app.use(cors())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
    res.send("API Working fine")
})

app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRoute)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server runing on port ${port}`)
})