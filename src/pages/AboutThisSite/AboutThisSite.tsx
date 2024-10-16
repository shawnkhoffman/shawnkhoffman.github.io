import React, { useState } from 'react';
import { FaReact, FaGithub, FaCode, FaLayerGroup, FaTools, FaBug, FaWrench, FaLaughBeam } from 'react-icons/fa';
import Modal from '../../components/common/Modal';
import ErrorTestModal from './ErrorTestModal';
import Entertaining404Modal from './Entertaining404Modal';
import TechnologyCard from './TechnologyCard';

const AboutThisSite: React.FC = () => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [is404ModalOpen, setIs404ModalOpen] = useState(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number | null>(null);

  const siteFeatures = [
    {
      id: 'error-handling',
      category: 'Error Handling',
      icon: <FaBug className="text-4xl text-error mb-4" />,
      onClick: () => setIsErrorModalOpen(true),
    },
    {
      id: 'entertaining-404',
      category: 'Entertaining 404 Page',
      icon: <FaLaughBeam className="text-4xl text-warning mb-4" />,
      onClick: () => setIs404ModalOpen(true),
    },
    {
      id: 'coming-soon',
      category: 'Coming Soon',
      icon: <FaWrench className="text-4xl text-content mb-4" />,
      onClick: () => {},
    },
  ];

  const toggleAccordion = (index: number) => {
    setActiveAccordionIndex(activeAccordionIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6">
      <h1 className="text-4xl font-bold mb-8">About This Site</h1>

      <section className="card w-full max-w-5xl mb-10 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-semibold mb-6 text-center">Technologies Used</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <TechnologyCard
              icon={<FaReact className="text-4xl text-info mb-2" />}
              title="React"
              description="Fast, component-based UI development"
              link="https://reactjs.org"
            />
            <TechnologyCard
              icon={<FaCode className="text-4xl text-info mb-2" />}
              title="TypeScript"
              description="Type-safe development environment"
              link="https://www.typescriptlang.org"
            />
            <TechnologyCard
              icon={<FaLayerGroup className="text-4xl text-info mb-2" />}
              title="Tailwind CSS & DaisyUI"
              description="Utility-first CSS framework"
              link="https://daisyui.com"
            />
            <TechnologyCard
              icon={<FaGithub className="text-4xl text-info mb-2" />}
              title="GitHub Pages"
              description="For static site deployment"
              link="https://pages.github.com"
            />
            <TechnologyCard
              icon={<FaTools className="text-4xl text-info mb-2" />}
              title="Vite"
              description="Fast development builds"
              link="https://vitejs.dev"
            />
          </div>
        </div>
      </section>

      <section className="card w-full max-w-5xl mb-10 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-semibold mb-6 text-center">Architecture & Design Patterns</h2>
          <div className="space-y-4">
            {[
              'Component-Based Architecture',
              'Context API for Global State',
              'Code Splitting & Lazy Loading',
            ].map((title, index) => (
              <div key={index} className="collapse collapse-arrow bg-base-200">
                <input
                  type="checkbox"
                  checked={activeAccordionIndex === index}
                  onChange={() => toggleAccordion(index)}
                />
                <div className="collapse-title text-xl font-medium">{title}</div>
                <div className="collapse-content">
                  <p>
                    {index === 0 &&
                      'Modularity and reusability are at the core of this architecture. Each feature is broken into isolated components.'}
                    {index === 1 &&
                      'The Context API manages state like theme switching without having to prop-drill through component trees.'}
                    {index === 2 &&
                      'To optimize performance, components are only loaded when needed using lazy loading and dynamic imports.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card w-full max-w-5xl mb-10 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-semibold mb-6 text-center">Site Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteFeatures.map((feature) => (
              <div key={feature.id} className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="font-semibold mb-2">{feature.category}</h3>
                <button className="btn btn-sm mt-4" onClick={feature.onClick} disabled={feature.id === 'coming-soon'}>
                  {feature.id === 'coming-soon' ? 'Under Construction' : 'Learn More'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isErrorModalOpen && (
        <Modal
          isOpen={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
          title="Error Handling"
          content={
            <div>
              <p>
                This site uses robust error handling practices to ensure the best user experience. The error-handling mechanism catches unexpected exceptions and provides user-friendly feedback.
              </p>
              <ErrorTestModal onClose={() => setIsErrorModalOpen(false)} />
            </div>
          }
        />
      )}

      {is404ModalOpen && <Entertaining404Modal onClose={() => setIs404ModalOpen(false)} />}

      <section className="flex justify-center items-center mt-6 mb-12">
        <button
          className="btn btn-primary inline-flex items-center"
          onClick={() => window.open('https://github.com/shawnkhoffman/shawnkhoffman.github.io', '_blank')}
        >
          <FaGithub className="mr-2" />
          View Source Code on GitHub
        </button>
      </section>
    </div>
  );
};

export default AboutThisSite;