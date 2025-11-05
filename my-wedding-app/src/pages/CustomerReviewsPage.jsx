import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import axiosClient from "../utils/axiosClient";
import { FaStar, FaRegStar, FaCamera } from "react-icons/fa";
import "../styles/CustomerReviewsPage.css";

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return <div className="flex space-x-1 mb-2">{stars}</div>;
};
const ReviewCard = ({ review }) => (
    <div className="review-card bg-white p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl border-t-4 border-purple-500">
        {/* Stars */}
        <div className="mb-3">
            <StarRating rating={review.rating} />
        </div>

        {/* Review Text */}
        <p className="text-base font-medium text-gray-800 italic mb-3 leading-relaxed">
            “{review.description}”
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-3 border-t border-gray-100">
            <div>
                <p className="font-semibold text-purple-600">— {review.userName}</p>
                <p className="text-gray-500">Service: {review.service}</p>
            </div>
            {review.photoUrl && (
                <div className="review-photo-indicator" title="Customer photo uploaded">
                    <FaCamera size={18} className="text-purple-400" />
                </div>
            )}
        </div>

        {/* Status */}
        <small
            className={`text-xs mt-3 inline-block font-semibold tracking-wide ${
                review.isSatisfied ? 'text-green-600' : 'text-red-600'
            }`}
        >
            {review.isSatisfied ? 'Highly Satisfied' : 'Needs Improvement'}
        </small>
    </div>
);



function CustomerReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosClient.get("/reviews/public");
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to load customer reviews. Please check server connection.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    return (
        <div className="customer-reviews-container py-12 px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    See Our Customer Stories
                </h1>
                <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                    Real feedback from real events. Hear what people are saying about JUEYM Events.
                </p>
                <div className="mt-6">
                    <span className="text-2xl font-bold text-yellow-500">{averageRating} / 5 Stars</span>
                    <p className="text-gray-500">Based on {reviews.length} approved reviews</p>
                </div>
            </header>

            {loading && <p className="text-center text-lg text-purple-600">Loading reviews...</p>}
            {error && <p className="text-center text-lg text-red-600">{error}</p>}

            {!loading && reviews.length === 0 && !error && (
                <p className="text-center text-lg text-gray-500">No approved reviews to display yet. Be the first!</p>
            )}

            <div className="reviews-grid">
                {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                ))}
            </div>

            <div className="text-center mt-12">
                { }
                <Link to="/submit-review" className="review-cta-button">
                    Leave Your Own Review
                </Link>
            </div>
        </div>
    );
}

export default CustomerReviewsPage;