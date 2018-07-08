import React, { Component } from 'react';
import { IN, OUT, Animator } from './FadeAnimator';

const FIRST = 0;
const SECOND = 1;

export class AnimToggler extends Component {
  state = { FirstVisible: true, SecondVisible: false };

  shouldComponentUpdate(nextProps, nextState) {
    const stateToggled = this.props.showFirst !== nextProps.showFirst;

    if (stateToggled) {
      return true;
    }
    const firstAppearance = this.state.FirstVisible && nextState.FirstVisible;

    if (firstAppearance) {
      return false;
    }
    return true;
  }

  onFadeIn = child => () => {
    const newState = { ...this.state };

    if (child === FIRST) {
      newState.FirstVisible = true;
    } else {
      newState.SecondVisible = true;
    }

    this.setState(newState);
  };

  onFadedOut = child => () => {
    const newState = { ...this.state };

    if (child === FIRST) {
      newState.FirstVisible = false;
    } else {
      newState.SecondVisible = false;
    }

    this.setState(newState);
  };

  fade(action, child) {
    const Child = this.props.children[child];

    return (
      <Animator
        action={action}
        onFadeIn={this.onFadeIn(child)}
        onFadedOut={this.onFadedOut(child)}
      >
        {Child}
      </Animator>
    );
  }

  render() {
    console.log(`anim toggler render`);
    const { showFirst } = this.props;
    const { FirstVisible, SecondVisible } = this.state;

    if (showFirst) {
      if (SecondVisible) {
        return this.fade(OUT, SECOND);
      }
      return this.fade(IN, FIRST);
    } else if (FirstVisible) {
      return this.fade(OUT, FIRST);
    }

    return this.fade(IN, SECOND);
  }
}

export default AnimToggler;
