import HeroSection from "@/components/Hero";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { PageContent } from "@/components/PageContent";
import FeatureSection from "@/components/FeatureSection";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

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
