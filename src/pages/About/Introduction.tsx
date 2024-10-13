import React from 'react';

const Introduction: React.FC = () => {
  return (
    <section 
      data-testid="introduction"
      className="w-full max-w-3xl text-center mb-10 pt-4"
      aria-labelledby="about-heading"
    >
      <h1 
        id="about-heading" 
        className="text-4xl font-bold mb-4"
      >
        About Me
      </h1>
      <p className="text-lg">
        I'm a backend software engineer specializing in platform and site reliability engineering in AI/ML, media streaming, and cloud infrastructure. I specialize in building high-quality user experiences using modern web technologies, and highly scalable, reliable cloud software for large, global platforms.
      </p>
    </section>
  );
};

export default Introduction;
