import React, { useEffect, useRef, ReactChild, useLayoutEffect } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root");

function useLockBodyScroll() {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []); // Empty array ensures effect is only run on mount and unmount
}

interface ModalProps {
  children: ReactChild;
}

const Modal = (props: ModalProps) => {
  useLockBodyScroll();
  const el = useRef<HTMLDivElement>();
  if (!modalRoot) {
    throw Error(`modalRoot cannot be null|undefined`);
  }

  useEffect(() => {
    el.current = document.createElement("div"); // this is under scrutiny(used to be in constructor)

    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(el.current);
    return () => {
      modalRoot.removeChild(el.current!);
    };
  }, []);

  // return ReactDOM.createPortal(props.children, el.current!);
  return ReactDOM.createPortal(props.children, modalRoot);
};

export default Modal;
