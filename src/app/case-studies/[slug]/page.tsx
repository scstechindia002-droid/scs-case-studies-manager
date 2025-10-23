// Updated Case Study Detail Page - src/app/case-studies/[slug]/page.tsx
'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import caseStudiesData from '@/data/caseStudies.json';

interface ScopeItem {
  title: string;
  description: string;
  subItems?: string[];
}

interface CaseStudy {
  slug: string;
  title: string;
  description: string;
  image: string;
  location: string;
  client: string;
  projectObjective: string;
  projectOverview: string[];
  keyScopeOfWork: ScopeItem[];
  impact: string[];
}

export default function CaseStudyPage() {
  const params = useParams();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const study = caseStudiesData.find((study: CaseStudy) => study.slug === params.slug);
    setCaseStudy(study || null);
    setLoading(false);

    // ✅ Disable right-click
  const handleRightClick = (e: MouseEvent) => e.preventDefault();
  document.addEventListener('contextmenu', handleRightClick);

  // ✅ Disable Ctrl+C, Ctrl+U, F12, etc.
  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      (e.ctrlKey && ['c', 'u', 's'].includes(e.key.toLowerCase())) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  // ✅ Disable text selection
  document.body.style.userSelect = 'none';

  // Cleanup on unmount
  return () => {
    document.removeEventListener('contextmenu', handleRightClick);
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.userSelect = 'auto';
  };


  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-[#1a2332] text-white">
        <Navbar showBackButton={true} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
            <p className="text-gray-400">The requested case study could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2332] text-white">
      {/* Navbar with back button */}
      <Navbar showBackButton={true} />

      {/* Hero Section */}
      <div className="relative h-[60vh] lg:h-[70vh]">
        <Image
          src={caseStudy.image}
          alt={caseStudy.title}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=500&fit=crop&crop=center`;
          }}
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12 w-full">
            {/* Location and Client */}
            <div className="mb-4 text-gray-300 text-sm lg:text-base">
              <div className="mb-1">{caseStudy.location}</div>
            </div>
            
            {/* Title */}
            <h1 
              className="text-2xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight max-w-5xl"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {caseStudy.title}
            </h1>
            
            {/* Client info */}
            <div className="text-gray-300 text-sm lg:text-base bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              <span className="text-[#EE2B2C] font-semibold">Client:</span> {caseStudy.client}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Project Objective */}
        <section className="mb-10 lg:mb-16">
          <h2 
            className="text-xl lg:text-2xl font-bold text-[#EE2B2C] mb-4 lg:mb-6 uppercase tracking-wide"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            PROJECT OBJECTIVE
          </h2>
          <p 
            className="text-gray-300 leading-relaxed text-base lg:text-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {caseStudy.projectObjective}
          </p>
        </section>

        {/* Project Overview */}
        <section className="mb-10 lg:mb-16">
          <h2 
            className="text-xl lg:text-2xl font-bold text-[#EE2B2C] mb-4 lg:mb-6 uppercase tracking-wide"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            PROJECT OVERVIEW
          </h2>
          <div className="space-y-4 lg:space-y-6">
            {caseStudy.projectOverview.map((paragraph, index) => (
              <p 
                key={index}
                className="text-gray-300 leading-relaxed text-base lg:text-lg"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Key Scope of Work Executed */}
        <section className="mb-10 lg:mb-16">
          <h2 
            className="text-xl lg:text-2xl font-bold text-[#EE2B2C] mb-6 lg:mb-8 uppercase tracking-wide"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            KEY SCOPE OF WORK EXECUTED
          </h2>
          <div className="space-y-6 lg:space-y-8">
            {caseStudy.keyScopeOfWork.map((item, index) => (
              <div key={index} className="border-l-3 border-[#EE2B2C] pl-6 lg:pl-8">
                <h3 
                  className="text-lg lg:text-xl font-semibold text-[#EE2B2C] mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {index + 1}. {item.title}
                </h3>
                <p 
                  className="text-gray-300 leading-relaxed text-base lg:text-lg mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {item.description}
                </p>
                {item.subItems && (
                  <ul className="space-y-2 ml-4">
                    {item.subItems.map((subItem, subIndex) => (
                      <li 
                        key={subIndex}
                        className="flex items-start gap-3 text-gray-400"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        <span className="text-[#EE2B2C] mt-1.5 text-sm">•</span>
                        <span className="text-sm lg:text-base">{subItem}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Impact */}
        <section className="mb-10 lg:mb-16">
          <h2 
            className="text-xl lg:text-2xl font-bold text-[#EE2B2C] mb-6 lg:mb-8 uppercase tracking-wide"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            IMPACT
          </h2>
          <div className="bg-gradient-to-r from-gray-800/20 to-gray-900/20 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 lg:p-8">
            <p 
              className="text-gray-300 mb-6 text-base lg:text-lg leading-relaxed"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              The implementation of the {caseStudy.title} has significantly <strong className="text-white">enhanced the security posture and operational efficiency</strong> of the facility. Key outcomes include:
            </p>
            <ul className="space-y-3 lg:space-y-4">
              {caseStudy.impact.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 text-gray-300"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <span className="text-[#EE2B2C] mt-1.5 text-lg">•</span>
                  <span className="text-base lg:text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing Statement */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-[#EE2B2C]/10 to-[#ff4444]/10 border border-[#EE2B2C]/20 rounded-2xl p-6 lg:p-8">
            <p 
              className="text-gray-300 text-base lg:text-lg leading-relaxed italic"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              By implementing cutting-edge technology solutions, SCS Tech has successfully delivered a transformative system that ensures operational excellence, enhanced security, and improved efficiency for critical infrastructure management.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}