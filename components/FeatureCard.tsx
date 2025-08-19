import React from 'react';
import { motion } from 'motion/react';
import { ModernCard, ModernCardContent } from './ui/ModernCard';
import { FeatureCardProps } from './types/feature';

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
  className = ''
}) => {
  return (
    <div className={`group relative ${className}`}>
      {/* Gradient border effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all duration-500`}></div>
      
      <ModernCard
        variant="gradient"
        delay={delay}
        className="relative h-full"
      >
        <ModernCardContent className="flex flex-col items-center text-center space-y-6">
          {/* Icon with gradient background */}
          <motion.div
            whileHover={{ 
              rotate: 10, 
              scale: 1.1 
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
            className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* Title */}
          <motion.h3 
            className="text-xl font-bold text-foreground group-hover:text-gradient transition-all duration-300"
          >
            {title}
          </motion.h3>
          
          {/* Description */}
          <p className="text-body text-neutral-600 leading-relaxed text-center">
            {description}
          </p>
          
          {/* Hover indicator */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm font-medium text-primary self-start"
          >
            <span>Learn more</span>
            <motion.div
              whileHover={{ x: 5 }}
              className="w-4 h-4 rounded-full bg-gradient-cta flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </motion.div>
          </motion.div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );
};