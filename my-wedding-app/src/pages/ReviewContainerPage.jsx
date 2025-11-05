import React from "react";
import ReviewFormPage from "./ReviewFormPage"; 
import CustomerReviewsPage from "./CustomerReviewsPage"; 
import "../styles/ReviewContainerPage.css"; 

function ReviewContainerPage() {
    return (
        <div className="review-container-page">
            
            {/* 1. Review Submission Form (Uses internal spacing and centering) */}
            <ReviewFormPage />

            {/* Separator / Divider - This replaces the redundant header shown in the screenshot */}
            <div className="reviews-section-divider text-center">
                <h2 className="text-3xl font-bold text-gray-800">See All Customer Reviews</h2>
                <p className="text-gray-500 mt-2">See real event feedback from other JUEYM users below.</p>
            </div>
            
            {/* 2. Customer Reviews Display (Full-width content) */}
            <CustomerReviewsPage />
        </div>
    );
}

export default ReviewContainerPage;