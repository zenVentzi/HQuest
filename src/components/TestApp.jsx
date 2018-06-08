import React from 'react';
import ToggleBtn from './reusable/ToggleBtn';

const App = () => {
  const test = 5;

  return (
    <div>
      <ToggleBtn 
        offText="Answered"
        onText="Unanswered"
      />
    </div>
  );
};

export default App;
