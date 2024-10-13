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
      title: 'Senior Software Engineer - Crunchyroll',
      description: 'Developing next generation video streaming experience for millions of concurrent users.',
      position: 'start',
    },
    {
      date: '2021 - 2023',
      title: 'Staff Systems Reliability Engineer - Disney Studios',
      description: 'Developed cloud services and MLOps, and led end-to-end systems reliability, for Disney film production studios, StudioLab, and Disney Research.',
      position: 'end',
    },
    {
      date: '2019 - 2021',
      title: 'Lead Consultant - HPE Services',
      description: 'Led cloud platform engineering and software development projects for Fortune 500 enterprise clients.',
      position: 'start',
    },
    {
      date: '2016 - 2019',
      title: 'Senior DevOps Engineer - Rackspace',
      description: 'Built and maintained cloud software for Fortune 500 enterprise clients.',
      position: 'end',
    },
    {
      date: '2013 - 2016',
      title: 'Senior System Engineer - U.S. Department of Veterans Affairs',
      description: 'Managed cloud infrastructure and systems for VA hospitals and clinics.',
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
      title: 'System Engineer - U.S. Army',
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
