const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// --- 1. LOAD ENVIRONMENT VARIABLES (from backend/.env) ---
dotenv.config({ path: path.resolve(__dirname, '.env') });

// --- 2. SAFELY FETCH MONGO URI ---
const getMongoUri = () => {
    if (process.env.MONGODB_CONNECTION_URI) {
        console.log("DEBUG: Loaded MONGODB_CONNECTION_URI directly from process.env");
        return process.env.MONGODB_CONNECTION_URI;
    }

    try {
        const envPath = path.resolve(__dirname, '.env');
        const envFileContent = fs.readFileSync(envPath, 'utf8').trim();
        const mongoUriRegex = /^MONGODB_CONNECTION_URI\s*=\s*(["']?)([^"'\r\n]+)\1/m;
        const match = envFileContent.match(mongoUriRegex);
        if (match && match[2]) {
            console.log("DEBUG: Loaded MONGO_URI via manual .env parsing.");
            return match[2].trim();
        }
    } catch (e) {
        console.error("FATAL: Error reading .env file:", e.message);
    }

    return undefined;
};

const MONGO_URI = getMongoUri();

// --- 3. EXPRESS APP SETUP ---
const app = express();
app.use(cors());
app.use(express.json());

// --- 4. DATABASE CONNECTION ---
if (!MONGO_URI) {
    console.log(`DEBUG CHECK: MONGO_URI = [${MONGO_URI}]`);
    console.error("MongoDB connection error: MONGO_URI is undefined after all attempts.");
    process.exit(1);
}

console.log(`DEBUG: Attempting Mongoose connection with URI length: ${MONGO_URI.length}`);

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// --- 5. ROUTES IMPORT ---
const authRoutes = require('./routes/authRoutes.cjs');
const contactRoutes = require('./routes/contactRoutes.cjs');
const exclusiveServiceRoutes = require('./routes/exclusiveServiceRoutes.cjs');
const decorationServiceRoute = require('./routes/decorationServiceRoute.cjs');
const queryRoutes = require('./routes/queryRoutes.cjs');
const photographyRoutes = require('./routes/photographyRoutes.cjs');
const reviewRoutes = require('./routes/reviewRoutes.cjs');

// 🔑 CRITICAL IMPORTS FOR OWNER/BOOKING:
// ownerRoutes handles /signup, /login, /hall/:id
const ownerRoutes = require('./routes/ownerRoutes.cjs'); 
// bookingRoutes handles /halls, /availability, /create, /confirm
const bookingRoutes = require('./routes/bookingRoutes.cjs');

// --- 6. ROUTE DEFINITIONS ---
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/exclusive', exclusiveServiceRoutes);
app.use('/api/decoration', decorationServiceRoute);
app.use('/api/queries', queryRoutes);
app.use('/api/photography', photographyRoutes);
app.use('/api/reviews', reviewRoutes);

// 🔑 CRITICAL FIX: Owner routes mounted at /api/owner
// This handles requests like POST /api/owner/signup correctly.
app.use('/api/owner', ownerRoutes); 

// Booking routes mounted at /api/booking
// This handles requests like GET /api/booking/halls correctly.
app.use('/api/booking', bookingRoutes); 


// --- 7. BASIC ROUTES ---
app.get('/', (req, res) => {
    res.send('🎉 JUEYM Wedding App Backend is running!');
});

// --- 8. 404 HANDLER ---
app.use((req, res) => {
    res.status(404).send('<h1>404: Route Not Found</h1>');
});

// --- 9. SERVER START ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
