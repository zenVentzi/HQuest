import styled from "styled-components";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import shortid from "shortid";

// https://stackoverflow.com/a/42337722/4132182
function getNodeIndex(element: Element) {
  if (!element.parentNode) {
    throw Error("parent node not found");
  }

  return Array.from(element.parentNode.childNodes).indexOf(element);
}

type Portal = {
  children: React.ReactElement;
};

enum Progress {
  measure_dom,
  portal,
  done
}

const Portal = (props: Portal) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const parentRef = useRef<HTMLElement>();
  const childRef = useRef<HTMLElement>();
  const childPosition = useRef<ClientRect | DOMRect>();
  const modalRoot = useRef<HTMLDivElement>();
  const [progress, setProgress] = useState<Progress>(Progress.measure_dom);

  useLayoutEffect(() => {
    if (progress !== Progress.done && modalRoot.current) {
      modalRoot.current.appendChild(childRef.current!);
      childRef.current!.style.position = "absolute";
      childRef.current!.style.top = `${childPosition.current!.top +
        window.scrollY}px`;
      childRef.current!.style.left = `${childPosition.current!.left}px`;
      childRef.current!.style.width = `${childPosition.current!.width}px`;
      childRef.current!.style.height = `${childPosition.current!.height}px`;
      setProgress(Progress.done);
    }
    if (progress !== Progress.measure_dom) return;
    parentRef.current = spanRef.current!.parentElement!;
    childRef.current = spanRef.current!.firstElementChild! as HTMLElement;

    parentRef.current.insertBefore(childRef.current, spanRef.current);
    childPosition.current = childRef.current.getBoundingClientRect();
    setProgress(Progress.portal);
    modalRoot.current = document.createElement("div");
    modalRoot.current.id = `modal_${shortid()}`;
    document.body.appendChild(modalRoot.current);
  }, [progress]);

  useEffect(() => {
    return () => {
      document.body.removeChild(modalRoot.current!);
    };
  }, []);

  if (progress === Progress.measure_dom) {
    return <span ref={spanRef}>{props.children}</span>;
  }

  return ReactDOM.createPortal(null, modalRoot.current!);
};

export default Portal;

/* 

1) render with span
2) spanChild
3) spanParent
4) change firstChild parent
5) remove span
6) firstChildPosition
7) portal firstChild
8) set firstChild position when in portal




*/
