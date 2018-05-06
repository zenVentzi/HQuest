import React from 'react';
// import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Content from './Content';

const App = (props) => (
  <div>
    <Navbar />
    <Content />
  </div>
);

export default App;

// App.propTypes = {
//   name: PropTypes.string,
// };

// App.defaultProps = {
//   name: 'john',
// };
