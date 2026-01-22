'use client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const MobileNavigation = dynamic(() => import('../component/MobileNavigation'), { ssr: false });
import { FaEnvelopeOpenText, FaBolt, FaShieldAlt } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  
  return (
    <>
      <MobileNavigation />
      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-20 text-orange-900">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
              Email Management
              <br />
              <span className="font-medium text-orange-500">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-orange-600/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              A clean, fast, and intuitive email platform designed for modern professionals who value simplicity and efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/mail')}
                className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors shadow-lg"
              >
                Get Started
              </button>
              <button 
                onClick={() => router.push('/register')}
                className="border border-orange-400 text-orange-500 px-8 py-4 rounded-lg text-lg hover:bg-orange-50 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-center mb-12">
              Everything you need, nothing you don't
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-orange-50 rounded-xl p-8 border border-orange-200">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <FaEnvelopeOpenText className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-medium mb-3">Clean Compose</h3>
                <p className="text-orange-700 leading-relaxed">Write emails with a distraction-free interface that helps you focus on your message.</p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-8 border border-orange-200">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <FaBolt className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-medium mb-3">Lightning Fast</h3>
                <p className="text-orange-700 leading-relaxed">Optimized performance ensures your emails load instantly and send without delay.</p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-8 border border-orange-200">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <FaShieldAlt className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-medium mb-3">Secure & Private</h3>
                <p className="text-orange-700 leading-relaxed">Your emails are protected with enterprise-grade security and privacy features.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-orange-50 rounded-2xl p-12 border border-orange-200">
            <h2 className="text-3xl font-light mb-4">
              Ready to simplify your email?
            </h2>
            <p className="text-lg text-orange-700 mb-8 max-w-xl mx-auto">
              Join thousands of professionals who have streamlined their communication with FlowMail.
            </p>
            <button 
              onClick={() => router.push('/register')}
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors shadow-lg"
            >
              Start Free Today
            </button>
          </div>
        </main>
      </div>
    </>
  );
}