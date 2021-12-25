const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db.js');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB(); 

// Route Files
const auth = require('./routes/auth');
const student = require('./routes/students');
const app = express();

app.use(express.json());

// Dev Logging Middeleware
if(process.env.NODE_ENV === 'developement') {
    app.use(morgan('dev'));
}

const server = app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello From Smit"
    });
});

// mount Routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/student', student);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);


// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close Server and Exit Process
    server.close(() => process.exit(1));
}) 