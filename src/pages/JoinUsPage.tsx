import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ICONS } from '../constants';

const JoinUsPage: React.FC = () => {
  return (
    <div className="animate-fadeInUp">
      {/* Hero Section */}
      <section className="relative py-32 text-center overflow-hidden bg-brand-dark">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('/worship-crowd.jpg')` }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight text-brand-gold">
            Join Us
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-dark">
            Whether you are new to faith, growing in your walk with God, or looking for a community to call home, Torch Fellowship welcomes you.
          </p>
        </div>
      </section>

      {/* How to get involved section */}
      <section className="py-24 bg-brand-surface">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-4xl font-serif font-bold text-white">Here’s How You Can Get Involved</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <InvolvementCard
                    title="Attend Our Services"
                    description="Join us every week for passionate worship, practical teaching, and fellowship that strengthens your spirit."
                    linkTo="/events"
                    linkText="View Service Times"
                />
                <InvolvementCard
                    title="Connect in Fellowship"
                    description="Be part of a loving community where you can build meaningful relationships, serve together, and grow in your purpose."
                    linkTo="/light-campuses"
                    linkText="Find a Community"
                />
                <InvolvementCard
                    title="Serve With Us"
                    description="Use your gifts and talents to make a difference. There are many opportunities to volunteer in our ministry teams, outreach programs, and events."
                    linkTo="/serve"
                    linkText="Explore Serving"
                />
                <InvolvementCard
                    title="Partner With Us"
                    description="Support the vision through your giving and prayer as we bring the light of Christ to our city and beyond."
                    linkTo="/give"
                    linkText="Give Online"
                />
            </div>
        </div>
      </section>
    </div>
  );
};

const InvolvementCard: React.FC<{ title: string; description: string; linkTo: string; linkText: string; }> = ({ title, description, linkTo, linkText }) => {
    return (
        <div className="bg-brand-dark p-6 rounded-lg border border-brand-muted/50 flex flex-col text-left transition-all duration-300 transform hover:border-brand-gold/30 hover:shadow-2xl hover:shadow-brand-gold/10 hover:-translate-y-1">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-green-400 mt-1">
                    <ICONS.CheckCircle className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-xl font-serif font-bold text-white">{title}</h3>
                    <p className="text-brand-text-dark mt-2">{description}</p>
                </div>
            </div>
             <Link to={linkTo} className="text-brand-gold hover:underline mt-4 self-end font-semibold">
                {linkText} &rarr;
            </Link>
        </div>
    );
};


export default JoinUsPage;