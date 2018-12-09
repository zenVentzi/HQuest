import styled from 'styled-components';

const StyledView = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 4.4em auto;
  overflow: visible;
  /* align-items: center; */
  /* text-align: center; */
  width: 70%;

  @media (max-width: 600px) {
    width: 90%;
    margin: 6em auto;
  }
`;

export default StyledView;
