import React, { useState } from 'react';
import { FaReact, FaGithub, FaCode, FaLayerGroup, FaTools, FaBug, FaWrench, FaLaughBeam } from 'react-icons/fa';
import TechnologyCard from './TechnologyCard';
import Modal from '../../components/common/Modal';
import ErrorTestContent from './ErrorTestContent';
import Entertaining404Content from './Entertaining404Content';

interface Feature {
  id: string;
  category: string;
  icon: React.ReactElement;
  content: React.ReactElement;
  title?: string;
}

const AboutThisSite: React.FC = () => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState<number | null>(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isFeatureModalExpanded, setIsFeatureModalExpanded] = useState(true);
  const [triggerOverflowCheck, setTriggerOverflowCheck] = useState(0);

  const modalFeatures = [
    {
      id: 'error-handling',
      category: 'Error Handling',
      icon: <FaBug className="text-4xl text-error mb-4" aria-hidden="true" />,
      content: (
        <ErrorTestContent onClose={() => setIsFeatureModalOpen(false)} />
      ),
    },
    {
      id: 'entertaining-404',
      category: 'Entertaining 404 Page',
      icon: <FaLaughBeam className="text-4xl text-warning mb-4" aria-hidden="true" />,
      content: <Entertaining404Content />
    },
  ];

  const allFeatures = [
    ...modalFeatures,
    {
      id: 'coming-soon',
      category: 'Coming Soon',
      icon: <FaWrench className="text-4xl text-base-content mb-4" aria-hidden="true" />,
      content: <p>This feature is currently under development.</p>,
    },
  ];

  const handleFeatureClick = (feature: Feature) => {
    if (feature.id === 'coming-soon') return;
    setCurrentFeatureIndex(modalFeatures.findIndex(f => f.id === feature.id));
    setIsFeatureModalOpen(true);
  };

  const closeFeatureModal = () => {
    setIsFeatureModalOpen(false);
  };

  const handleFeatureNext = () => {
    setCurrentFeatureIndex((prevIndex) =>
      prevIndex === null
        ? 0
        : (prevIndex + 1) % modalFeatures.length
    );
  };

  const handleFeaturePrevious = () => {
    setCurrentFeatureIndex((prevIndex) =>
      prevIndex === null
        ? modalFeatures.length - 1
        : (prevIndex - 1 + modalFeatures.length) % modalFeatures.length
    );
  };

  const toggleFeatureModalExpand = () => {
    setIsFeatureModalExpanded(!isFeatureModalExpanded);
    setTriggerOverflowCheck(prev => prev + 1);
  };

  return (
    <main aria-label="About This Site Section" className="flex flex-col items-center justify-center w-full p-6">
      {/* Heading aligned with About page styling */}
      <section 
        aria-labelledby="about-this-site-heading"
        className="w-full max-w-3xl text-center mb-10 pt-4"
      >
        <h1 
          id="about-this-site-heading" 
          className="text-4xl font-bold mb-4"
        >
          About This Site
        </h1>
      </section>

      {/* Technologies Section */}
      <section className="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Technologies Used</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <TechnologyCard
            icon={<FaReact className="text-4xl text-info mb-2" aria-hidden="true" />}
            title="React"
            description="Fast, component-based UI development"
            link="https://reactjs.org"
          />
          <TechnologyCard
            icon={<FaCode className="text-4xl text-info mb-2" aria-hidden="true" />}
            title="TypeScript"
            description="Type-safe development environment"
            link="https://www.typescriptlang.org"
          />
          <TechnologyCard
            icon={<FaLayerGroup className="text-4xl text-info mb-2" aria-hidden="true" />}
            title="Tailwind CSS & DaisyUI"
            description="Utility-first CSS framework"
            link="https://daisyui.com"
          />
          <TechnologyCard
            icon={<FaGithub className="text-4xl text-info mb-2" aria-hidden="true" />}
            title="GitHub Pages"
            description="For static site deployment"
            link="https://pages.github.com"
          />
          <TechnologyCard
            icon={<FaTools className="text-4xl text-info mb-2" aria-hidden="true" />}
            title="Vite"
            description="Fast development builds"
            link="https://vitejs.dev"
          />
        </div>
      </section>

      {/* Site Features Section */}
      <section className="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Site Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allFeatures.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center">
              {feature.icon}
              <h3 className="font-semibold mb-2">{feature.category}</h3>
              <button
                className="btn btn-sm mt-4"
                onClick={() => handleFeatureClick(feature)}
                aria-label={`Learn more about ${feature.category}`}
                data-testid={`learn-more-${feature.id}`}
                disabled={feature.id === 'coming-soon'}
              >
                {feature.id === 'coming-soon' ? 'Under Construction' : 'Learn More'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {currentFeatureIndex !== null && (
        <Modal
          isOpen={isFeatureModalOpen}
          onClose={closeFeatureModal}
          title={modalFeatures[currentFeatureIndex].category}
          content={modalFeatures[currentFeatureIndex].content}
          onNext={handleFeatureNext}
          onPrevious={handleFeaturePrevious}
          totalPages={modalFeatures.length}
          currentPage={currentFeatureIndex}
          isExpanded={isFeatureModalExpanded}
          onToggleExpand={toggleFeatureModalExpand}
          triggerOverflowCheck={triggerOverflowCheck}
        />
      )}

      {/* GitHub Source Code Section */}
      <section className="flex justify-center items-center mt-6 mb-12">
        <button
          className="btn btn-primary inline-flex items-center"
          onClick={() => window.open('https://github.com/shawnkhoffman/shawnkhoffman.github.io', '_blank')}
          aria-label="View the source code on GitHub"
        >
          <FaGithub className="mr-2" aria-hidden="true" />
          View Source Code
        </button>
      </section>
    </main>
  );
};

export default AboutThisSite;
