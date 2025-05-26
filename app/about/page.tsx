import { HeroSection } from '@/components/hero';

export default function AboutPage() {
    return (
      <>
      <HeroSection
      title="What is Bitcoin District?"
      description="Bitcoin District is a network of Bitcoiners who live and work around the greater DC, Maryland and Virginia (DMV) metro area. More importantly, we’re a group of people from all walks of life brought together by the common belief that Bitcoin can help make the world a better place.​"
      image="/images/hero/hero-compass.jpg"
      backgroundOverlay={true}
      variant="centered"
    >
    </HeroSection>
    <main className="flex-1 flex flex-col gap-6 px-4 max-w-5xl mx-auto w-full">
      <h2 className="font-medium text-xl mb-4">A little bit about us...</h2>
    </main>

    </>
    );
  }
