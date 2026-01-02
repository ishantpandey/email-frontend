'use client';
import { useRouter } from 'next/navigation';
import MobileNavigation from '../component/MobileNavigation';

export default function Home() {
  const router = useRouter();
  
  return (
    <>
      <MobileNavigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-20">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              Email Management
              <br />
              <span className="font-medium text-cyan-400">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              A clean, fast, and intuitive email platform designed for modern professionals who value simplicity and efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/mail')}
                className="bg-cyan-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-cyan-400 transition-colors shadow-lg"
              >
                Get Started
              </button>
              <button 
                onClick={() => router.push('/register')}
                className="border border-blue-300 text-blue-200 px-8 py-4 rounded-lg text-lg hover:bg-white/10 hover:border-white transition-all"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-white text-center mb-12">
              Everything you need, nothing you don't
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="w-12 h-12 bg-cyan-400/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Clean Compose</h3>
                <p className="text-blue-100 leading-relaxed">Write emails with a distraction-free interface that helps you focus on your message.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Lightning Fast</h3>
                <p className="text-blue-100 leading-relaxed">Optimized performance ensures your emails load instantly and send without delay.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="w-12 h-12 bg-rose-400/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Secure & Private</h3>
                <p className="text-blue-100 leading-relaxed">Your emails are protected with enterprise-grade security and privacy features.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
            <h2 className="text-3xl font-light text-white mb-4">
              Ready to simplify your email?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Join thousands of professionals who have streamlined their communication with FlowMail.
            </p>
            <button 
              onClick={() => router.push('/register')}
              className="bg-cyan-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-cyan-400 transition-colors shadow-lg"
            >
              Start Free Today
            </button>
          </div>
        </main>
      </div>
    </>
  );
}