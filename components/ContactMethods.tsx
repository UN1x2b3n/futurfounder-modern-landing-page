import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MessageCircle, Github, Linkedin, Twitter, MapPin, Clock } from 'lucide-react';

interface ContactMethod {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  description: string;
  gradient: string;
  hoverColor: string;
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  color: string;
}

export const ContactMethods: React.FC = () => {
  const contactMethods: ContactMethod[] = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@unix2.dev',
      href: 'mailto:hello@unix2.dev',
      description: 'Send us an email anytime',
      gradient: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:bg-blue-50'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 98765 43210',
      href: 'tel:+919876543210',
      description: 'Call us during business hours',
      gradient: 'from-green-500 to-green-600',
      hoverColor: 'hover:bg-green-50'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Chat with us',
      href: 'https://wa.me/919876543210',
      description: 'Quick response guaranteed',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:bg-emerald-50'
    }
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/unix2',
      color: 'text-gray-700 hover:text-gray-900'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/company/unix2',
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com/unix2dev',
      color: 'text-sky-500 hover:text-sky-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6"
      >
        {contactMethods.map((method, index) => (
          <motion.a
            key={index}
            variants={itemVariants}
            href={method.href}
            target={method.href.startsWith('http') ? '_blank' : undefined}
            rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg ${method.hoverColor}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${method.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{method.label}</h3>
                <p className="text-gray-600 font-medium">{method.value}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
              >
                →
              </motion.div>
            </div>
          </motion.a>
        ))}
      </motion.div>

      {/* Office Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100"
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          Office Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <p className="text-gray-700 font-medium">Ismayilpadi, Azerbaijan</p>
              <p className="text-sm text-gray-500">Building the future from our hometown</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <p className="text-gray-700 font-medium">Business Hours</p>
              <p className="text-sm text-gray-500">Monday - Friday: 9:00 AM - 6:00 PM (GMT+4)</p>
              <p className="text-sm text-gray-500">Weekend: Available for urgent matters</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
        <div className="flex justify-center gap-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 ${social.color}`}
              aria-label={`Follow us on ${social.label}`}
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Stay updated with our latest projects and community news
        </p>
      </motion.div>
    </div>
  );
};