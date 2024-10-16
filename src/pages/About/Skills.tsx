import React, { useState, useEffect } from 'react';
import {
  FaCode,
  FaCloud,
  FaVideo,
  FaBrain,
  FaShieldAlt,
  FaDatabase,
} from 'react-icons/fa';
import Modal from '../../components/common/Modal';

const Skills: React.FC = () => {
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      icon: <FaCode className="text-4xl text-info mb-4" />,
      content: (
        <>
          <p className="mb-4">
            My career in software engineering began in the early days of the web. In 1996, I built my first websites using Microsoft FrontPage, and by high school in 2001, I transitioned to using Dreamweaver. This early exposure to web development laid the groundwork for my interest in coding and systems design.
          </p>
          <p className="mb-4">
            During my time at the University of Texas at Austin, I was involved in a NASA research project, where I independently programmed the controllers for an unmanned space exploration vehicle using C/C++. This gave me early exposure to problem-solving at scale and shaped my approach to systems engineering.
          </p>
        </>
      ),
    },
    {
      id: 'cloud-infrastructure-modal',
      category: 'Cloud Infrastructure',
      icon: <FaCloud className="text-4xl text-info mb-4" />,
      content: (
        <>
          <p className="mb-4">
            I began working with cloud technologies in 2013 at the U.S. Department of Veterans Affairs, where I primarily worked with Microsoft Azure. My exposure to cloud infrastructure expanded when I joined Rackspace, where I worked with AWS, Kubernetes, Docker, Terraform, Ansible, and OpenStack to support enterprise clients.
          </p>
        </>
      ),
    },
    {
      id: 'video-engineering-modal',
      category: 'Media Engineering',
      icon: <FaVideo className="text-4xl text-info mb-4" />,
      content: (
        <>
          <p className="mb-4">
            My media engineering journey began at Rackspace, where I worked with clients in the media industry. I gained expertise in video streaming technologies like FFmpeg, HLS, and DASH. At Disney, I contributed to film production technologies for Lucasfilm, Marvel Studios, Pixar, and others, and to streaming projects for Disney+ and Hulu. At Crunchyroll, I have continued to optimize video delivery for millions of concurrent users globally.
          </p>
        </>
      ),
    },
    {
      id: 'machine-learning-modal',
      category: 'Machine Learning',
      icon: <FaBrain className="text-4xl text-info mb-4" />,
      content: (
        <>
          <p className="mb-4">
            My work in machine learning began at HPE, where I helped build MLOps pipelines using AWS and Azure services. At Disney, I worked closely with research teams on AI/ML projects, refining my skills in building and deploying machine learning models using TensorFlow, PyTorch, and MLFlow.
          </p>
        </>
      ),
    },
    {
      id: 'data-engineering-modal',
      category: 'Data Engineering',
      icon: <FaDatabase className="text-4xl text-info mb-4" />,
      content: (
        <>
          <p className="mb-4">
            My data engineering journey started at HPE, where I built ETL pipelines using Apache Kafka and Airflow. I focused on ensuring data scalability and processing efficiency across large systems. At Disney, I integrated Confluent Kafka and Spark to enhance data workflows for projects like Disney+ and Hulu.
          </p>
        </>
      ),
    },
    {
      id: 'security-modal',
      category: 'Security',
      icon: <FaShieldAlt className="text-4xl text-info mb-4" />,
      content: (
        <>
          <p className="mb-4">
            My experience in security spans application and infrastructure security, focusing on static code analysis, vulnerability management, and secure cloud deployments. I've worked with tools like OWASP ZAP, Veracode, and Snyk to secure systems across different platforms, ensuring compliance with industry standards.
          </p>
        </>
      ),
    },
  ];

  const showModal = (index: number) => {
    setCurrentModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    setCurrentModalIndex((prevIndex) =>
      prevIndex === null ? 0 : (prevIndex + 1) % modals.length
    );
  };

  const handlePrevious = () => {
    setCurrentModalIndex((prevIndex) =>
      prevIndex === null ? modals.length - 1 : (prevIndex - 1 + modals.length) % modals.length
    );
  };

  return (
    <div className="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Skills</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {modals.map((modal, index) => (
          <div key={modal.id} className="flex flex-col items-center text-center">
            {modal.icon}
            <h3 className="font-semibold mb-2">{modal.category}</h3>
            <button className="btn btn-sm mt-4" onClick={() => showModal(index)}>
              Learn More
            </button>
          </div>
        ))}
      </div>

      {currentModalIndex !== null && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modals[currentModalIndex].category}
          content={modals[currentModalIndex]?.content}
          onNext={handleNext}
          onPrevious={handlePrevious}
          totalPages={modals.length}
          currentPage={currentModalIndex}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default Skills;