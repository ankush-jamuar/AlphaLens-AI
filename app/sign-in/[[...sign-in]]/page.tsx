import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-1 backdrop-blur-md al-glass shadow-2xl flex justify-center py-8">
        <SignIn 
          appearance={{
            variables: {
              colorPrimary: "#10b981",
              colorBackground: "#09090b",
              colorInputBackground: "#09090b",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "#a1a1aa",
            },
            elements: {
              card: "bg-transparent shadow-none border-none",
              headerTitle: "text-white font-black text-lg",
              headerSubtitle: "text-zinc-400 text-xs",
              socialButtonsBlockButton: "bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-white text-xs font-bold py-2.5",
              socialButtonsBlockButtonText: "text-white font-bold",
              formButtonPrimary: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs py-2.5 shadow-emerald-500/10 hover:shadow-emerald-400/20 active:scale-98 transition-all",
              footerActionText: "text-zinc-400 text-xs",
              footerActionLink: "text-emerald-400 hover:text-emerald-300 font-bold",
              formFieldInput: "bg-zinc-900 border-white/10 text-white text-xs",
              formFieldLabel: "text-zinc-400 text-[10px] uppercase font-bold",
            }
          }}
        />
      </div>
    </div>
  );
}
