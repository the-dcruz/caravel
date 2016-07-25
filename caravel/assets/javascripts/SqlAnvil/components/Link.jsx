import React, { PropTypes } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'


const Link = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    href: React.PropTypes.string,
    onClick: React.PropTypes.func,
    tooltip: React.PropTypes.string,
  },
  getDefaultProps() {
    return {
      disabled: false,
      href: '#',
      onClick: () => {},
    };
  },
  render() {
    let tooltip = (
      <Tooltip id="tooltip">
        {this.props.tooltip}
      </Tooltip>
    );
    return (
      <OverlayTrigger overlay={tooltip} delayShow={300} delayHide={150}>
        <a
          href={this.props.href}
          onClick={this.props.onClick}
          className={"Link " + this.props.className}>
            {this.props.children}
        </a>
      </OverlayTrigger>
    );
  }
});

export default Link
