import React, { Component, isValidElement, Children, createElement } from "react";

// base class that detects offline/online changes
class Detect extends Component {
  constructor() {
    super();
    this.state = {
      online: navigator.onLine,
    };
    // bind event handlers
    this.goOnline = this.goOnline.bind(this);
    this.goOffline = this.goOffline.bind(this);
    this.handleDebugKeydown = this.handleDebugKeydown.bind(this);
  }
  renderChildren() {
    const { children } = this.props;
    let { wrapperType } = this.props;

    // usual case: one child that is a react Element
    if (React.isValidElement(children)) { return children; }

    // no children
    if (!children) { return null; }

    // string children, multiple children, or something else
    const childrenArray = Children.toArray(children);
    const firstChild = childrenArray[0];
    // use wrapperType if specified
    if (!wrapperType) {
      if (typeof firstChild === 'string' || firstChild.type === 'span') {
        // use span for string or span children
        wrapperType = 'span';
      } else {
        // fallback on div
        wrapperType = 'div';
      }
    }
    return createElement(wrapperType, {}, ...childrenArray);
  }
  goOnline() {
    this.setState({ online: true });
  }
  goOffline() {
    this.setState({ online: false });
  }
  handleDebugKeydown({ keyCode, shiftKey, metaKey }) {
    if (keyCode === 48 && shiftKey && metaKey) {
      this.setState({ online: !this.state.online });
    }
  }
  componentDidMount() {
    window.addEventListener('online', this.goOnline);
    window.addEventListener('offline', this.goOffline);

    if (parseInt(window.location.port) >= 1024) {
      window.addEventListener('keydown', this.handleDebugKeydown);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('online', this.goOnline);
    window.removeEventListener('offline', this.goOffline);
    window.removeEventListener('keydown', this.handleDebugKeydown);
  }
}

export class Online extends Detect {
  render() {
    return this.state.online ? this.renderChildren() : null;
  }
}

export class Offline extends Detect {
  render() {
    return !this.state.online ? this.renderChildren() : null;
  }
}