require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan');
const path = require('path')
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view');




const port = process.env.PORT ? process.env.PORT : '3000'

// creates a connection to MONGO database
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})




// // MIDDLEWARE

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60 // 1 week in seconds
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        httpOnly: true,
        secure: false,
    }
}))
app.use(passUserToView)

// CONTROLLERS
const pagesCtrl = require('./controllers/pages')
const authCtrl = require('./controllers/auth')
const vipCtrl = require('./controllers/vip')
const reviewsCtrl = require('./controllers/reviews.controller');
const Review = require('./models/review.js')




// ROUTE HANDLERS 

app.get('/', pagesCtrl.home)
app.get('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-up', authCtrl.addUser)
app.get('/auth/sign-in', authCtrl.signInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.get('/auth/sign-out', authCtrl.signOut)
app.get('/vip-lounge', isSignedIn, vipCtrl.welcome)


app.use(isSignedIn)

// REVIEWE HANDLERS
app.get('/reviews', reviewsCtrl.index)
app.get('/', reviewsCtrl.index)
app.get('/reviews/new', reviewsCtrl.newReview)

app.post('/reviews/:userId', reviewsCtrl.createReview);
app.get('/reviews/:reviewId', reviewsCtrl.show);
app.delete('/reviews/:userId/:reviewId', reviewsCtrl.deleteReview);
app.get('/reviews/:userId/:reviewId/edit', reviewsCtrl.edit);
app.put('/reviews/:userId/:reviewId', reviewsCtrl.update);

app.listen(port, () => { 
    console.log(`The express app is ready on port ${port}`)
})