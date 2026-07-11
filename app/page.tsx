import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/layout/LandingPage";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("__session");

  if (hasSession) {
    redirect("/analyze");
  }

  return <LandingPage />;
}
