import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Avatar, { Wrapper as ImgWrapper, Img } from '../reusable/Avatar';
import StyledUserName from '../reusable/StyledUserName';

const StyledUser = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  height: 60px;
  align-items: center;
  justify-content: space-around;
  z-index: 1;
  border-radius: 0.3em; 
  border: 1px solid black;
  
  &:hover {
    background: black;
    cursor: pointer;
    ${StyledUserName} {
      color: white;
    }
    ${Avatar} {
      border-color: white;
    }
  }
`;

const StyledUser1 = styled.div`
  display: flex;
  width: 70%;
  flex-wrap: wrap;
  height: 60px;
  align-items: center;
  justify-content: space-around;
  z-index: 1;
  border-radius: 0.3em; 
  border: 1px solid black;
`;

const User = ({ username, avatarSrc }) => {
  const theme = {
    avatarSize: '50px',
  };

  return (
    <StyledUser>
      <ThemeProvider theme={theme}>
        {/* <ImgWrapper>
          <Img src={avatarSrc} />
        </ImgWrapper> */}
        <Avatar src={avatarSrc} />
      </ThemeProvider>
      <StyledUserName>
        {/* {username} */}
        Ventsislav Marinov
      </StyledUserName>
    </StyledUser>
    // <div>
    //   <StyledUser>
    //     <ThemeProvider theme={theme}>
    //       <ImgWrapper>
    //           <Img src={avatarSrc} />
    //       </ImgWrapper>
    //     </ThemeProvider>
    //     <StyledUserName>
    //       {/* {username} */}
    //       fdfdfdfdfdfdfdfd
    //     </StyledUserName>
    //   </StyledUser>
    //   <StyledUser>
    //     <ThemeProvider theme={theme}>
    //       <ImgWrapper>
    //           <Img src={avatarSrc} />
    //       </ImgWrapper>
    //     </ThemeProvider>
    //     <StyledUserName>
    //       {/* {username} */}
    //       fdfdfdfdfdfdfdfdfdfdffdffddffddfdfdfdfdfd
    //     </StyledUserName>
    //   </StyledUser>
    // </div>
  );
};

export default User;
