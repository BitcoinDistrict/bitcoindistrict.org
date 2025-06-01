import { HeroSection } from '@/components/Hero';
import { PageContent } from '@/components/PageContent';
import MainSection from '@/components/MainSection';

export default function BookClubPage() {
  const sections = [
    {
      title: "Bitcoin Book Club",
      subtitle: "We Meet Every Month!",
      description: "If you’re interested in reading with us, register for one of our monthly book club events below.",
      className: "bg-transparent",
      useCard: false,
    }
  ];

  return (
      <>
        <PageContent>
          <div>
            <MainSection layout="single" sections={sections} />
          </div>
        </PageContent>
      </>
    );
  }
  