// import React, { Component, Fragment } from 'react';
// import styled from 'styled-components';

// class Floater extends Component {
//   state = { contentPosition: { x: 0, y: 0 } };

//   getChildWithHandlers = child => {
//     const childProps = {
//       onClick: event => {
//         this.executeHandlerOn(child, 'onClick', event);
//         this.onClickChild(event);
//       },
//       // onMouseMove: event => {
//       //   this.executeHandlerOn(child, 'onMouseMove', event);
//       //   this.onMouseMoveChild(event);
//       // },
//       onMouseEnter: event => {
//         this.executeHandlerOn(child, 'onMouseEnter', event);
//         this.onMouseEnterChild(event);
//       },
//       onMouseLeave: event => {
//         this.executeHandlerOn(child, 'onMouseLeave', event);
//         this.onMouseLeaveChild(event);
//       },
//     };

//     return React.cloneElement(child, childProps);
//   };

//   executeHandlerOn = (component, handlerName, event) => {
//     if (component.props[handlerName]) {
//       if (typeof component.props[handlerName] === 'function') {
//         component.props[handlerName](event);
//       } else {
//         Object.values(component.props[handlerName])[0](event);
//       }
//     }
//   };

//   onClickChild = e => {};

//   onMouseEnterChild = e => {
//     e.persist();
//     this.setState(prevState => {
//       return {
//         ...prevState,
//         mouseOverChild: true,
//         contentPosition: { x: e.pageX, y: e.pageY },
//       };
//     });
//     console.log(`mouseenterchild`);
//   };

//   onMouseLeaveChild = e => {
//     this.setState(prevState => {
//       return {
//         ...prevState,
//         mouseOverChild: false,
//       };
//     });

//     console.log(`mouseleavechild`);
//   };

//   onMouseEnterContent = () => {
//     this.setState(prevState => {
//       return {
//         ...prevState,
//         mouseOverContent: true,
//       };
//     });
//   };

//   onMouseLeaveContent = () => {
//     this.setState(prevState => {
//       return {
//         ...prevState,
//         mouseOverContent: false,
//       };
//     });
//   };

//   renderChild() {
//     const childRaw = React.Children.only(this.props.children);
//     const childWithHandlers = this.getChildWithHandlers(childRaw);
//     return childWithHandlers;
//   }

//   render() {
//     const { content } = this.props;
//     const {
//       mouseOverChild,
//       mouseOverContent,
//       contentPosition: { x, y },
//     } = this.state;

//     const showContent = mouseOverChild || mouseOverContent;

//     const contentWrapperStyle = {
//       position: 'absolute',
//       zIndex: 1,
//       display: 'inline-block',
//       left: x + 20,
//       top: y,
//     };

//     return (
//       <Fragment>
//         {this.renderChild()}
//         {showContent && (
//           <div
//             onMouseEnter={this.onMouseEnterContent}
//             onMouseLeave={this.onMouseLeaveContent}
//             style={contentWrapperStyle}
//           >
//             {content}
//           </div>
//         )}
//       </Fragment>
//     );
//   }
// }

// export default Floater;
