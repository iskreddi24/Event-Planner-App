// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();

// app.use(express.json());

// const PORT = process.env.PORT || 8080;

// const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             console.error('CORS blocked for origin:', origin);
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));

// mongoose.set('strictQuery', true);
// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDBs connected successfully!'))
//     .catch((err) => console.error('MongoDB connection error:', err));

// const authRoutes = require('./routes/authRoutes.cjs');
// const contactRoutes = require('./routes/contactRoutes.cjs');

// app.use('/api/auth', authRoutes);
// app.use('/api/contact', contactRoutes);

// app.get('/', (req, res) => {
//     res.send('Event Planner Backend is running!');
// });

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', allowedOrigins[0]);
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
//     res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(204);
//     }
//     next();
// });

// app.use((err, req, res, next) => {
//     console.error('Global Error:', err.stack || err);
//     if (process.env.NODE_ENV === 'development') {
//         res.status(500).json({
//             message: 'Server error occurred.',
//             error: err.message,
//             stack: err.stack
//         });
//     } else {
//         res.status(500).json({ message: 'Server error occurred.' });
//     }
// });
// app.get('/api/contact/test', (req, res) => {
//     res.json({ message: 'Contact routes are working!' });
// });
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

const PORT = process.env.PORT || 8080;

// ✅ Allowed CORS Origins
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error('CORS blocked for origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

const authRoutes = require('./routes/authRoutes.cjs');
const contactRoutes = require('./routes/contactRoutes.cjs');
const exclusiveServiceRoutes = require('./routes/exclusiveServiceRoutes.cjs'); // 👈 Added new route

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/exclusive', exclusiveServiceRoutes); // 👈 Added route endpoint
const decorationServiceRoute = require("./routes/decorationServiceRoute.cjs");
app.use("/api/decoration", decorationServiceRoute);

app.get('/', (req, res) => {
    res.send('🎉 Event Planner Backend is running with Exclusive Services!');
});

app.get('/api/contact/test', (req, res) => {
    res.json({ message: 'Contact routes are working!' });
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowedOrigins[0]);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.use((err, req, res, next) => {
    console.error('Global Error:', err.stack || err);
    if (process.env.NODE_ENV === 'development') {
        res.status(500).json({
            message: 'Server error occurred.',
            error: err.message,
            stack: err.stack
        });
    } else {
        res.status(500).json({ message: 'Server error occurred.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
