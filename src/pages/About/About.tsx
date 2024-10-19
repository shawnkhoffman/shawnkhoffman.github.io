import React from 'react';
import Introduction from './Introduction';
import Timeline from './CareerTimeline';
import Skills from './Skills';

const About: React.FC = () => {
  return (
    <main 
      className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6" 
      role="main" 
      aria-label="About Section"
    >
      <Introduction />
      <Skills />
      <Timeline />
    </main>
  );
};

export default About;