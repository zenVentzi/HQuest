import React from 'react';
import Navbar from './Navbar';
import Content from './Content';
import style from './css/app.css';

const App = props => (
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
