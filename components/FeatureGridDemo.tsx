import React from 'react';
import { FeatureGrid } from './FeatureGrid';
import { featuresData } from './data/features';

/**
 * Demo component showing the FeatureGrid in action
 * This can be used to test the component or as a reference for integration
 */
export const FeatureGridDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Demo with full features */}
      <FeatureGrid
        features={featuresData}
        title="Why Choose FuturFounder?"
        subtitle="Our comprehensive platform provides everything you need to transform from student to successful startup founder"
      />
      
      {/* Demo with limited features */}
      <FeatureGrid
        features={featuresData.slice(0, 3)}
        title="Core Features"
        subtitle="The essential tools for your entrepreneurial journey"
        className="bg-gradient-to-b from-orange-50/30 to-pink-50/30"
      />
    </div>
  );
};

export default FeatureGridDemo;