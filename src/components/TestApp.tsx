import React, { Component, useRef, useLayoutEffect, useEffect } from "react";
import Modal from "Reusable/Modal";
import Portal from "./profileView/questions/Answer/Comments/Portal";

const App = () => {
  return (
    <div>
      Blabla
      <div style={{ backgroundColor: "blue", width: "50%" }}>
        <Portal>
          <div
            style={{
              marginLeft: "10px",
              width: "50%",
              backgroundColor: "red"
            }}
          >
            Portal ME
          </div>
        </Portal>
        <div>Blabla2</div>
        <div>Blabla3</div>
      </div>
    </div>
  );
};
export default App;
// import React, { Component, useRef, useLayoutEffect, useEffect } from "react";

// const App = () => {
//   const divRef = useRef<HTMLDivElement>(null);
//   useLayoutEffect(() => {
//     console.log(divRef.current!.getBoundingClientRect());
//   });
//   return (
//     <div ref={divRef} style={{ marginLeft: "10px" }}>
//       Hello
//     </div>
//   );
// };
// export default App;
