import React from 'react';
import Introduction from './Introduction';
import Timeline from './CareerTimeline';
import Skills from './Skills';

const About: React.FC = () => {
  return (
    <main 
      className="flex flex-col items-center justify-center w-full p-6" 
      role="main" 
      aria-label="About Me Section"
    >
      <Introduction />
      <Skills />
      <Timeline />
    </main>
  );
};

export default About;