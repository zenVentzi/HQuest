import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root");

interface ModalProps {
  children: any;
}

const Modal = (props: ModalProps) => {
  const el = useRef<HTMLDivElement>();

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
      modalRoot.removeChild(el.current);
    };
  }, []);

  return ReactDOM.createPortal(props.children, el.current);
};

export default Modal;
