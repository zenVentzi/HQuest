import styled from 'styled-components';

const StyledView = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 4.4em auto;
  /* align-items: center; */
  /* text-align: center; */
  /* width: 500px; */
  width: 70%;

  @media (max-width: 600px) {
    width: 100%;
  }
  overflow: hidden;
`;

export default StyledView;
