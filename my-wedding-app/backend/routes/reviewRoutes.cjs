const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const fs = require('fs'); 
const path = require('path');
const Review = require('../models/Review.cjs'); 
const { protect, admin } = require('../middleware/authMiddleware.cjs'); 

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Path is relative to the backend folder
        cb(null, './uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false); 
    }
};

// 5MB file size limit
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } 
});

// Utility function to clean up the file if an error occurs later
const cleanupFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up temporary file: ${filePath}`);
        } catch (e) {
            console.error(`Error cleaning up file ${filePath}:`, e);
        }
    }
};

// @route POST /api/reviews
// @desc Submit a new review with optional image upload
// @access Private (Requires user login)
router.post('/', protect, upload.single('eventPhoto'), async (req, res) => {
    
    let photoPath = req.file ? req.file.path : null;
    
    try {
        const { service, rating, description, isSatisfied } = req.body;
        const userId = req.user.id;
        const userName = req.user.name;

        if (!service || !rating || !description || isSatisfied === undefined) {
            cleanupFile(photoPath); 
            return res.status(400).json({ message: 'Please complete all required fields.' });
        }

        let photoUrl = '';
        if (req.file) {
            photoUrl = photoPath.replace(/\\/g, '/');
        }

        const newReview = new Review({
            userId, 
            userName, 
            service, 
            rating: Number(rating), 
            description, 
            isSatisfied: isSatisfied === 'true', 
            photoUrl,
            isApproved: true // <--- NEW: Automatically set to true for instant display
        });

        await newReview.save();
        res.status(201).json({ message: 'Review submitted successfully! Now visible to all.', review: newReview });

    } catch (error) {
        cleanupFile(photoPath); 
        console.error('Error submitting review:', error);

        if (error instanceof multer.MulterError) {
             return res.status(400).json({ message: `File Upload Error: ${error.code}. Please ensure the image is under 5MB.` });
        }
        
        res.status(500).json({ message: 'Server error during review submission. Please check server logs.' });
    }
});

// --- Public Endpoints ---
// @route GET /api/reviews/public
// @desc Get all reviews for public display (No admin required, no filter)
// @access Public
router.get('/public', async (req, res) => {
    try {
        // FIX: Fetching ALL reviews. Filter is removed.
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching public reviews:', error);
        res.status(500).json({ message: 'Server error while fetching public data.' });
    }
});


// --- Admin Endpoints (Unused if approval is instant, but kept for full admin functionality) ---

// @route GET /api/reviews (Admin route)
// @desc Get ALL reviews (for admin dashboard, same as public endpoint now)
// @access Private (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ message: 'Server error while fetching reviews.' });
    }
});

// NOTE: This PUT route is now effectively redundant since reviews are auto-approved, 
// but it is kept in case you need to unapprove a review later.
// @route PUT /api/reviews/:id/approve (Admin route)
// @desc Update review approval status
// @access Private (Admin only)
router.put('/:id/approve', protect, admin, async (req, res) => {
    const { isApproved } = req.body;

    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { isApproved },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found.' });
        }
        res.json(updatedReview);
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ message: 'Server error during status update.' });
    }
});

module.exports = router;