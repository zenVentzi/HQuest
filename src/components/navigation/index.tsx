import React, { useState, useEffect, useRef } from "react";
import { getLoggedUserId } from "Utils";
import NavContainer from "./NavContainer";
import NavLeft from "./NavLeft";
import NavRight from "./NavRight";
import Search from "./Search";
import Menu from "./Menu";
import Notifications from "./Notifications";
import Profile from "./Profile";
import NewsfeedBtn from "./NewsfeedBtn";

// TODO check if user is logged in

interface NavbarProps {}
interface NavbarState {
  isHidden: boolean;
}

const Navbar = (props: NavbarProps) => {
  let prevScrollY = useRef<number>();

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      window.scrollY > prevScrollY.current
        ? !isHidden && setIsHidden(true)
        : isHidden && setIsHidden(false);

      prevScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isUserLogged = !!getLoggedUserId();

  return isHidden ? null : (
    <NavContainer>
      <NavLeft>{isUserLogged && <Search />}</NavLeft>
      <NavRight>
        {isUserLogged && (
          <>
            <NewsfeedBtn />
            <Profile />
            <Notifications />
            <Menu />
          </>
        )}
      </NavRight>
    </NavContainer>
  );
};

export default Navbar;
