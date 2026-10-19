import HeroBanner from "@/components/HeroBanner";
import FeaturedLessons from "@/components/FeaturedLessons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner / Slider */}
      <HeroBanner />

      {/* 2. Featured Life Lessons Section (Dynamic) */}
      <FeaturedLessons />
    </div>
  );
}
