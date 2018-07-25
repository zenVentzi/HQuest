import React, { Component } from 'react';

class ModuleLoader extends Component {
  state = { loading: true, module: null };

  componentDidMount() {
    // if (!this.props.path) {
    //   console.log('empty path');
    //   return;
    // }
    // import(this.props.path).then(module => this.loadModule(module));
  }

  loadModule(module) {
    this.setState({ loading: false, module });
  }
  render() {
    return this.props.children(this.state);
  }
}

export default ModuleLoader;
