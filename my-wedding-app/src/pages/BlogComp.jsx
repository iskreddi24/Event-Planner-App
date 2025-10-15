
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import "../styles/Blog.css"; 
import cardev from "../anniversaryimages/cardev.png";
import celeb from "../anniversaryimages/celeb.png";

import cake from "../birthdayimg/cake.png";
import party from "../birthdayimg/party.png";

import dance from "../halfsareeimg/dance.png";
import tradition from "../halfsareeimg/tradition.png";

import couple from "../weddingimg/couple.png";
import decor from "../weddingimg/decor.png";


function BlogComp() {
    const blogPosts = [
        { title: "A Beautiful Wedding Celebration", image: couple, description: "A glimpse of our recent wedding event filled with love, joy, and unforgettable moments." },
        { title: "Elegant Wedding Décor", image: decor, description: "Stunning decorations that created a dreamy wedding atmosphere." },
        { title: "Traditional Half Saree Function", image: tradition, description: "An elegant half saree ceremony with traditional vibes and modern celebrations." },
        { title: "Graceful Dance Performance", image: dance, description: "Beautiful cultural dance performance during the half saree function." },
        { title: "Cherished Anniversary Party", image: celeb, description: "Capturing memories from a joyful anniversary function with family and friends." },
        { title: "Romantic Anniversary Decor", image: cardev, description: "Special decorations that made the evening unforgettable." },
        { title: "Grand Birthday Bash", image: party, description: "Fun-filled birthday celebration with laughter, decorations, and smiles all around." },
        { title: "Delicious Birthday Cake", image: cake, description: "A delightful cake cutting moment that brought joy to everyone." }
    ];

    return (
        <div className="blog-page">
            <h1>Our Event Gallery & Blog</h1>
            <p>Catch up on some of our beautiful events and celebrations we have organized.</p>
            
            <div className="blog-carousel-container">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Pagination, Navigation, Autoplay]}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                    }}
                    className="blogSwiper"
                >
                    {blogPosts.map((post, index) => (
                        <SwiperSlide key={index}>
                            <div className="blog-card">
                                <img src={post.image} alt={post.title} />
                                <div className="card-content">
                                    <h2>{post.title}</h2>
                                    <p>{post.description}</p>
                                    <button className="read-more-btn">View Event</button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default BlogComp;