import { HeroSection } from '@/components/hero';

export default function BookClubPage() {
    return (
      <>
        <HeroSection
          title="Bitcoin Book Club"
          description="If you’re interested in reading with us, register for one of our monthly book club events below.​"
          image="/images/hero/hero5.jpg"
          backgroundOverlay={true}
          variant="centered"
        >
        </HeroSection>
        <section className="container mx-auto py-8 px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          </div>
        </section>
      </>
    );
  }
  