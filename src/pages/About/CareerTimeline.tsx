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
      date: '2024 - 2025',
      title: 'Senior Software Engineer - Crunchyroll',
      description: 'Developed the next generation video streaming experience for millions of concurrent users during high-traffic content releases like Demon Slayer, Kaiju No. 8, and Dragon Ball Daima.',
      position: 'start',
    },
    {
      date: '2021 - 2023',
      title: 'Staff Software Engineer - Disney Research',
      description: 'Using AI/ML, automated video post-production and quality control for Disney, Lucasfilm, Marvel, and Pixar films, enhancing theatrical and streaming experiences on Disney+ and Hulu.',
      position: 'end',
    },
    {
      date: '2019 - 2021',
      title: 'Lead Software Engineer - HPE Services',
      description: 'Developed cloud self-service platforms, enabling enterprises to deploy and manage infrastructure faster, reducing downtime and improving scalability for business-critical applications.',
      position: 'start',
    },
    {
      date: '2016 - 2019',
      title: 'Senior DevOps Engineer - Rackspace',
      description: 'Optimized cloud deployments for enterprise clients, improving reliability, reducing costs, and ensuring seamless application performance for millions of end users.',
      position: 'end',
    },
    {
      date: '2013 - 2016',
      title: 'Senior System Engineer - U.S. Department of Veterans Affairs',
      description: 'Improved healthcare system reliability and security, ensuring medical staff could provide care without disruption and patients had uninterrupted access to critical medical services.',
      position: 'start',
    },
    {
      date: '2012 - 2016',
      title: 'Bachelor of Science in Computer Science - University of Texas at Austin',
      description: 'Graduated with honors and completed undergraduate research on unmanned space exploration using hydrogen fuel cell technology with NASA.',
      position: 'start',
    },
    {
      date: '2005 - 2013',
      title: 'Systems Engineer - U.S. Army',
      description: 'Maintained secure communications systems and network infrastructure for military operations.',
      position: 'end',
    },
    {
      date: '2004 - 2005',
      title: 'System Administrator - CompUSA',
      description: 'Managed network infrastructure and system administration for retail operations.',
      position: 'start',
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
