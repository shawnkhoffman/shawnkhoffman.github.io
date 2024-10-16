import React from 'react';

interface TechnologyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ icon, title, description, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center hover:bg-base-200 p-4 rounded-lg transition duration-300">
      {icon}
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{description}</p>
    </a>
  );
};

export default TechnologyCard;