import React from 'react';
import { motion } from 'framer-motion';

export function StoreLocationSection() {
  const query = encodeURIComponent('V236+PX Garikhata, Karachi, Pakistan');
  const embedMapUrl = `https://maps.google.com/maps?q=${query}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="bg-slate-950 border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900"
        >
          {/* Pure Full Google Map Location */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full min-h-[320px] sm:min-h-[420px] bg-slate-950">
            <iframe
              title="Google Map Location - V236+PX Garikhata, Karachi, Pakistan"
              src={embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
