"use client";

import { useState } from "react";
import { submitTicket } from "@/app/actions/ticketActions";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(event.currentTarget);
    const result = await submitTicket(formData);

    if (result.success) {
      setSuccess(true);
      (event.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(result.error || "Something went wrong.");
    }
    
    setIsSubmitting(false);
  }

  return (
    <main className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 overflow-hidden flex items-center justify-center">

      
      <div className="relative z-10 w-full max-w-3xl mx-auto rounded-3xl border border-white/10 bg-[#050505]/40 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#4F9EFF] to-white pb-2 mb-4" style={{ fontFamily: "var(--font-akira), sans-serif" }}>
            RAISE A <span className="text-[#4F9EFF]">TICKET</span>
          </h1>
          <p className="text-[#ededed]/70 text-lg max-w-xl mx-auto" style={{ fontFamily: "var(--font-comfortaa), sans-serif", fontWeight: 300 }}>
            Report issues, suggest features, or ask questions securely. Our system will log your inquiry immediately.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="w-20 h-20 bg-[#4F9EFF]/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#4F9EFF]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Transmission Successful</h2>
            <p className="text-[#ededed]/70 text-center max-w-sm">
              Your ticket has been securely logged in our systems. We will review it shortly.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-6 px-6 py-3 border border-[#4F9EFF]/50 text-[#4F9EFF] rounded-xl hover:bg-[#4F9EFF]/10 transition-colors"
            >
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-[#4F9EFF] uppercase tracking-widest mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="YOUR.NAME"
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-5 py-4 text-[#ededed] placeholder-white/20 focus:outline-none focus:border-[#4F9EFF]/50 focus:ring-1 focus:ring-[#4F9EFF]/50 transition-all text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#4F9EFF] uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="YOUR.EMAIL@DOMAIN.COM"
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-5 py-4 text-[#ededed] placeholder-white/20 focus:outline-none focus:border-[#4F9EFF]/50 focus:ring-1 focus:ring-[#4F9EFF]/50 transition-all text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#FF8C00] uppercase tracking-widest mb-2">Protocol Type</label>
              <select 
                name="issueType" 
                required
                defaultValue=""
                className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-5 py-4 text-[#ededed] focus:outline-none focus:border-[#FF8C00]/50 focus:ring-1 focus:ring-[#FF8C00]/50 transition-all text-sm font-mono appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ededed\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
              >
                <option value="" disabled className="bg-[#050505] text-white/50">SELECT TICKET CLASSIFICATION</option>
                <option value="Research" className="bg-[#050505]">RESEARCH</option>
                <option value="Project" className="bg-[#050505]">PROJECT</option>
                <option value="Internships" className="bg-[#050505]">INTERNSHIPS</option>
                <option value="Jobs" className="bg-[#050505]">JOBS</option>
                <option value="Hackathons" className="bg-[#050505]">HACKATHONS</option>
                <option value="Personal" className="bg-[#050505]">PERSONAL</option>
                <option value="Professional" className="bg-[#050505]">PROFESSIONAL</option>
                <option value="Sponsors" className="bg-[#050505]">SPONSORS</option>
                <option value="Others" className="bg-[#050505]">OTHERS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/70 uppercase tracking-widest mb-2">Query</label>
              <textarea
                name="message"
                required
                placeholder="DESCRIBE YOUR REQUEST OR ISSUE IN DETAIL..."
                rows={5}
                className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-5 py-4 text-[#ededed] placeholder-white/20 focus:outline-none focus:border-[#4F9EFF]/50 focus:ring-1 focus:ring-[#4F9EFF]/50 transition-all text-sm font-mono resize-none"
              />
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm font-mono text-center">
                ERROR: {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-[#4F9EFF] rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              style={{ fontFamily: "var(--font-akira), sans-serif" }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out disabled:hidden" />
              <span className="relative flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    SUBMIT TICKET
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
