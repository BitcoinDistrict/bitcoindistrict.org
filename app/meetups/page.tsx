import { MeetupCard, Meetup } from '@/components/MeetupCard';
import { meetups } from '@/data/meetups';
import { PageContent } from '@/components/PageContent';
import MainSection from '@/components/MainSection';


export default function MeetupPage() {
  const sections = [
    {
      title: "Bitcoin District Meetups",
      description: "These are the Bitcoin meetups in the DC, Maryland & Virginia greater metro area. Let us know if we’re missing any.",
      className: "bg-transparent text-center",
      useCard: false,
    }
  ];
    return (
      <>
        <PageContent>
        <div>
            <MainSection layout="single" sections={sections} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetups.map((meetup: Meetup) => (
              <MeetupCard key={meetup.id} meetup={meetup} />
            ))}
          </div>
        </PageContent>
      </>
    );
  }
  