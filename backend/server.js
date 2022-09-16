//express
import express from 'express'

//dot env
import dotenv from 'dotenv'

//morgan
import morgan from 'morgan'

//colors
import colors from 'colors'

//path
import path from 'path'

//connect db
import connectDB from './config/db.js';

//products
import products from './data/products.js'

//error handler
import {notFound, errorHandler} from './middleware/errorMiddleware.js'

//product routes
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

//connect to db
connectDB()

//app
const app = express()

if(process.env.NODE_ENV === "development"){
  app.use(morgan('dev'))
}

//use error middleware
app.use(notFound)

//use error middleware
app.use(errorHandler)

//use middleware to handle json data
app.use(express.json())



app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
)
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}




const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
  console.log("server listening on port", PORT)
})
