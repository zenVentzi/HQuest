import React, { Component } from 'react';
import styled from 'styled-components';
import FloatingWindow from 'Reusable/FloatingWindow';
import Edition from './Edition';

// can be made Pure or even stateless
class Editions extends Component {
  render() {
    const { editions, onClose } = this.props;

    return (
      <FloatingWindow onClose={onClose}>
        {editions.map(e => (
          <Edition key={e.id} edition={e} />
        ))}
      </FloatingWindow>
    );
  }
}

export default Editions;
