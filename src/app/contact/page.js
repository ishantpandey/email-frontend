'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileNavigation from '../../component/MobileNavigation';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import AnimatedButton from '@/component/AnimatedButton';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <>
      <MobileNavigation />
      <div className="min-h-screen ">
        <main className="max-w-6xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-16 relative">

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500 ">
              Get in Touch
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mb-6 rounded-full"></div>
            
            <p className="text-xl md:text-2xl text-orange-700 max-w-3xl mx-auto leading-relaxed font-light">
              Have questions or feedback? We'd love to hear from you. 
              <br />
              <span className="text-orange-600/90">Send us a message and we'll respond as soon as possible.</span>
            </p>
            
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-medium mb-6 text-orange-900">Contact Information</h2>
              <p className="text-orange-700 mb-8 leading-relaxed">
                Reach out to us through any of these channels. Our team is here to help you with any questions or concerns.
              </p>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-orange-900 mb-1">Email</h3>
                    <a href="mailto:support@flowmail.com" className="text-orange-600 hover:text-orange-500 transition-colors">
                      support@flowmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaPhone className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-orange-900 mb-1">Phone</h3>
                    <a href="tel:+1234567890" className="text-orange-600 hover:text-orange-500 transition-colors">
                      +91 9695532201
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-orange-900 mb-1">Office</h3>
                    <p className="text-orange-600">
                      123 Email Street<br />
                      San Francisco, CA 94102<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-10 bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="font-medium text-orange-900 mb-3">Business Hours</h3>
                <div className="space-y-2 text-orange-700">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-medium mb-6 text-orange-900">Send us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700">Thank you! Your message has been sent successfully.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-orange-900 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-orange-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-orange-900 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-orange-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <AnimatedButton
                  type="submit"
                  disabled={isSubmitting}
                  className='w-full'
                >
                  {isSubmitting ? (
                    <>
                     
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </AnimatedButton>
              </form>
            </div>
          </div>

          {/* Additional CTA */}
          <div className="text-center mt-16 bg-orange-50 rounded-2xl p-12 border border-orange-200">
            <h2 className="text-3xl font-light mb-4 text-orange-900">
              Looking for Support?
            </h2>
            <p className="text-lg text-orange-700 mb-8 max-w-xl mx-auto">
              Check out our Help Center for quick answers to common questions or get started with our platform today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/features')}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                View Features
              </button>
              <button 
                onClick={() => router.push('/register')}
                className="border border-orange-400 text-orange-500 px-8 py-3 rounded-lg hover:bg-orange-50 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
