import React from 'react';

interface TechnologyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ icon, title, description, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center text-center hover:bg-base-200 p-4 rounded-lg transition duration-300"
      aria-label={`Learn more about ${title}`}
    >
      <span aria-hidden="true">{icon}</span>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm">{description}</p>
    </a>
  );
};

export default TechnologyCard;