
import React from 'react';

const About: React.FC<{ t: any }> = ({ t }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-7xl font-black mb-12 tracking-tighter text-center">{t.mission.split(' ')[0]}<br/>{t.mission.split(' ')[1] || ''}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-4 border-black pt-12">
        <div>
          <h2 className="text-2xl font-black mb-4 uppercase">{t.minimalism}</h2>
          <p className="text-gray-600 leading-relaxed mb-6 font-medium">
            {t.minimalism_desc}
          </p>
          <div className="bg-black text-white p-6">
            <h3 className="font-bold mb-2 italic">Minimal UI?</h3>
            <p className="text-sm opacity-80 font-medium">
              We believe information is most powerful when it's clear, high-contrast, and unambiguous. Black and white helps you focus on the algorithm notation.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-black mb-2 uppercase border-b-2 border-black inline-block">{t.persistence}</h2>
            <p className="text-sm text-gray-500 font-medium">
              {t.persistence_desc}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-2 uppercase border-b-2 border-black inline-block">{t.community}</h2>
            <p className="text-sm text-gray-500 font-medium">
              {t.community_desc}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-2 uppercase border-b-2 border-black inline-block">OPEN SOURCE</h2>
            <p className="text-sm text-gray-500 font-medium">
              CubeHub is for everyone. We support all mainstream cube types from 2x2 to Megaminx.
            </p>
          </section>
        </div>
      </div>
      
      <div className="mt-20 text-center">
        <p className="text-[10px] font-black tracking-[0.5em] text-gray-300">CUBEHUB V3.1 / 2025</p>
      </div>
    </div>
  );
};

export default About;
