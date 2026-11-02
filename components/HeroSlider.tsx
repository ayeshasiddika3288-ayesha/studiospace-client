"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    image:
      "https://plus.unsplash.com/premium_photo-1682097066897-209d0d9e9ae5?w=1600&auto=format&fit=crop&q=80",
    title: "Find the Perfect Studio for Your Next Shoot",
    text: "Photo cyc walls, cinema stages, and creative spaces ready by the hour.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1664817550969-5e76adc4a3fe?w=1600&auto=format&fit=crop&q=80",
    title: "Record Your Podcast in a Pro-Grade Lounge",
    text: "Acoustic-treated rooms with mics, lighting, and comfortable seating.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1782274265689-4f10a91d4abb?w=1600&auto=format&fit=crop&q=80",
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
                <Link
                  href="/studios"
                  className="btn btn-outline text-white border-white hover:bg-white hover:text-black"
                >
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