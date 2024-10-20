import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CareerTimeline, { CareerTimelineData } from '../../../pages/About/CareerTimeline';
import '@testing-library/jest-dom';

vi.mock('../../../pages/About/CareerTimelineItem', () => ({
  default: ({ date, title, description, position }: CareerTimelineData) => (
    <li data-testid="career-timeline-item">
      <span data-testid="date">{date}</span>
      <h3 data-testid="title">{title}</h3>
      <p data-testid="description">{description}</p>
      <span data-testid="position">{position}</span>
    </li>
  ),
}));

describe('CareerTimeline', () => {
  it('renders with default timeline data', () => {
    render(<CareerTimeline />);
    
    expect(screen.getByText('Career Timeline')).toBeInTheDocument();
    
    const timelineItems = screen.getAllByTestId('career-timeline-item');
    expect(timelineItems).toHaveLength(8);
  });

  it('renders with custom timeline data', () => {
    const customData: CareerTimelineData[] = [
      {
        date: '2025 - Present',
        title: 'Senior Developer - Company A',
        description: 'Leading development projects.',
        position: 'start',
      },
      {
        date: '2022 - 2025',
        title: 'Developer - Company B',
        description: 'Worked on various web applications.',
        position: 'end',
      },
    ];

    render(<CareerTimeline timelineData={customData} />);
    
    expect(screen.getByText('Career Timeline')).toBeInTheDocument();
    
    const timelineItems = screen.getAllByTestId('career-timeline-item');
    expect(timelineItems).toHaveLength(2);

    customData.forEach(item => {
      expect(screen.getByText(item.date)).toBeInTheDocument();
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  it('applies correct CSS classes to the container', () => {
    render(<CareerTimeline />);
    const container = screen.getByText('Career Timeline').closest('div');
    expect(container).toHaveClass('w-full', 'max-w-5xl', 'mb-10', 'p-6', 'bg-base-100', 'rounded-lg', 'shadow-lg');
  });

  it('renders the timeline with correct structure', () => {
    render(<CareerTimeline />);
    const timeline = screen.getByRole('list');
    expect(timeline).toHaveClass('timeline', 'timeline-snap-icon', 'max-md:timeline-compact', 'timeline-vertical');
  });

  it('passes correct props to CareerTimelineItem', () => {
    render(<CareerTimeline />);
    
    const dates = screen.getAllByTestId('date');
    const titles = screen.getAllByTestId('title');
    const descriptions = screen.getAllByTestId('description');
    const positions = screen.getAllByTestId('position');

    expect(dates[0]).toHaveTextContent('2024 - Present');
    expect(titles[0]).toHaveTextContent('Senior Software Engineer - Crunchyroll');
    expect(descriptions[0]).toHaveTextContent('Developing next generation video streaming experience for millions of concurrent users.');
    expect(positions[0]).toHaveTextContent('start');
  });
});