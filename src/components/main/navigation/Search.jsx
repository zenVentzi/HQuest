import React from 'react';
import styled from 'styled-components';
import Search from '../../.reusable/Search';

const CustomSearchStyled = styled(Search)`
  margin-top: 0.5em;`;

const CustomSearch = (props) => {
  const temp = 5;

  return (
    <React.Fragment>
      <CustomSearchStyled list="users" placeholder="Search users.." />
      <datalist id="users">
        <option value="Pesho" onClick={(e) => { console.log(e.target.value); }} />
        <option value="Pesho" />
        <option value="Pesho" />
      </datalist>
    </React.Fragment>
  );
};

export default CustomSearch;
