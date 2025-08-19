import React from 'react';
import { motion } from 'motion/react';
import { ContactForm } from './ContactForm';
import { ContactMethods } from './ContactMethods';
import { MessageCircle, Send } from 'lucide-react';

interface ContactSectionProps {
  onFormSubmit?: (data: { name: string; email: string; message: string }) => Promise<void>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onFormSubmit }) => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full px-4 py-2 mb-6 border border-orange-200"
          >
            <MessageCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Get In Touch</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to start your entrepreneurial journey? Have a project idea? Want to join our community? 
            We'd love to hear from you and help turn your vision into reality.
          </p>
        </motion.div>

        {/* Contact Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/10 via-pink-400/10 to-red-400/10 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Send className="w-6 h-6 text-orange-600" />
                  Send us a Message
                </h3>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>
              
              <ContactForm onSubmit={onFormSubmit} />
            </div>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Other Ways to Reach Us
              </h3>
              <p className="text-gray-600">
                Choose the method that works best for you. We're here to help!
              </p>
            </div>
            
            <ContactMethods />
          </motion.div>
        </div>

        {/* Quick Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-pink-600/20"></div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-xl"
            />
            
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Need Immediate Help?
              </h3>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Join our WhatsApp community for instant support, networking opportunities, 
                and real-time updates from the Unix² team.
              </p>
              
              <motion.a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Join WhatsApp Community
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};