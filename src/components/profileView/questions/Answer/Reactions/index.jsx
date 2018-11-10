import React from 'react';
import { Smile } from 'styled-icons/fa-regular/Smile';
import Panel from '../Panel';
import Reaction from './Reaction';
import ReactButtons from './ReactButtons';

const Reactions = () => {
  return (
    <Panel>
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
    </Panel>
  );
};

export default Reactions;
