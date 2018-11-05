import React, { Component } from 'react';
import styled from 'styled-components';
import Panel from './Panel';
import Edition from './Edition';

// can be made Pure or even stateless
class Editions extends Component {
  render() {
    const { editions, onClose } = this.props;

    return (
      <Panel onClose={onClose}>
        {editions.map(e => (
          <Edition key={e.id} edition={e} />
        ))}
      </Panel>
    );
  }
}

export default Editions;
