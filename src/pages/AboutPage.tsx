import React from 'react';
import Card, { CardContent } from '../components/ui/Card';
import { Helmet } from 'react-helmet-async';

const team = [
  { name: 'Jane Doe', title: 'CEO', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'John Smith', title: 'CTO', photo: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { name: 'Alice Lee', title: 'COO', photo: 'https://randomuser.me/api/portraits/women/47.jpg' },
];

const milestones = [
  { year: '2021', event: 'FlexiRide founded' },
  { year: '2022', event: 'Launched first city' },
  { year: '2023', event: 'Reached 10,000+ bookings' },
];

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | FlexiRide</title>
        <meta name="description" content="Learn about FlexiRide's mission, values, and journey. Meet our team and discover what drives our premium car rental service." />
        <meta name="keywords" content="about FlexiRide, car rental company, our story, team, values" />
        <link rel="canonical" href="https://flexiride.co/about" />
        {/* Open Graph */}
        <meta property="og:title" content="About Us | FlexiRide" />
        <meta property="og:description" content="Learn about FlexiRide's mission, values, and journey. Meet our team and discover what drives our premium car rental service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flexiride.co/about" />
        <meta property="og:image" content="/images/flexiride.png" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | FlexiRide" />
        <meta name="twitter:description" content="Learn about FlexiRide's mission, values, and journey. Meet our team and discover what drives our premium car rental service." />
        <meta name="twitter:image" content="/images/flexiride.png" />
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        {/* Structured Data: Organization */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FlexiRide",
            "url": "https://flexiride.co/",
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow">Our Story</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-100">Discover the journey and values behind FlexiRide.</p>
        </section>

        {/* Who We Are */}
        <section className="py-12 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Who We Are</h2>
          <p className="text-lg text-gray-300">FlexiRide is dedicated to providing premium car rental experiences, making every journey smooth, flexible, and memorable. Our mission is to connect people with the perfect ride for every occasion, powered by technology and a passion for service.</p>
        </section>

        {/* What We Stand For */}
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center text-white">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent>
                <h3 className="text-xl font-bold mb-2 text-primary">Customer First</h3>
                <p className="text-gray-300">We prioritize your needs, ensuring every ride is safe, comfortable, and reliable.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="text-xl font-bold mb-2 text-primary">Innovation</h3>
                <p className="text-gray-300">We embrace technology to deliver seamless booking and driving experiences.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="text-xl font-bold mb-2 text-primary">Sustainability</h3>
                <p className="text-gray-300">We are committed to eco-friendly practices and a greener future for mobility.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Journey (Timeline) */}
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center text-white">Our Journey</h2>
          <ol className="relative border-l border-primary">
            {milestones.map((m, idx) => (
              <li key={idx} className="mb-10 ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-primary rounded-full ring-8 ring-background-dark text-white font-bold">{m.year}</span>
                <h3 className="font-semibold text-lg text-primary mb-1">{m.event}</h3>
              </li>
            ))}
          </ol>
        </section>

        {/* Team Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center text-white">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <Card key={idx} className="flex flex-col items-center p-6">
                <img src={member.photo} alt={member.name} className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-primary" />
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary font-medium">{member.title}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage; 