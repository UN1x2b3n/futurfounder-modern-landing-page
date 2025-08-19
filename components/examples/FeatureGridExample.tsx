import React from 'react';
import { FeatureGrid } from '../FeatureGrid';
import { featuresData } from '../data/features';

/**
 * Example usage of the FeatureGrid component
 * This demonstrates how to integrate the feature card system into your application
 */
export const FeatureGridExample: React.FC = () => {
  return (
    <FeatureGrid
      features={featuresData}
      title="Why Choose FuturFounder?"
      subtitle="Our proven system transforms ambitious students into successful startup founders through comprehensive support and community"
    />
  );
};

/**
 * Alternative usage without section headers
 */
export const SimpleFeatureGrid: React.FC = () => {
  return (
    <div className="py-20">
      <FeatureGrid features={featuresData} />
    </div>
  );
};

/**
 * Custom features example
 */
export const CustomFeatureGrid: React.FC = () => {
  const customFeatures = [
    {
      icon: featuresData[0].icon,
      title: "Custom Feature 1",
      description: "This is a custom feature with different content",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: featuresData[1].icon,
      title: "Custom Feature 2", 
      description: "Another custom feature showcasing flexibility",
      gradient: "from-green-500 to-teal-600"
    }
  ];

  return (
    <FeatureGrid
      features={customFeatures}
      title="Custom Features"
      subtitle="Demonstrating the flexibility of the feature card system"
      className="bg-gradient-to-b from-blue-50 to-purple-50"
    />
  );
};