import HeroSection from "@/components/Hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { PageContent } from "@/components/page-content";
import FeatureSection from "@/components/FeatureSection";

export default async function Home() {
  return (
    <>
      <HeroSection
        title="Welcome to Bitcoin District"
        description="Bitcoin District is a network of Bitcoiners living and working in the DC, Maryland & Virginia (DMV) area seeking to network, socialize & collaborate with other Bitcoiners."
        image="/images/hero/hero3.jpg"
        backgroundOverlay={true}
        variant="centered"
      >
      </HeroSection>
      <PageContent>
        <div>
          <FeatureSection title="Get Involved" limit={3} />
        </div>
      </PageContent>
    </>
  );
}
