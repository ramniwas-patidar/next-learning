import SiteHeader from "@/components/SiteHeader";
import SignupForm from "@/components/SignupForm";

export const instant = false;

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col bg-[#F6F7F7] font-sans">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-16">
        <SignupForm />
      </main>
    </div>
  );
}
