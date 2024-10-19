import React from 'react';
import NotFound from '../404';

const Entertaining404Content: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-4 sm:p-6 overflow-auto">
      <div className="mb-6">
        <p className="mb-4 text-sm sm:text-base">
          The 404 page was designed to add a touch of humor and personality to an otherwise frustrating experience.
          Instead of a generic error message, the page randomly displays amusing messages and gifs, making it more
          enjoyable for users who may have navigated to a non-existent page. This approach aims to reduce user frustration
          and create a more engaging experience.
        </p>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center space-y-6">
        <div className="w-full max-w-full sm:max-w-md lg:max-w-lg bg-base-200 p-4 sm:p-6 rounded-lg shadow-md mx-auto">
          <NotFound />
        </div>
      </div>
      <div className="pb-10"></div>
    </div>
  );
};

export default Entertaining404Content;