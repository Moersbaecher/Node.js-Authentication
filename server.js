// modules
const express =  require('express');
const sequelize = require('sequelize');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./Models/index');
const userRoutes = require ('./Routes/userRoutes');

//port
const PORT = process.env.PORT || 3000;

//
const app = express();


//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

//synchronizing
db.sequelize.sync({ force: true }).then(() => {
    console.log("db has been sync")
})

app.get('/', (req, res) => {
    res.render('login')
});

app.get('/signup', (req, res) => {
    res.render('signup')
});

app.get('/home', (req, res) => {
    res.render('home')
});
    
//API routes
app.use('/api/users', userRoutes);

//listening to server
app.listen(PORT, () => console.log(`Server is connected on: ${PORT}`));
