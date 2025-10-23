'use client';

interface FooterProps {
  text?: string;
  className?: string;
}

export default function Footer({ 
  text = "© 2025 Scs Tech",
  className = ""
}: FooterProps) {
  return (
    <footer className={`bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="text-center">
          <p 
            className="text-gray-600 text-sm lg:text-base"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {text}
          </p>
        </div>
      </div>
    </footer>
  );
}