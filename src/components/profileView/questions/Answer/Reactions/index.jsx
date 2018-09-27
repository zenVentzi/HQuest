import React from 'react';
import { Smile } from 'styled-icons/fa-regular/Smile';
import FloatingWindow from 'Reusable/FloatingWindow';
import Reaction from './Reaction';
import ReactButtons from './ReactButtons';

const Reactions = ({ onClose }) => {
  return (
    <FloatingWindow onClose={onClose}>
      <ReactButtons />
      <Reaction reactionIcon={Smile} />
      <Reaction reactionIcon={Smile} />
      <Reaction reactionIcon={Smile} />
      <Reaction reactionIcon={Smile} />
      <Reaction reactionIcon={Smile} />
      <Reaction reactionIcon={Smile} />
      <Reaction reactionIcon={Smile} />
      <Reaction reactionIcon={Smile} />
      <Reaction reactionIcon={Smile} />
      <Reaction reactionIcon={Smile} />
    </FloatingWindow>
  );
};

export default Reactions;
