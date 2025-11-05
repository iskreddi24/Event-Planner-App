import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

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
  const [selectedPost, setSelectedPost] = useState(null);

  const blogPosts = [
    {
      title: "A Beautiful Wedding Celebration",
      image: couple,
      description:
        "A glimpse of our recent wedding event filled with love, joy, and unforgettable moments.",
    },
    {
      title: "Elegant Wedding Décor",
      image: decor,
      description:
        "Soft tones and floral elegance that transformed the venue into a dreamy paradise.",
    },
    {
      title: "Traditional Half Saree Function",
      image: tradition,
      description:
        "An elegant ceremony blending rich traditions with graceful modernity.",
    },
    {
      title: "Graceful Dance Performance",
      image: dance,
      description:
        "A mesmerizing classical performance that added beauty to the evening.",
    },
    {
      title: "Cherished Anniversary Party",
      image: celeb,
      description:
        "Heartwarming moments shared in a cozy, elegant anniversary setup.",
    },
    {
      title: "Romantic Anniversary Decor",
      image: cardev,
      description:
        "Soft lighting and floral accents created a truly magical ambiance.",
    },
    {
      title: "Grand Birthday Bash",
      image: party,
      description:
        "Fun, laughter, and vibrant colors brought everyone together in joy.",
    },
    {
      title: "Delicious Birthday Cake",
      image: cake,
      description:
        "A delightful cake cutting moment to celebrate life’s sweet moments.",
    },
  ];

  return (
    <div className="blog-page">
      <h1>✨ Event Moments & Stories</h1>
      <p>Discover memories from our beautifully organized celebrations.</p>

      <div className="blog-carousel-container">
        <Swiper
          slidesPerView={1}
          spaceBetween={15}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation, Autoplay]}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
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
                  <button
                    className="read-more-btn"
                    onClick={() => setSelectedPost(post)}
                  >
                    View Event
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal Popup */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button
              className="close-modal-btn"
              onClick={() => setSelectedPost(null)}
            >
              ✕
            </button>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="modal-image"
            />
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogComp;
