import { HeroSection } from '@/components/hero';
import { PageContent } from '@/components/page-content';

export default function AboutPage() {
    return (
      <>
        <HeroSection
          title="What is Bitcoin District?"
          description="Bitcoin District is a network of Bitcoiners who live and work around the greater DC, Maryland and Virginia (DMV) metro area. More importantly, we're a group of people from all walks of life brought together by the common belief that Bitcoin can help make the world a better place.​"
          image="/images/hero/hero-compass.jpg"
          backgroundOverlay={true}
          variant="centered"
        >
        </HeroSection>
        <PageContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h2> This is H2 text. </h2>
          </div>
        </PageContent>
      </>
    );
  }
