import React, { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Phone, MapPin, FacebookIcon, InstagramIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would handle sending the form data
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | FlexiRide</title>
        <meta name="description" content="Contact FlexiRide for questions, support, or partnership opportunities. Get in touch with our team today!" />
        <meta name="keywords" content="contact FlexiRide, car rental support, customer service, get in touch" />
        <link rel="canonical" href="https://flexiride.co/contact" />
        {/* Open Graph */}
        <meta property="og:title" content="Contact Us | FlexiRide" />
        <meta property="og:description" content="Contact FlexiRide for questions, support, or partnership opportunities. Get in touch with our team today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flexiride.co/contact" />
        <meta property="og:image" content="/images/flexiride.png" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | FlexiRide" />
        <meta name="twitter:description" content="Contact FlexiRide for questions, support, or partnership opportunities. Get in touch with our team today!" />
        <meta name="twitter:image" content="/images/flexiride.png" />
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        {/* Structured Data: LocalBusiness */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "FlexiRide",
            "image": "https://flexiride.co/images/flexiride.png",
            "@id": "https://flexiride.co/contact",
            "url": "https://flexiride.co/contact",
            "telephone": "+1-555-123-4567",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Street Name",
              "addressLocality": "City",
              "addressCountry": "Country"
            },
            "description": "Contact FlexiRide for questions, support, or partnership opportunities.",
            "logo": "https://flexiride.co/images/flexiride.png",
            "sameAs": [
              "https://facebook.com/yourpage",
              "https://instagram.com/yourpage"
            ]
          }
        `}</script>
      </Helmet>
      <div className="bg-gray-50 text-gray-900 min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-primary/80 py-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow">Get in Touch</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-100">We'd love to hear from you! Reach out with questions, feedback, or partnership opportunities.</p>
        </section>

        <section className="py-12 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Contact Form</h2>
            {submitted ? (
              <div className="bg-background-card p-6 rounded-lg shadow text-center">
                <p className="text-primary text-lg font-semibold mb-2">Thank you for reaching out!</p>
                <p className="text-gray-300">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 bg-background-card p-6 rounded-lg shadow">
                <Input
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@email.com"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 bg-background-light text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                  />
                </div>
                <Button type="submit" variant="primary" fullWidth>Send Message</Button>
              </form>
            )}
          </div>

          {/* Contact Info & Socials */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Contact Information</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>123 Street Name, City, Country</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-2" />
                  <span>info@flexiride.co</span>
                </li>
              </ul>
            </div>
            {/* Social Media Icons */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Connect with us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary" aria-label="Facebook">
                  <FacebookIcon className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary" aria-label="Instagram">
                  <InstagramIcon className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary" aria-label="WhatsApp">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.72 13.06c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.92 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" /><circle cx="12" cy="12" r="10" /></svg>
                </a>
              </div>
            </div>
            {/* Google Map Embed (optional) */}
            <div className="rounded-lg overflow-hidden shadow">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537363153169!3d-37.816279779751554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f6e0b1%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1614036606756!5m2!1sen!2sus"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
