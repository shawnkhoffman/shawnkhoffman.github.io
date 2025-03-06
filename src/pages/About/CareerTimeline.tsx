import React from 'react';
import CareerTimelineItem from './CareerTimelineItem';

export interface CareerTimelineData {
  date: string;
  title: string;
  description: string;
  position: 'start' | 'end';
}

interface CareerTimelineProps {
  timelineData?: CareerTimelineData[];
}

const CareerTimeline: React.FC<CareerTimelineProps> = ({ timelineData }) => {
  const defaultTimelineData: CareerTimelineData[] = [
    {
      date: '2024 - Present',
      title: 'Senior Platform Engineer - Crunchyroll',
      description: 'Using cloud infrastructure, developed the next generation video streaming experience for millions of concurrent users during high-traffic content releases like Demon Slayer, Kaiju No. 8, and Dragon Ball Daima.',
      position: 'start',
    },
    {
      date: '2021 - 2023',
      title: 'Staff SRE in AI/ML - Disney Research',
      description: 'Designed and optimized reliable, high-performance infrastructure for machine learning workflows that automated video post-production and quality control for Disney, Lucasfilm, Marvel, and Pixar films, enhancing theatrical and streaming experiences on Disney+ and Hulu.',
      position: 'end',
    },
    {
      date: '2019 - 2021',
      title: 'Lead PLatform Engineer - HPE Services',
      description: 'Developed cloud self-service infrastructure platforms, enabling enterprises to deploy and manage infrastructure faster, reducing downtime and improving scalability for business-critical applications.',
      position: 'start',
    },
    {
      date: '2015 - 2019',
      title: 'Senior DevOps Engineer - Rackspace',
      description: 'Optimized cloud infrastructure deployments for enterprise clients, improving reliability, reducing costs, and ensuring seamless application performance for millions of end users.',
      position: 'end',
    },
    {
      date: '2012 - 2016',
      title: 'Bachelor of Science in Computer Science - University of Texas at Austin',
      description: 'Graduated with honors and completed undergraduate research on unmanned space exploration using hydrogen fuel cell technology with NASA.',
      position: 'start',
    },
    {
      date: '2011 - 2014',
      title: 'Senior Web Developier - RWI Studios',
      description: 'Built, optimized, and maintained websites and web applications, ensuring functionality, responsiveness, and user-friendly experiences tailored to client needs.',
      position: 'end',
    },
    {
      date: '2009 - 2011',
      title: 'ISP Network Engineer - Frontier Internet',
      description: 'Maintained network infrastructure stability, scalability, and performance, enabling seamless connectivity for residential and business customers.',
      position: 'start',
    },
    {
      date: '2004 - 2007',
      title: 'System Administrator - TigerDirect Business',
      description: 'Managed network infrastructure and system administration for retail operations.',
      position: 'end',
    },
  ];

  const dataToRender = timelineData || defaultTimelineData;

  return (
    <div className="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Career Timeline</h2>
      <ul 
        className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical"
        aria-label="Career Timeline"
      >
        {dataToRender.map((item, index) => (
          <CareerTimelineItem
            key={index}
            date={item.date}
            title={item.title}
            description={item.description}
            position={item.position}
          />
        ))}
      </ul>
    </div>
  );
};

export default CareerTimeline;
