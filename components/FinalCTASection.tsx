import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  ArrowRight, 
  Star,
  Zap,
  Target
} from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  const stats = [
    { icon: Users, label: "Active Members", value: "500+" },
    { icon: Rocket, label: "Projects Built", value: "127+" },
    { icon: TrendingUp, label: "Startups Launched", value: "23+" },
    { icon: Star, label: "Success Rate", value: "89%" }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Fast-Track Learning",
      description: "Master AI/ML and fullstack development in months, not years"
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Connect with like-minded builders and future founders"
    },
    {
      icon: Target,
      title: "Real Projects",
      description: "Build actual products that solve real-world problems"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-orange-500 via-pink-500 to-red-600 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/40 via-pink-600/40 to-red-600/40"></div>
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
          className="absolute top-0 -left-4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute top-0 -right-4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
          className="absolute -bottom-8 left-20 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-xl"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main CTA Content */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/30"
          >
            <Rocket className="w-4 h-4" />
            <span className="text-sm font-medium">Your Journey Starts Here</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-orange-100 to-pink-200 bg-clip-text text-transparent leading-tight"
          >
            Ready to be the next
            <br />
            <span className="bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">
              FuturFounder?
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 text-orange-100/90 leading-relaxed max-w-4xl mx-auto"
          >
            Join our community of builders, dreamers, and future founders. Transform your ideas into 
            reality with AI/ML expertise, fullstack development skills, and the support of Unix².
          </motion.p>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-orange-100/80 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 px-12 py-5 bg-white text-orange-600 font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Join Now on WhatsApp</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.a>
            
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-5 border-2 border-white/30 text-white font-bold rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, y: -5 }}
              className="text-center group cursor-default"
            >
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:bg-white/20 transition-colors duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-orange-200/90 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final Encouragement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-orange-100/80 max-w-2xl mx-auto">
            Don't wait for the perfect moment. The perfect moment is now. 
            <br />
            <span className="font-semibold text-white">
              Your entrepreneurial journey starts with a single message.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};