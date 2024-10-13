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
      title: 'Streaming Services - Crunchyroll',
      description: 'Developed bleeding edge video streaming experience for millions of concurrent users.',
      position: 'start',
    },
    {
      date: '2021 - 2023',
      title: 'AI/ML, Film Production, and Streaming Services - Disney Studios',
      description: 'Developed cloud services and MLOps, and led end-to-end systems reliability, for Disney film production studios, StudioLab, and Disney Research.',
      position: 'end',
    },
    {
      date: '2019 - 2021',
      title: 'AI/ML & Cloud Infrastructure Consulting - HPE Services',
      description: 'Led cloud platform engineering and software development projects for Fortune 500 enterprise clients.',
      position: 'start',
    },
    {
      date: '2015 - 2019',
      title: 'Cloud Software & DevOps Consulting - Rackspace',
      description: 'Built and maintained cloud software for Fortune 500 enterprise clients.',
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
      title: 'Web Development - RWI Studios',
      description: 'Built and maintained client web apps, introducing early CI/CD and hosting automation practices that laid groundwork for future DevOps work.',
      position: 'start',
    },
    {
      date: '2009 - 2011',
      title: 'Internet Network Engineering - Frontier Internet',
      description: 'Built and supported ISP infrastructure, improving uptime and helping modernize network configuration processes.',
      position: 'end',
    },
    {
      date: '2004 - 2007',
      title: 'Linux Server Administration - TigerDirect',
      description: 'Managed servers and internal systems, hardening security and introducing early automation tools.',
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
