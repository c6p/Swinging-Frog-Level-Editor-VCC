import React from 'react';
import Button from 'Button.js';
import NumberInput from 'NumberInput.js';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

class PlatformSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xMax: this.props.levelWidth - 1 || 719,
      yMax: this.props.levelHeight - 1 || 1079
    };
  }
  onChange(key, value, max) {
    let { x, y, angle } = this.props;
    this.props.onChange(Object.assign({ x, y, angle }, { [key]: Math.min(parseInt(max), parseInt(value)) }), key)
  }
  render() {
    const style = { display: 'inline-flex', flexGrow: 1, margin: '0 0.5vw', alignItems: 'center' };
    const sliderStyle = { display: 'inline-block', flexGrow: 1, width: 0 };
    const labelStyle = { flexGrow: 0, margin: '0 1vw', display: 'inline-block' };
    return (
      <div style={style}>
        <Button onClick={this.props.onClick}>Delete</Button>
        <label>x:</label><NumberInput value={this.props.x} max={this.state.xMax} onChange={(e) => this.onChange('x', e.target.value, e.target.max)}></NumberInput>
        <label>y:</label><NumberInput value={this.props.y} max={this.state.yMax} onChange={(e) => this.onChange('y', e.target.value, e.target.max)}></NumberInput>
        <label style={labelStyle}>Angle: {this.props.angle}&#730;</label>
        <Slider style={sliderStyle} value={this.props.angle} min={0} max={355} step={5} onChange={(v) => this.onChange('angle', v, 355)} />
      </div>
    );
  }
}

export default PlatformSettings;