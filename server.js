const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');

const routerAccess = require('./routes/Access');
const routerAdmin = require('./routes/Admin');
const routerShop = require('./routes/Shop');

const app = express();
const port = 3010;

// Middleware pour parser les donnees de requetes POST
app.use(express.json());

app.use(express.urlencoded({ extended: true }))

// Configuration du view engine ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, "public")));

// Connexion à MongoDB
const connectionMongo = async () => {
  try {
    const connect = await mongoose.connect('mongodb+srv://lucas:1234@cluster0.8jdd2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=Panier');
    console.log(`Connected to MongoDB: ${connect.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

connectionMongo();

app.use((req, res, next) => {
  res.locals.session = req.session;
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
})

app.get('/', async (req, res) => {
  res.redirect('/user/login');
});

app.use('/user', routerAccess);
app.use('/admin', routerAdmin);
app.use('/shop', routerShop);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
