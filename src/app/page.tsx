// src/app/page.tsx (Updated Landing Page)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Import your case studies data
import caseStudiesData from '@/data/caseStudies.json';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});
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

export default function HomePage() {

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load case studies data
    setCaseStudies(caseStudiesData);
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

  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2332] text-white">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <div className="text-center mb-12 lg:mb-16">
          {/* <h1 
            className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(135deg, #fff, #e2e8f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Our Case Studies
          </h1> */}
          {/* <p 
            className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Discover how we've transformed businesses and organizations through innovative technology solutions
          </p> */}
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-8 lg:space-y-12">
          {caseStudies.map((study, index) => (
            <div 
              key={study.slug}
              className="bg-gradient-to-r from-gray-800/20 to-gray-900/20 backdrop-blur-sm border border-gray-700/30 rounded-2xl overflow-hidden hover:border-[#EE2B2C]/30 transition-all duration-500 group hover:shadow-2xl hover:shadow-[#EE2B2C]/10"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="lg:w-80 lg:flex-shrink-0">
                  <div className="relative h-64 lg:h-full min-h-[300px] bg-gray-700/30">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&crop=center`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 lg:p-8 xl:p-10">
                  <div className="flex flex-col h-full">
                    {/* Title */}
                    <h2 
                      className="text-xl lg:text-2xl xl:text-3xl font-bold mb-3 lg:mb-4 group-hover:text-[#EE2B2C] transition-colors duration-300"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {study.title}
                    </h2>

                    {/* Location & Client */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{study.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clipRule="evenodd" />
                        </svg>
                        <span>{study.client}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p 
                      className="text-gray-300 leading-relaxed mb-6 lg:mb-8 text-base lg:text-lg flex-grow"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {study.description}
                    </p>

                    {/* Key Highlights Preview */}
                    <div className="mb-6 lg:mb-8">
                      <h3 
                        className="text-sm font-semibold text-[#EE2B2C] mb-3 uppercase tracking-wide"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Key Highlights
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                        {study.keyScopeOfWork.slice(0, 4).map((scope, scopeIndex) => (
                          <div key={scopeIndex} className="flex items-start gap-2">
                            <span className="text-[#EE2B2C] mt-1 text-xs">▪</span>
                            <span className="leading-tight">{scope.title}</span>
                          </div>
                        ))}
                        {study.keyScopeOfWork.length > 4 && (
                          <div className="flex items-start gap-2 text-[#EE2B2C] font-medium">
                            <span className="mt-1 text-xs">+</span>
                            <span className="leading-tight">
                              {study.keyScopeOfWork.length - 4} more components
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Impact Preview */}
                    {/* <div className="mb-6 lg:mb-8">
                      <h3 
                        className="text-sm font-semibold text-[#EE2B2C] mb-3 uppercase tracking-wide"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Impact
                      </h3>
                      <div className="space-y-2">
                        {study.impact.slice(0, 2).map((impactItem, impactIndex) => (
                          <div key={impactIndex} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-[#EE2B2C] mt-1 text-xs">★</span>
                            <span className="leading-tight">{impactItem}</span>
                          </div>
                        ))}
                        {study.impact.length > 2 && (
                          <div className="text-sm text-[#EE2B2C] font-medium">
                            + {study.impact.length - 2} more achievements
                          </div>
                        )}
                      </div>
                    </div> */}

                    {/* Know More Button */}
                    <div>
                      <Link 
                        href={`/case-studies/${study.slug}`}
                        className="inline-flex items-center justify-center px-8 py-3 bg-[#EE2B2C] hover:bg-[#ff4444] text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#EE2B2C]/25 active:translate-y-0"
                        style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '16px'
                        }}
                      >
                        Know More
                        <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        {/* <div className="text-center mt-16 lg:mt-20 mb-16 lg:mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center">
              <div 
                className="text-3xl lg:text-4xl font-bold text-[#EE2B2C] mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {caseStudies.length}+
              </div>
              <div 
                className="text-gray-400 text-sm lg:text-base"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Successful Projects
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-3xl lg:text-4xl font-bold text-[#EE2B2C] mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                350+
              </div>
              <div 
                className="text-gray-400 text-sm lg:text-base"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Sites Secured
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-3xl lg:text-4xl font-bold text-[#EE2B2C] mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                24/7
              </div>
              <div 
                className="text-gray-400 text-sm lg:text-base"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Monitoring & Support
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-3xl lg:text-4xl font-bold text-[#EE2B2C] mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                5+
              </div>
              <div 
                className="text-gray-400 text-sm lg:text-base"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Years Experience
              </div>
            </div>
          </div>
        </div> */}

        {/* CTA Section */}
        {/* <div className="text-center mt-16 lg:mt-24">
          <div className="bg-gradient-to-r from-[#EE2B2C]/10 to-[#ff4444]/10 border border-[#EE2B2C]/20 rounded-2xl p-8 lg:p-12">
            <h2 
              className="text-2xl lg:text-3xl font-bold mb-4 text-white"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Ready to Transform Your Business?
            </h2>
            <p 
              className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Let's discuss how our innovative solutions can help you achieve your goals
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#EE2B2C] hover:bg-[#ff4444] text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EE2B2C]/25"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Get In Touch
            </Link>
          </div>
        </div> */}
      </main>

      {/* Footer Component */}
      <Footer className="mt-16 lg:mt-24" />
    </div>
  );
}