import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import UserProfile from '../userProfile';
import Search from '../search';

const StyledContent = styled.div`
  margin: 70px 0;`;

const Content = () => (
  <StyledContent>
    {/* <Route exact path="/(/|userProfile|)/" component={UserProfile} /> */}
    <Route path="/search" component={Search} />
  </StyledContent>
);

export default Content;
