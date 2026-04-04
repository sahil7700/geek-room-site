import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 overflow-hidden flex items-center justify-center">

      
      <div className="relative z-10 flex items-center justify-center w-full max-w-md mt-8">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-[#4F9EFF] hover:bg-[#4F9EFF]/90 text-black text-sm normal-case",
              card: "bg-[#050505]/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]",
              headerTitle: "text-white",
              headerSubtitle: "text-white/60",
              formFieldLabel: "text-white/80",
              formFieldInput: "bg-[#050505]/60 border-white/10 text-white placeholder:text-white/20 focus:border-[#4F9EFF]/50",
              footerActionLink: "text-[#4F9EFF] hover:text-[#4F9EFF]/80",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-[#4F9EFF]",
              socialButtonsBlockButton: "border-white/10 text-white hover:bg-white/5",
              socialButtonsBlockButtonText: "text-white",
              dividerLine: "bg-white/10",
              dividerText: "text-white/40"
            },
          }}
        />
      </div>
    </main>
  );
}
