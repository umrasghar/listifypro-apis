const express = require('express');
const connectDB = require('./config/db');

const cors = require('cors');
const app = express();

connectDB();

app.use(cors());

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true })); 


const path = require('path');

app.get('/', (req, res) => res.send('API Running'));

// Routes
const propertyRoutes = require('./routes/api/properties');
const imageRoutes = require('./routes/api/images');
const reviewRoutes = require('./routes/api/reviews');

app.use('/api/properties', propertyRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/reviews', reviewRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

