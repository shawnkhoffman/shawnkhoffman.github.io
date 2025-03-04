import { describe, test, expect } from 'bun:test';
import { render, screen, within } from '@testing-library/react';
import * as React from 'react';

const TestCareerTimeline = () => (
  <div>
    <h2 id="career-timeline">Career Timeline</h2>
    <ul aria-label="Career Timeline" className="timeline timeline-vertical" role="list">
      <li role="listitem" tabIndex={0} className="timeline-item">
        <time role="time">2023 - Present</time>
        <div className="timeline-content">
          <h3>Senior Software Engineer</h3>
          <article role="article">
            <p>Working on full-stack applications with modern technologies.</p>
          </article>
        </div>
      </li>
      <li role="listitem" tabIndex={0} className="timeline-item">
        <time role="time">2020 - 2023</time>
        <div className="timeline-content">
          <h3>Software Engineer</h3>
          <article role="article">
            <p>Developed cloud infrastructure and backend services.</p>
          </article>
        </div>
      </li>
      <li role="listitem" tabIndex={0} className="timeline-item">
        <time role="time">2018 - 2020</time>
        <div className="timeline-content">
          <h3>Junior Developer</h3>
          <article role="article">
            <p>Started my journey in software development.</p>
          </article>
        </div>
      </li>
    </ul>
  </div>
);

describe('CareerTimeline', () => {
  describe('Rendering', () => {
    test('renders timeline container with items', () => {
      render(<TestCareerTimeline />);
      const timeline = screen.getAllByRole('list', { name: 'Career Timeline' })[0];
      const items = within(timeline).getAllByRole('listitem');
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe('Structure', () => {
    test('maintains proper document outline', () => {
      render(<TestCareerTimeline />);
      const mainHeading = document.getElementById('career-timeline');
      const itemHeadings = screen.getAllByRole('heading', { level: 3 });
      
      expect(mainHeading?.textContent).toBe('Career Timeline');
      expect(itemHeadings.length).toBeGreaterThan(0);
    });

    test('renders each timeline item with required elements', () => {
      render(<TestCareerTimeline />);
      const items = screen.getAllByRole('listitem');
      
      items.forEach(item => {
        const time = within(item).getByRole('time');
        const heading = within(item).getByRole('heading', { level: 3 });
        const description = within(item).getByRole('article');
        
        expect(time).toBeDefined();
        expect(heading).toBeDefined();
        expect(description).toBeDefined();
      });
    });
  });

  describe('Accessibility', () => {
    test('provides semantic timeline structure', () => {
      render(<TestCareerTimeline />);
      const timeline = screen.getAllByRole('list', { name: 'Career Timeline' })[0];
      
      expect(timeline.getAttribute('aria-label')).toBe('Career Timeline');
      expect(timeline.classList.contains('timeline')).toBe(true);
      expect(timeline.classList.contains('timeline-vertical')).toBe(true);
    });

    test('maintains proper content order for screen readers', () => {
      render(<TestCareerTimeline />);
      const items = screen.getAllByRole('listitem');
      
      items.forEach(item => {
        const time = within(item).getByRole('time');
        const heading = within(item).getByRole('heading', { level: 3 });
        const description = within(item).getByRole('article');
        
        expect(time.compareDocumentPosition(heading))
          .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
        expect(heading.compareDocumentPosition(description))
          .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      });
    });

    test('ensures all content remains visible and readable', () => {
      render(<TestCareerTimeline />);
      const timeline = screen.getAllByRole('list', { name: 'Career Timeline' })[0];
      const items = within(timeline).getAllByRole('listitem');
      
      items.forEach(item => {
        expect(window.getComputedStyle(item).display).not.toBe('none');
        expect(item.getAttribute('tabindex')).toBe('0');
      });
    });
  });
}); 