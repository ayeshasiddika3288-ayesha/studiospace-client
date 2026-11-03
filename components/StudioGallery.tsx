"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function StudioGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const many = images.length > 1;
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation={many}
      pagination={many ? { clickable: true } : false}
      className="w-full h-72 sm:h-96 rounded-box"
    >
      {images.map((src, i) => (
        <SwiperSlide key={`${src}-${i}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${title} photo ${i + 1}`}
            className="h-full w-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}