import HeroSection from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { PageContent } from "@/components/page-content";

export default async function Home() {
  return (
    <>
      <HeroSection
        title="Welcome to Bitcoin District"
        description="We provide top-notch solutions for your business"
        image="/images/hero/hero3.jpg"
        backgroundOverlay={true}
        variant="full-bleed"
      >
        <div className="flex gap-4 mt-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </HeroSection>
      <PageContent>
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </PageContent>
    </>
  );
}
