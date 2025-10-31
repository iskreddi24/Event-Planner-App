const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Configure dotenv immediately
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Note: useNewUrlParser and useUnifiedTopology are typically default and
            // not needed in Mongoose 6+, but kept for compatibility.
        });
        console.log('MongoDB Connected ✅');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

// Use module.exports for CommonJS export
module.exports = { connectDB };
