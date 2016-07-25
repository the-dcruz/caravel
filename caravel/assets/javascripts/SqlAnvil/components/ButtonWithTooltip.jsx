import React, { PropTypes } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'


const ButtonWithTooltip = React.createClass({
  propTypes: {
    tooltip: React.PropTypes.string,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    placement: React.PropTypes.string,
  },
  getDefaultProps() {
    return {
      onClick: () => {},
      disabled: false,
      placement: 'top',
    };
  },
  render() {
    let tooltip = (
      <Tooltip id="tooltip">
        {this.props.tooltip}
      </Tooltip>
    );
    return (
      <OverlayTrigger
          overlay={tooltip}
          delayShow={300}
          placement={this.props.placement}
          delayHide={150}>
        <Button
          onClick={this.props.onClick}
          disabled={this.props.disabled}
          className={this.props.className}>
            {this.props.children}
        </Button>
      </OverlayTrigger>
    );
  }
});

export default ButtonWithTooltip
