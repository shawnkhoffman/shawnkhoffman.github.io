import React, { useState, useEffect, useRef } from 'react';
import {
  FaCode,
  FaCloud,
  FaVideo,
  FaBrain,
  FaShieldAlt,
  FaDatabase,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown
} from 'react-icons/fa';

const Skills: React.FC = () => {
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [showNavigationHint, setShowNavigationHint] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile('ontouchstart' in window || window.innerWidth <= 640);
    };
    checkIfMobile();
  }, []);

  const modals = [
    {
      id: 'software-engineering-modal',
      category: 'Software Engineering',
      icon: <FaCode className="text-5xl text-info mb-4" />,
      content: (
        <>
          <p>
            My career in software engineering began in the early days of the web. In 1996, I built my first websites using Microsoft FrontPage, and by high school in 2001, I transitioned to using Dreamweaver. This early exposure to web development laid the groundwork for my interest in coding and systems design.
          </p>
          <p>
            During my time at the University of Texas at Austin, I was involved in a NASA research project, where I independently programmed the controllers for an unmanned space exploration vehicle using C/C++. This gave me early exposure to problem-solving at scale and shaped my approach to systems engineering.
          </p>
          <p>
            Professionally, I got my start at Rackspace, working across projects involving Java, JavaScript, C#, and Python. My work ranged from full-stack web development to system-level programming. My experience has since evolved, focusing on scalable software solutions at Disney and Crunchyroll.
          </p>
        </>
      )
    },
    {
      id: 'cloud-infrastructure-modal',
      category: 'Cloud Infrastructure',
      icon: <FaCloud className="text-5xl text-info mb-4" />,
      content: (
        <>
          <p>
            I began working with cloud technologies in 2013 at the U.S. Department of Veterans Affairs, where I primarily worked with Microsoft Azure. My exposure to cloud infrastructure expanded when I joined Rackspace, where I worked with AWS, Kubernetes, Docker, Terraform, Ansible, and OpenStack to support enterprise clients.
          </p>
          <p>
            At HPE, I led cloud platform projects involving infrastructure as code and microservices on AWS and Azure. At Disney and Crunchyroll, I built large-scale, cloud-native applications that provide resilience and performance for millions of users globally.
          </p>
          <p>
            I gained significant experience in observability and monitoring, primarily using tools like DataDog, OpenTelemetry, and cloud-native monitoring solutions. Additionally, I've utilized OpsGenie and PagerDuty for incident response, ensuring quick recovery during critical outages.
          </p>
        </>
      )
    },
    {
      id: 'video-engineering-modal',
      category: 'Media Engineering',
      icon: <FaVideo className="text-5xl text-info mb-4" />,
      content: (
        <>
          <p>
            My media engineering journey began at Rackspace, where I worked with clients in the media industry. I gained expertise in video streaming technologies like FFmpeg, HLS, and DASH. At Disney, I contributed to streaming projects for Disney+ and Hulu, and at Crunchyroll, I have continued to optimize video delivery for millions of concurrent users globally.
          </p>
        </>
      )
    },
    {
      id: 'machine-learning-modal',
      category: 'Machine Learning',
      icon: <FaBrain className="text-5xl text-info mb-4" />,
      content: (
        <>
          <p>
            My work in machine learning began at HPE, where I helped build MLOps pipelines using AWS and Azure services. At Disney, I worked closely with research teams on AI/ML projects, refining my skills in building and deploying machine learning models using TensorFlow, PyTorch, and MLFlow.
          </p>
          <p>
            My focus has included MLOps, computer vision tasks, and recommendation systems that enhance user experiences on streaming platforms like Disney+ and Hulu.
          </p>
        </>
      )
    },
    {
      id: 'data-engineering-modal',
      category: 'Data Engineering',
      icon: <FaDatabase className="text-5xl text-info mb-4" />,
      content: (
        <>
          <p>
            My data engineering journey started at HPE, where I built ETL pipelines using Apache Kafka and Airflow. I focused on ensuring data scalability and processing efficiency across large systems. At Disney, I integrated Confluent Kafka and Spark to enhance data workflows for projects like Disney+ and Hulu.
          </p>
        </>
      )
    },
    {
      id: 'security-modal',
      category: 'Security',
      icon: <FaShieldAlt className="text-5xl text-info mb-4" />,
      content: (
        <>
          <p>
            My experience in security spans application and infrastructure security, focusing on static code analysis, vulnerability management, and secure cloud deployments. I've worked with tools like OWASP Zap, Veracode, and Snyk to secure systems across different platforms, ensuring compliance with industry standards.
          </p>
          <p>
            In addition to my development and security work, I've been involved in several post-incident investigations, including those following security incidents such as denial of service attacks and data breaches. During my time at Crunchyroll, I've successfully shut down numerous piracy sites and apps, protecting intellectual property and ensuring secure distribution of media content. I've helped organizations identify vulnerabilities and strengthen their defenses after such offensive acts, building a more resilient security posture.
          </p>
          <p>
            My incident response expertise also extends to observability and monitoring. By leveraging tools like DataDog and OpenTelemetry, I ensured real-time visibility into system performance and quickly addressed security incidents. I've also worked with OpsGenie to manage alerts and coordinate incident response across teams.
          </p>
        </>
      )
    }
  ];

  const showModal = (index: number) => {
    setCurrentModalIndex(index);
    setIsModalOpen(true);
    setShowScrollIndicator(true);
    setTimeout(checkContentOverflow, 100);
    if (!isMobile) setShowNavigationHint(true);
  };

  const closeModal = () => {
    setCurrentModalIndex(null);
    setIsModalOpen(false);
    setShowScrollIndicator(false);
    setShowNavigationHint(false);
  };

  const checkContentOverflow = () => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setIsContentOverflowing(isOverflowing);
    }
  };

  const handleUserInteraction = () => {
    setShowScrollIndicator(false);
    setShowNavigationHint(false);
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop > 0 || scrollTop + clientHeight >= scrollHeight) {
        handleUserInteraction();
      }
    }
  };

  const handleNext = () => {
    setCurrentModalIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      return (prevIndex + 1) % modals.length;
    });
    setShowScrollIndicator(true);
    setTimeout(checkContentOverflow, 100);
  };

  const handlePrevious = () => {
    setCurrentModalIndex((prevIndex) => {
      if (prevIndex === null) return modals.length - 1;
      return (prevIndex - 1 + modals.length) % modals.length;
    });
    setShowScrollIndicator(true);
    setTimeout(checkContentOverflow, 100);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current !== null) {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartXRef.current - touchEndX;
        if (diffX > 50) handleNext();
        if (diffX < -50) handlePrevious();
      }
    };

    if (isMobile && isModalOpen) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isModalOpen]);

  return (
    <div className="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg relative">
      <h2 className="text-4xl font-semibold text-center mb-10">Skills</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modals.map((modal, index) => (
          <div key={modal.id} className="flex flex-col items-center text-center">
            {modal.icon}
            <h3 className="text-2xl font-semibold mb-2">{modal.category}</h3>
            <button className="btn btn-sm mt-4" onClick={() => showModal(index)}>
              Learn More
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && currentModalIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOutsideClick}
        >
          <div className="relative w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] h-[80vh] sm:h-[70vh] md:h-[60vh] flex flex-col bg-base-100 rounded-lg shadow-xl">
            {/* Navigation Arrows (only on desktop) */}
            {!isMobile && (
              <>
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 p-2 text-5xl text-neutral-content hover:text-info hidden md:block tooltip tooltip-left"
                  data-tip="Previous"
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                  aria-label="Previous skill"
                >
                  <FaChevronLeft className="text-5xl" />
                </button>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 p-2 text-5xl text-neutral-content hover:text-info hidden md:block tooltip tooltip-right"
                  data-tip="Next"
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  aria-label="Next skill"
                >
                  <FaChevronRight className="text-5xl" />
                </button>
              </>
            )}

            {/* Modal Content */}
            <div ref={modalRef} className="flex flex-col h-full">
              <div
                ref={contentRef}
                className="p-6 flex-grow overflow-y-auto relative"
                onScroll={handleScroll}
              >
                <h2 className="text-2xl font-semibold mb-4">
                  {modals[currentModalIndex].category}
                </h2>
                <div className="space-y-4 text-base-content leading-relaxed">
                  {modals[currentModalIndex].content}
                </div>

                {/* Scroll Indicator */}
                {isContentOverflowing && showScrollIndicator && (
                  <div className="absolute bottom-2 right-2 bg-base-200 p-2 rounded-lg flex items-center space-x-2">
                    <FaChevronDown className="animate-bounce text-xl text-info" />
                    <span className="text-sm text-info">Scroll down to see more</span>
                  </div>
                )}

                {/* Navigation Hint (desktop only) */}
                {!isMobile && showNavigationHint && (
                  <div className="absolute bottom-2 left-2 bg-base-200 p-2 rounded-lg flex items-center space-x-2">
                    <span className="text-sm text-info">Use ← → arrow keys to navigate</span>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-base-300 flex justify-between items-center">
                <button className="btn btn-sm md:hidden" onClick={handlePrevious}>
                  Previous
                </button>
                <button className="btn btn-sm" onClick={closeModal}>
                  Close
                </button>
                <button className="btn btn-sm md:hidden" onClick={handleNext}>
                  Next
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 flex space-x-2">
                {modals.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      currentModalIndex === index ? 'bg-info' : 'bg-neutral-content'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;