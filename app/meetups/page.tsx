import { HeroSection } from '@/components/hero';
import { MeetupCard, Meetup } from '@/components/MeetupCard';
import { meetups } from '@/data/meetups';

export default function MeetupPage() {
    return (
      <>
        <HeroSection
          title="Bitcoin Community Meetups"
          description="These are the Bitcoin meetups in the DC, Maryland & Virginia greater metro area. Let us know if we're missing any.​"
          image="/images/hero/hero4.jpg"
          backgroundOverlay={true}
          variant="centered"
        >
        </HeroSection>
        <section className="container mx-auto py-8 px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetups.map((meetup: Meetup) => (
              <MeetupCard key={meetup.id} meetup={meetup} />
            ))}
          </div>
        </section>
      </>
    );
  }
  