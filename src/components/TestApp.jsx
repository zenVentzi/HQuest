import React, { Fragment, Component } from 'react';
import { Transition } from 'react-spring';

const A = ({ bla, destroyed, ...style }) => {
  console.log(`a`);
  if (destroyed) {
    console.log(`dstr`);
  }
  // console.log(style);

  return <div style={style}>a</div>;
};

// onClick={this.toggle}

const B = style => {
  const holder = 5;
  // console.log(`b`);
  // console.log(this.state.toggle);

  return <div style={style}>b</div>;
};

class TestApp extends Component {
  state = {
    toggle: true,
  };

  toggle = () => {
    this.setState(state => ({ toggle: !state.toggle }));
  };
  render() {
    const { toggle } = this.state;

    return (
      <Fragment>
        <Transition
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
          bla={5}
        >
          {toggle ? A : B}
        </Transition>
        <button onClick={this.toggle}> Toggle </button>
      </Fragment>
    );
  }
}

export default TestApp;
