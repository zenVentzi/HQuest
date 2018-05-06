


'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessageComponent = _react2.default.createClass({
  displayName: 'MessageComponent',
  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      this.props.message
    );
  }
});

// Render an instance of MessageComponent into document.body
// ReactDOM.render(
//   <MessageComponent message="Hello!" />,
//   document.body,
// );
