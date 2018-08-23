import React from 'react';
import { Smile } from 'styled-icons/fa-regular/Smile';
import Reaction from './Reaction';
import FixedPanel from './FixedPanel';
import ReactButtons from './ReactButtons';

const Reactions = ({ onClose }) => {
  const holder = 5;
  return (
    <FixedPanel onClose={onClose}>
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
    </FixedPanel>
  );
};

export default Reactions;