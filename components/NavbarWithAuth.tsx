import { createClient } from "@/utils/supabase/server";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import NavbarComponent from "./Navbar";

export default async function NavbarWithAuth() {
  // If environment variables are not set, show warning
  if (!hasEnvVars) {
    return (
      <NavbarComponent user={null} />
    );
  }

  // Fetch user data from Supabase
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <NavbarComponent user={user} />;
} 