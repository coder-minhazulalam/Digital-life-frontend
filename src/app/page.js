import HeroBanner from "@/components/HeroBanner";
import FeaturedLessons from "@/components/FeaturedLessons";
import WhyLearningMatters from "@/components/WhyLearningMatters";
import TopContributors from "@/components/TopContributors";
import MostSavedLessons from "@/components/MostSavedLessons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner / Slider */}
      <HeroBanner />

      {/* 2. Featured Life Lessons Section (Dynamic) */}
      <FeaturedLessons />

      {/* 3. Why Learning From Life Matters (Static) */}
      <WhyLearningMatters />

      {/* 4. Top Contributors of the Week (Dynamic) */}
      <TopContributors />

      {/* 5. Most Saved Lessons (Dynamic) */}
      <MostSavedLessons />
    </div>
  );
}
