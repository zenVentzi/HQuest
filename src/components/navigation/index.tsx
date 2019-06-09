import React, { useState, useEffect, useRef, useReducer } from "react";
import { getLoggedUserId } from "Utils";
import NavContainer from "./NavContainer";
import NavLeft from "./NavLeft";
import NavRight from "./NavRight";
import Search from "./Search";
import Menu from "./Menu";
import Notifications from "./Notifications";
import Profile from "./Profile";
import NewsfeedBtn from "./NewsfeedBtn";
import RankingsBtn from "./RankingsBtn";

// TODO check if user is logged in

interface NavbarProps {}

/**
 * TODO
 *
 * @returns TODO`x` and `y`
 *
 */
const useHideOnScroll = () => {
  const [isHidden, setIsHidden] = useState(false);
  const prevScrollY = useRef<number>();

  useEffect(() => {
    const onScroll = () => {
      const scrolledDown = window.scrollY > prevScrollY.current!;
      const scrolledUp = !scrolledDown;

      if (scrolledDown && !isHidden) {
        setIsHidden(true);
      } else if (scrolledUp && isHidden) {
        setIsHidden(false);
      }

      prevScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHidden]);

  return isHidden;
};

const Navbar = (props: NavbarProps) => {
  const shouldHide = useHideOnScroll();

  const isUserLogged = !!getLoggedUserId();

  return shouldHide ? null : (
    <NavContainer>
      <NavLeft>
        {isUserLogged && <Search />}
        {isUserLogged && <RankingsBtn />}
      </NavLeft>
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
