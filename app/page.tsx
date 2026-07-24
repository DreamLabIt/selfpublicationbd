// import { Suspense } from "react";
// import HeroSlider from "@/components/site/HeroSlider";
// import FeaturedBooks from "@/components/site/FeaturedBooks";
// import { fetchData } from "@/lib/query";
// import { HeroSliderItem } from "@/types";
// import EbookCollection from "@/components/site/EbookCollection";
// import McqCollection from "@/components/site/McqCollection";
// import WinnersSection from "@/components/site/WinnersSection";
// import BlogSection from "@/components/site/BlogSection";

// export default async function Home() {
//   const slides = await fetchData<HeroSliderItem[]>({
//     endpoint: "hero-sliders",
//     revalidate: 600,
//     tags: ["hero-sliders"],
//   });

//   return (
//     <main className="min-h-screen">
//       <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading slider...</div>}>
//         {slides && slides.length > 0 ? (
//           <HeroSlider slides={slides} />
//         ) : (
//           <div className="h-96 flex items-center justify-center">No slider data available...</div>
//         )}
//       </Suspense>

//       <Suspense fallback={<div className="text-center py-10">Loading featured books...</div>}>
//         <FeaturedBooks />
//       </Suspense>

//       <Suspense fallback={<div className="text-center py-10">Loading MCQ books...</div>}>
//         <McqCollection />
//       </Suspense>

//       <Suspense fallback={<div className="text-center py-10">Loading ebooks...</div>}>
//         <EbookCollection />
//       </Suspense>

//       <Suspense fallback={<div className="text-center py-10">Loading winners...</div>}>
//         <WinnersSection />
//       </Suspense>
//       <Suspense fallback={<div className="text-center py-10">Loading Blog...</div>}>
//         <BlogSection />
//       </Suspense>
//     </main>
//   );
// }



// import { Suspense } from "react";
// import HeroSlider from "@/components/site/HeroSlider";
// import FeaturedBooks from "@/components/site/FeaturedBooks";
// import { fetchData } from "@/lib/query";
// import { HeroSliderItem } from "@/types";
// import EbookCollection from "@/components/site/EbookCollection";
// import McqCollection from "@/components/site/McqCollection";
// import WinnersSection from "@/components/site/WinnersSection";
// import BlogSection from "@/components/site/BlogSection";

export default async function Home() {
  return (
    <main className="min-h-screen">
      Home
    </main>
  );
}



