import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CareerTimeline, { CareerTimelineData } from '../../../pages/About/CareerTimeline';
import '@testing-library/jest-dom';

vi.mock('../../../pages/About/CareerTimelineItem', () => ({
  default: ({ date, title, description, position }: CareerTimelineData) => (
    <li data-testid="mocked-career-timeline-item">
      <span>{date}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{position}</span>
    </li>
  ),
}));

describe('CareerTimeline', () => {
  it('renders the Career Timeline component correctly with default data', () => {
    render(<CareerTimeline />);

    const container = screen.getByText('Career Timeline').closest('div');
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Career Timeline')).toBeInTheDocument();

    const timelineItems = screen.getAllByTestId('mocked-career-timeline-item');
    expect(timelineItems.length).toBeGreaterThan(0);
  });

  it('renders the Career Timeline component correctly with custom data', () => {
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

    const container = screen.getByText('Career Timeline').closest('div');
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Career Timeline')).toBeInTheDocument();

    const timelineItems = screen.getAllByTestId('mocked-career-timeline-item');
    expect(timelineItems.length).toBe(customData.length);

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
});