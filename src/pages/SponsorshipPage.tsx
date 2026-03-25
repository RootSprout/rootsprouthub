import React from 'react';

const SponsorshipPage = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-6">Rootsprout <span className="text-gradient-gold">Sponsorship</span></h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Support Rootsprout and help accelerate systems education, community events, and open-source growth.
          </p>
        </div>

        <div className="glass border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs text-gold font-bold uppercase tracking-widest">Sponsorship Form</div>
              <div className="text-2xl font-bold mt-2">Support Rootsprout</div>
            </div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScxFDu-jxxNVz4DlDkYhsJIh9BA1-8tmJdz1JIsBPIui1OKwg/viewform?usp=publish-editor"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-gold hover:text-black-deep hover:border-gold transition-all"
            >
              Open in New Tab
            </a>
          </div>
          <div className="bg-black-soft/60">
            <div className="w-full aspect-[4/5] md:aspect-[16/10]">
              <iframe
                title="Rootsprout Sponsorship Form"
                src="https://docs.google.com/forms/d/e/1FAIpQLScxFDu-jxxNVz4DlDkYhsJIh9BA1-8tmJdz1JIsBPIui1OKwg/viewform?usp=publish-editor"
                className="w-full h-full"
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipPage;
