const express = require('express');
const dotenv = require('dotenv');
const app = express()
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectDB = require('./config/db')
const path = require('path');
const passport = require('passport');
const session = require('express-session');


//load config
dotenv.config({path: './config/config.env'})
connectDB()
//Passport config
require('./config/passport')(passport)

//Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
    })
)
app.set('view engine', '.hbs')

//sessions
app.use(session({
    secret:'keyboar cat',
    resave: false,
    saveUninitialized: false,
    // cookie : {secure: true}
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static foler
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/dashboard', require('./routes/index'))  //not necessary, router already know to look into index since the router connected it there












const PORT = process.env.PORT || 6000
app.listen(PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`)
)