import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Award,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookMarked,
  Scale,
} from 'lucide-react';
import { motion } from 'framer-motion';
import lawBannerImg from '../assets/images/Pioneer Book House Law Books Banner.png';

export function About() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 py-16 sm:py-24 text-white">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, #38bdf8 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          ></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-500/20 border border-sky-400/30 text-sky-300 rounded-full text-xs font-bold tracking-wider uppercase mb-5 backdrop-blur-xs">
            <Scale className="w-3.5 h-3.5 text-sky-400" />
            <span>Pioneer Books · Pakistan Chowk, Karachi</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Pakistan&apos;s Historic Hub for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-300">
              Legal Literature & Law Books
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            Serving the legal fraternity, bench, bar, academia, and civil servants for decades with authoritative statutory codes, bare acts, judicial exam guides, and digital law books.
          </p>
        </motion.div>
      </section>

      {/* Main Story & History Section */}
      <section className="py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full">
                <BookMarked className="w-4 h-4 text-blue-600" />
                <span>Our Heritage & Mission</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 leading-tight">
                A Pillar of Statutory Publishing & Legal Knowledge
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                Established at the historic literary landmark of <strong>Pakistan Chowk in Karachi</strong>, <strong>Pioneer Books</strong> is one of the most respected law bookhouses and publishers in the country. We curate and publish comprehensive statutory manuals across 33 legal disciplines, from Bare Acts and Constitutional commentaries to Civil & Criminal Codes, Corporate Law, and Judicial Magistrate examinations.
              </p>
              <p className="text-slate-600 leading-relaxed text-base">
                In an era of digital modernization, we bridge traditional court-bound physical volumes with instant digital PDF access. Advocates, judicial officers, and law scholars can purchase bound legal treatises delivered across Pakistan, or download searchable PDF bare acts directly to their tablets and phones.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-950">33+</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Legal Categories</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-950">100%</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Authoritative Texts</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Visual Card / Photo: PC view uses Pioneer Book House Law Books Banner.png */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-sky-200/80 shadow-2xl shadow-blue-950/10 bg-white">
                <div className="aspect-4/3 overflow-hidden bg-slate-900">
                  {/* PC View: Official Pioneer Book House Law Books Banner */}
                  <img
                    src={lawBannerImg}
                    alt="Pioneer Book House Law Books Banner"
                    className="hidden lg:block w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  {/* Non-PC / Mobile View */}
                  <img
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200"
                    alt="Pioneer Books Law Library & Bookstore"
                    className="block lg:hidden w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 sm:p-8 bg-gradient-to-br from-white to-sky-50/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-sky-200 shadow-xs shrink-0 bg-white flex items-center justify-center p-1">
                      <img
                        src="https://scontent.fkhi2-2.fna.fbcdn.net/v/t39.99422-6/809209856_1101177619532009_3112873547259779385_n.png?stp=dst-jpg_tt6&cstp=mx1254x1254&ctp=s1254x1254&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=HGcsXRsQ8b4Q7kNvwHbDMLl&_nc_oc=Adqa6fQp45379XDNms327v1Uk8NWsbgjczy1Who-aetTU72nfYUuaQ7ZG6NC6vJclzs&_nc_zt=14&_nc_ht=scontent.fkhi2-2.fna&_nc_gid=m15HS9_1r2hJZjQGG2CBpw&_nc_ss=7b2a8&oh=00_AQNOoUbwp1gCyddhXsubHPpjcvJlfk9p8SlIOXnqlVenyg&oe=6AD13960"
                        alt="Pioneer Books Emblem"
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-blue-950 text-lg">Pioneer Books</h3>
                      <p className="text-slate-500 text-xs font-medium">Pakistan Chowk · Karachi, Pakistan</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillars of Pioneer Books */}
      <section className="py-16 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full">
              What Defines Us
            </span>
            <h2 className="text-3xl font-extrabold text-blue-950 mt-3">Why the Legal Fraternity Trusts Us</h2>
            <p className="text-slate-600 text-sm mt-2">
              Our principles guarantee up-to-date amendments, authoritative commentary, and dependable nationwide dispatch.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                bgIcon: 'bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white',
                title: 'Statutory Accuracy',
                desc: 'Every Bare Act and commentary includes latest statutory amendments, gazette notifications, and landmark Supreme Court citations.',
              },
              {
                icon: Globe,
                bgIcon: 'bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white',
                title: 'Dual Format Availability',
                desc: 'Receive durable hardbound copies for chambers and bar libraries, or instant digital PDFs for mobile research in courtrooms.',
              },
              {
                icon: Award,
                bgIcon: 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white',
                title: 'Direct Store Support',
                desc: 'Connect directly with our staff via WhatsApp (+92 333 3073438) or visit our walk-in bookhouse at Pakistan Chowk for inquiries.',
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, delay: i * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl bg-[#f8fafc] border border-sky-100 hover:border-sky-300 hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${pillar.bgIcon}`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-3">{pillar.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Location & Direct Contact Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
              <Scale className="w-96 h-96 text-white" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300 bg-sky-500/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
                  Visit or Inquire
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                  Visit Our Pakistan Chowk Store
                </h2>
                <p className="text-sky-100/90 text-sm sm:text-base leading-relaxed mb-8">
                  Whether you are seeking rare case digests, Bare Acts, civil judge past papers, or corporate law registers, our bookstore staff is ready to assist you.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-sky-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Store Address</h4>
                      <p className="text-sky-200 text-sm">Shop no.1-A Ismail Mansion, Pakistan Chowk Karachi, Pakistan</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-sky-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Phone & WhatsApp</h4>
                      <a href="tel:+923333073438" className="text-sky-200 hover:text-white transition-colors text-sm font-semibold">
                        +92 333 3073438
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-sky-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Email Address</h4>
                      <a href="mailto:pioneerbookhouse786@gmail.com" className="text-sky-200 hover:text-white transition-colors text-sm">
                        pioneerbookhouse786@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/923333073438?text=Hello%20Pioneer%20Books%2C%20I%20am%20inquiring%20about%20law%20books."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>

                  <a
                    href="https://www.facebook.com/p/Pioneer-Books-100088820884433/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook Page</span>
                  </a>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15"
              >
                <h3 className="text-xl font-bold text-white mb-4">Direct Inquiry & Bulk Orders</h3>
                <p className="text-sky-100 text-sm mb-6">
                  For law firm libraries, bar associations, or student bulk inquiries, reach out directly or browse our full online catalog.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-sky-100">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                    <span>Physical orders dispatched via reliable courier service</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-sky-100">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                    <span>Instant access to digital PDF bare acts</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-sky-100">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                    <span>Cash on Delivery (COD) & Bank transfer support</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    to="/shop"
                    className="w-full bg-white text-blue-950 hover:bg-sky-50 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Browse 33 Legal Categories</span>
                    <ArrowRight className="w-4 h-4 text-blue-950" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
