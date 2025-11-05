import React, { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";
import Rating from "../rating/Rating";
import { FaRegSmile, FaRegFrown } from "react-icons/fa";
import "../styles/ReviewFormPage.css";

function ReviewFormPage() {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const [formData, setFormData] = useState({
        service: 'General',
        rating: 5,
        description: '',
        isSatisfied: true,
    });
    // New state to hold the file object
    const [eventPhoto, setEventPhoto] = useState(null); 

    useEffect(() => {
        if (!isAuthenticated) {
            setStatusMessage("Please log in to leave a review.");
        }
    }, [isAuthenticated]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            setEventPhoto(files[0]); 
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleRatingChange = (newRating) => {
        setFormData(prev => ({ ...prev, rating: newRating }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setStatusMessage("You must be logged in to submit a review.");
            return;
        }

        setLoading(true);
        setStatusMessage('');

        try {
            const data = new FormData();
            
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            
            if (eventPhoto) {
                data.append('eventPhoto', eventPhoto); 
            }

            await axiosClient.post("/reviews", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setStatusMessage("✅ Review submitted successfully! Thank you for your feedback.");

            // Reset form states
            setFormData({
                service: 'General',
                rating: 5,
                description: '',
                isSatisfied: true,
            });
            setEventPhoto(null);
            document.getElementById('eventPhoto').value = null; 

        } catch (err) {
            console.error("Submission error:", err.response || err);
            const msg = err.response?.data?.message || "Failed to submit review. Check fields or ensure file size is acceptable.";
            setStatusMessage(` ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-form-page p-6 max-w-2xl mx-auto bg-white shadow-xl rounded-xl my-10">
            <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">Share Your Event Experience</h1>
            <p className="text-center text-gray-600 mb-8">Your feedback helps us create better memories for everyone.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Service Type */}
                <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700">Which service are you reviewing? *</label>
                    <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                        required
                    >
                        <option value="General">General Experience</option>
                        <option value="Exclusive Services">Exclusive Services (Makeup/Jewelry)</option>
                        <option value="Decoration Services">Decoration Services</option>
                        <option value="Photography Service">Photography & Video Service</option>
                    </select>
                </div>

                {/* 2. Overall Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating *</label>
                    <Rating value={formData.rating} onChange={handleRatingChange} max={5} />
                    <p className="text-xs text-gray-500 mt-2">Current rating: {formData.rating} stars</p>
                </div>

                {/* 3. Satisfaction */}
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Satisfaction: *</span>
                    <label className={`flex items-center p-2 rounded-full cursor-pointer transition-colors ${formData.isSatisfied ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                        <input
                            type="radio"
                            name="isSatisfied"
                            value={true}
                            checked={formData.isSatisfied === true}
                            onChange={() => setFormData(prev => ({ ...prev, isSatisfied: true }))}
                            className="hidden"
                        />
                        <FaRegSmile className="text-green-500 mr-2" size={20} />
                        <span className="text-sm font-semibold text-green-700">Satisfied</span>
                    </label>

                    <label className={`flex items-center p-2 rounded-full cursor-pointer transition-colors ${formData.isSatisfied === false ? 'bg-red-100 border-2 border-red-500' : 'bg-gray-100'}`}>
                        <input
                            type="radio"
                            name="isSatisfied"
                            value={false}
                            checked={formData.isSatisfied === false}
                            onChange={() => setFormData(prev => ({ ...prev, isSatisfied: false }))}
                            className="hidden"
                        />
                        <FaRegFrown className="text-red-500 mr-2" size={20} />
                        <span className="text-sm font-semibold text-red-700">Not Satisfied</span>
                    </label>
                </div>


                {/* 4. Detailed Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Tell us about your experience (max 500 characters) *</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={500}
                        placeholder="What did you love? Any suggestions for improvement?"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                        required
                    ></textarea>
                    <p className="text-xs text-right text-gray-500">{formData.description.length}/500</p>
                </div>

                {/* 5. Photo Upload */}
                <div>
                    <label htmlFor="eventPhoto" className="block text-sm font-medium text-gray-700">Upload Event Photo (Optional)</label>
                    <input
                        type="file"
                        id="eventPhoto"
                        name="eventPhoto"
                        accept="image/*"
                        onChange={handleChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                     {eventPhoto && <p className="text-xs text-gray-500 mt-1">File selected: {eventPhoto.name}</p>}
                </div>

                {/* Status Message */}
                {statusMessage && (
                    <p className={`text-center font-semibold p-3 rounded-lg ${statusMessage.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {statusMessage}
                    </p>
                )}

                {/* Submission Button */}
                <button
                    type="submit"
                    disabled={loading || !isAuthenticated}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}

export default ReviewFormPage;