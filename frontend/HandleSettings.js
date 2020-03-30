import React from 'react';
import Button from 'Button.js';
import NumberInput from 'NumberInput.js';

class HandleSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange(e) {
    let {x, y} = this.props;
    this.props.onChange(Object.assign({x, y}, {[e.target.dataset.key]: Math.min(parseInt(e.target.max), parseInt(e.target.value))}))
  }
  render() {
    const style = { display: 'inline-flex', flexGrow: 1, margin: '0 0.5vw', alignItems: 'center' };
    return (
      <div style={style}>
        <Button onClick={this.props.onClick}>Delete</Button>
        <label>x:</label><NumberInput data-key={"x"} value={this.props.x} max={this.props.levelWidth-1 || 1079} onChange={this.onChange.bind(this)}></NumberInput>
        <label>y:</label><NumberInput data-key={"y"} value={this.props.y} max={this.props.levelHeight-1 || 1079} onChange={this.onChange.bind(this)}></NumberInput>
      </div>
    );
  }
}

export default HandleSettings;