"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    image: "PASTE_PHOTO_STUDIO_IMAGE_LINK",
    title: "Find the Perfect Studio for Your Next Shoot",
    text: "Photo cyc walls, cinema stages, and creative spaces ready by the hour.",
  },
  {
    image: "PASTE_PODCAST_IMAGE_LINK",
    title: "Record Your Podcast in a Pro-Grade Lounge",
    text: "Acoustic-treated rooms with mics, lighting, and comfortable seating.",
  },
  {
    image: "PASTE_MUSIC_STUDIO_IMAGE_LINK",
    title: "Turn Your Spare Space Into Income",
    text: "List your studio, set your hourly rate, and welcome creators near you.",
  },
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full h-[70vh] min-h-[420px]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.title}>
          <div
            className="relative h-full w-full bg-neutral bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-12 flex flex-col justify-center gap-4 text-white">
              <h1 className="text-3xl sm:text-5xl font-bold max-w-2xl">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg max-w-xl opacity-90">
                {slide.text}
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Link href="/studios" className="btn btn-primary">
                  Explore Studios
                </Link>
                <Link href="/studios" className="btn btn-outline text-white border-white hover:bg-white hover:text-black">
                  Host Your Space
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}