interface CareerTimelineItemProps {
  date: string;
  title: string;
  description: string;
  isEven?: boolean;
}

export default function CareerTimelineItem({ date, title, description, isEven = false }: CareerTimelineItemProps) {
  return (
    <li data-testid="timeline-item" role="listitem" tabIndex={0}>
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
          data-testid="decorative-icon"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className={`${isEven ? 'timeline-end' : 'timeline-start'} mb-10 md:${isEven ? 'text-start' : 'text-end'}`}>
        <time className="font-mono italic">{date}</time>
        <h3 className="text-lg font-black">{title}</h3>
        <p data-testid="timeline-description">{description}</p>
      </div>
      <hr />
    </li>
  );
}
