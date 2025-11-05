import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/SwiperSection.css";

const SwiperSection = () => {
  const featuredItems = [
    {
      id: 1,
      name: "Wedding Decoration Kit",
      desc: "Premium décor package for grand weddings",
      img: "/images/decor1.jpg",
    },
    {
      id: 2,
      name: "Artificial Ornaments",
      desc: "Gorgeous ornaments for traditional looks",
      img: "/images/ornaments.jpg",
    },
    {
      id: 3,
      name: "Makeup Kit Pro",
      desc: "Professional bridal makeup essentials",
      img: "/images/makeup.jpg",
    },
    {
      id: 4,
      name: "Birthday Party Props",
      desc: "Theme props for all birthday celebrations",
      img: "/images/birthday.jpg",
    },
    {
      id: 5,
      name: "Lighting & Ambience",
      desc: "Beautiful lighting sets for events",
      img: "/images/lights.jpg",
    },
  ];

  return (
    <div className="swiper-section">
      <h2>✨ Featured Event Essentials</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {featuredItems.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="swiper-slide">
              <img src={item.img} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperSection;
