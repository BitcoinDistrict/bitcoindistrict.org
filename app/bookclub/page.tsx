import { HeroSection } from '@/components/hero';
import { PageContent } from '@/components/page-content';

export default function BookClubPage() {
    return (
      <>
        <HeroSection
          title="Bitcoin Book Club"
          description="If you're interested in reading with us, register for one of our monthly book club events below.​"
          image="/images/hero/hero5.jpg"
          backgroundOverlay={true}
          variant="centered"
        >
        </HeroSection>
        <PageContent>
          <div className="gap-6">
            <h2> This is book club. </h2>
          </div>
        </PageContent>
      </>
    );
  }
  