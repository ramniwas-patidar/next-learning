import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import AccountView from "@/components/AccountView";
import { getCurrentUser } from "@/lib/session";

export const instant = false;

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F6F7F7] font-sans">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-16">
        <AccountView user={user} />
      </main>
    </div>
  );
}
