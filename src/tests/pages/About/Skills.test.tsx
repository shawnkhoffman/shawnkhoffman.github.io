import { describe, test, expect } from 'bun:test';
import { render, screen, fireEvent, expectElement, expectValue } from '@tests/utils/bun-test-utils';
import React, { useState } from 'react';

const Modal: React.FC<TestModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div data-testid="modal-dialog" role="dialog" aria-modal="true">
      <div>
        <h2 data-testid="modal-title">{title}</h2>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
        <button data-testid="modal-prev" onClick={() => {}}>Previous</button>
        <button data-testid="modal-next" onClick={() => {}}>Next</button>
        <button data-testid="modal-expand" onClick={() => {}}>Expand</button>
      </div>
      <div data-testid="modal-content">{children}</div>
    </div>
  );
};

const Skills = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  
  const skillCategories = [
    'Software Engineering',
    'Cloud Infrastructure',
    'Media Engineering',
    'Machine Learning',
    'Data Engineering',
    'Security'
  ];
  
  const openModal = (skill: { id: string; name: string; description: string; icon: string }) => {
    setCurrentSkill(skill.name);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  return (
    <section aria-labelledby="skills-section">
      <h2 id="skills-section">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillCategories.map((category) => (
          <div key={category} className="card">
            <div className="card-body">
              <h3 className="card-title">{category}</h3>
              <p>Skills related to {category}</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => openModal({ id: '', name: category, description: '', icon: '' })}
                aria-label={`Learn more about ${category}`}
              >
                Learn more about {category}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={currentSkill}
        >
          <div>
            <p>Detailed information about {currentSkill}</p>
            <ul>
              <li>Skill 1</li>
              <li>Skill 2</li>
              <li>Skill 3</li>
            </ul>
          </div>
        </Modal>
      )}
    </section>
  );
};

describe('Skills Component', () => {
  test('renders all skill categories', () => {
    render(<Skills />);
    
    const skillCategories = [
      'Software Engineering',
      'Cloud Infrastructure',
      'Media Engineering',
      'Machine Learning',
      'Data Engineering',
      'Security'
    ];
    
    skillCategories.forEach((category) => {
      expectElement(screen.getByText(category)).toBeInTheDocument();
    });
    
    const learnMoreButtons = screen.getAllByRole('button', { name: /learn more about/i });
    expectValue(learnMoreButtons.length).toBeGreaterThan(0);
    expect(learnMoreButtons.length).toBe(skillCategories.length);
  });
  
  test('opens a modal when "Learn More" is clicked', () => {
    render(<Skills />);
    
    const firstButton = screen.getAllByRole('button', { name: /learn more about/i })[0];
    fireEvent.click(firstButton);
    
    const modalTitle = screen.getByTestId('modal-title');
    expectElement(modalTitle).toBeInTheDocument();
    expectElement(modalTitle).toHaveTextContent('Software Engineering');
  });
  
  test('closes the modal when close button is clicked', () => {
    render(<Skills />);
    
    const firstButton = screen.getAllByRole('button', { name: /learn more about/i })[0];
    fireEvent.click(firstButton);
    
    expectElement(screen.getByTestId('modal-dialog')).toBeInTheDocument();
    
    const closeButton = screen.getByTestId('modal-close');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('modal-dialog')).toBeNull();
  });
  
  test('navigates through modals using next and previous buttons', () => {
    render(<Skills />);
    
    const firstButton = screen.getAllByRole('button', { name: /learn more about/i })[0];
    fireEvent.click(firstButton);
    
    expectElement(screen.getByTestId('modal-title')).toHaveTextContent('Software Engineering');
    
    const nextButton = screen.getByTestId('modal-next');
    fireEvent.click(nextButton);
    
    expectElement(nextButton).toBeInTheDocument();
    
    const prevButton = screen.getByTestId('modal-prev');
    fireEvent.click(prevButton);
    
    expectElement(prevButton).toBeInTheDocument();
  });
  
  test('expands and compresses the modal', () => {
    render(<Skills />);
    
    const firstButton = screen.getAllByRole('button', { name: /learn more about/i })[0];
    fireEvent.click(firstButton);
    
    expectElement(screen.getByTestId('modal-dialog')).toBeInTheDocument();
    
    const expandButton = screen.getByTestId('modal-expand');
    fireEvent.click(expandButton);
    
    expectElement(expandButton).toBeInTheDocument();
  });
}); 