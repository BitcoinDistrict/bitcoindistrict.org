import { PageContent } from '@/components/page-content';
import ImageComponent from '@/components/ImageComponent';

export default function AboutPage() {
    return (
      <>
        <PageContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ImageComponent
              src="/images/roastery1.jpg"
              alt="Group photo at the Compass Coffee Roastery"
              width={600}
              height={400}
              border="thin"
              shadow="md"
              rounded="lg"
              objectFit="cover"
            />
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">About Bitcoin District</h2>
              <p className="text-lg text-muted-foreground">
                Bitcoin District is a network of Bitcoiners who live and work around the greater DC, Maryland and Virginia (DMV) metro area. More importantly, we're a group of people from all walks of life brought together by the common belief that Bitcoin can help make the world a better place.
              </p>
            </div>
          </div>
        </PageContent>
      </>
    );
  }