import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect } from 'react';
import { Users, Rocket, TrendingUp, Award } from 'lucide-react';

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix?: string;
  label: string;
  color: string;
}

function StatItem({ icon: Icon, value, suffix = '', label, color }: StatItemProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2 });
    return controls.stop;
  }, [count, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="group relative"
    >
      <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300`}></div>
      <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          <motion.span>{rounded}</motion.span>{suffix}
        </div>
        <div className="text-gray-600">{label}</div>
      </div>
    </motion.div>
  );
}

export function AnimatedStats() {
  const stats = [
    {
      icon: Users,
      value: 500,
      suffix: '+',
      label: 'Active Members',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Rocket,
      value: 127,
      suffix: '+',
      label: 'Projects Built',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: TrendingUp,
      value: 23,
      suffix: '+',
      label: 'Startups Launched',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Award,
      value: 95,
      suffix: '%',
      label: 'Success Rate',
      color: 'from-orange-400 to-pink-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-orange-50/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}