'use client'



import React, { useState } from 'react';
import Link from 'next/link';
import { ICONS } from '@/src/constants';
import Button from '@/components/ui/Button';

// Accordion Item Component
const Belief: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-brand-muted/50">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-5 text-left text-lg font-semibold text-white hover:text-brand-gold transition-colors"
                aria-expanded={isOpen ? 'true' : 'false'}
                aria-controls={`belief-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
            >
                <span>{title}</span>
                <ICONS.ChevronDown className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                id={`belief-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
            >
                <div className="overflow-hidden">
                    <p className="pb-5 text-brand-text-dark">{description}</p>
                </div>
            </div>
        </div>
    );
};


const AboutPage: React.FC = () => {
  return (
    <div className="animate-fadeInUp">
      {/* Hero Section */}
      <section className="relative py-32 text-center overflow-hidden bg-brand-dark">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273065/About-us_txonpx.png')` }}
        >
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight text-brand-gold drop-shadow-lg">
            Our Story & Vision
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-white drop-shadow-md">
            Discover the heart behind Torch Fellowship: our journey, our purpose, and our unshakeable faith in what God is doing.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-24 bg-brand-dark">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center max-w-5xl">
            <div className="space-y-6">
                <h2 className="text-4xl font-serif font-bold text-white">Who We Are</h2>
                <p className="text-brand-text-dark text-lg">
                    Torch Fellowship is a dynamic Christian ministry dedicated to bringing all men to the Light of Christ, as declared in John 1:4: “In Him was life, and the life was the light of men.”
                </p>
                <p className="text-brand-text-dark">
                    We are passionate about raising a generation that fully understands the personality and character of God through the practical teaching of His Word. Our community is built on faith, love, and a commitment to living out the Gospel in everyday life.
                </p>
                <p className="text-brand-text-dark">
                    Founded to inspire and equip believers, Torch Fellowship serves as a place of authentic worship, in-depth discipleship, and transformational outreach. We believe that every person is called to walk in the fullness of God's purpose and to shine His light wherever they go.
                </p>
            </div>
            <div className="order-first md:order-last">
                <img src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273065/About-us_txonpx.png" alt="Torch Fellowship Community" className="rounded-lg shadow-2xl w-full h-auto object-cover" />
            </div>
        </div>
      </section>

      {/* Our Mission & Vision Section */}
      <section className="py-24 bg-brand-surface">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-bold text-white">Our Mission</h2>
               <blockquote className="border-l-4 border-brand-gold pl-4 italic text-brand-text">
                "To rise a generation that fully understands the personality and character of God through the practical teaching of the Word."
              </blockquote>
              <p className="text-brand-text-dark pt-4">
                To fulfill this, we aim to be a beacon of light, igniting hearts with the love of Christ, transforming lives through the power of His Word, and building a community where everyone belongs. We exist to know God and to make Him known.
              </p>
              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-brand-gold/10 text-brand-gold p-2 rounded-full mt-1">
                      <ICONS.Heart className="h-5 w-5" />
                  </div>
                  <div>
                      <h3 className="font-semibold text-white">Ignite Hearts</h3>
                      <p className="text-brand-text-dark text-sm">Through passionate worship and authentic relationships.</p>
                  </div>
              </div>
              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-brand-gold/10 text-brand-gold p-2 rounded-full mt-1">
                      <ICONS.BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                      <h3 className="font-semibold text-white">Transform Lives</h3>
                      <p className="text-brand-text-dark text-sm">By teaching the uncompromising truth of the Bible.</p>
                  </div>
              </div>
            </div>
            <div className="space-y-6">
               <h2 className="text-4xl font-serif font-bold text-white">Our Vision</h2>
              <blockquote className="border-l-4 border-brand-gold pl-4 italic text-brand-text">
                "To bring all men to the light of Christ."
                <cite className="block not-italic text-sm text-brand-text-dark mt-1">— John 1:4</cite>
              </blockquote>
              <p className="text-brand-text-dark pt-4">
                We see this vision fulfilled in a fellowship that deeply impacts its city and the nations with the gospel. A place where the lost are found, the broken are healed, and disciples are made who carry the torch of revival to the ends of the earth.
              </p>
              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-brand-gold/10 text-brand-gold p-2 rounded-full mt-1">
                      <ICONS.Users className="h-5 w-5" />
                  </div>
                  <div>
                      <h3 className="font-semibold text-white">Build Community</h3>
                      <p className="text-brand-text-dark text-sm">Creating a family of believers united in purpose and love.</p>
                  </div>
              </div>
              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-brand-gold/10 text-brand-gold p-2 rounded-full mt-1">
                      <ICONS.Send className="h-5 w-5" />
                  </div>
                  <div>
                      <h3 className="font-semibold text-white">Reach the World</h3>
                      <p className="text-brand-text-dark text-sm">Supporting missions and raising up leaders to go.</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* What We Believe Section */}
      <section className="py-24 bg-brand-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl font-serif font-bold text-white">What We Believe</h2>
              <p className="mt-3 text-brand-text-dark">Our faith is founded on the timeless truths of Scripture.</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-2">
            <Belief title="The Scriptures" description="We believe the Bible is the inspired, inerrant, and authoritative Word of God, our ultimate guide for faith and life." />
            <Belief title="The Triune God" description="We believe in one God, eternally existing in three persons: the Father, the Son (Jesus Christ), and the Holy Spirit." />
            <Belief title="Jesus Christ" description="We believe in the deity of our Lord Jesus Christ, in His virgin birth, in His sinless life, in His miracles, in His vicarious and atoning death through His shed blood, in His bodily resurrection, in His ascension to the right hand of the Father, and in His personal return in power and glory." />
            <Belief title="Salvation" description="We believe that for the salvation of lost and sinful man, regeneration by the Holy Spirit is absolutely essential. Salvation is by grace through faith in Jesus Christ alone." />
            <Belief title="The Holy Spirit" description="We believe in the present ministry of the Holy Spirit by whose indwelling the Christian is enabled to live a godly life, and who empowers the church for its mission in the world." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-surface">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-serif font-bold text-white">Join the Journey</h2>
            <p className="mt-4 text-lg text-brand-text-dark max-w-2xl mx-auto">
                We invite you to be part of this journey whether you are seeking a deeper relationship with God, a spiritual family to belong to, or an opportunity to impact your community for Christ. Together, we are igniting hearts and transforming lives.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button size="lg" variant="primary" as={Link} href="/contact">Plan Your Visit</Button>
                <Button size="lg" variant="secondary" as={Link} href="/leaders">Meet Our Leaders</Button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
