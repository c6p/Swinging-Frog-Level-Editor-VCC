import React from 'react';
import Button from 'Button.js';
import NumberInput from 'NumberInput.js';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

class PlatformSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  onChange(key, value, max) {
    let {x, y, width, height, angle} = this.props;
    this.props.onChange(Object.assign({x, y, width, height, angle}, {[key]: Math.min(parseInt(max), parseInt(value))}))
  }
  render() {
    const style = { display: 'inline-flex', flexGrow: 1, margin: '0 0.5vw', alignItems: 'center' };
    const sliderStyle = { display: 'inline-block', flexGrow: 1, width: 0 };
    const labelStyle = { flexGrow: 0, margin: '0 1vw', display: 'inline-block' };
    return (
      <div style={style}>
        <Button onClick={this.props.onClick}>Delete</Button>
        <label>x:</label><NumberInput value={this.props.x} max={this.props.levelWidth-1 || 719} onChange={(e) => this.onChange('x', e.target.value, e.target.max)}></NumberInput>
        <label>y:</label><NumberInput value={this.props.y} max={this.props.levelHeight-1 || 1079} onChange={(e) => this.onChange('y', e.target.value, e.target.max)}></NumberInput>
        <label>width:</label><NumberInput value={this.props.width} max={this.props.levelHeight-1 || 719} onChange={(e) => this.onChange('width', e.target.value, e.target.max)}></NumberInput>
        <label>height:</label><NumberInput value={this.props.height} max={this.props.levelHeight-1 || 1079} onChange={(e) => this.onChange('height', e.target.value, e.target.max)}></NumberInput>
        <label style={labelStyle}>Angle: {this.props.angle}&#730;</label>
        <Slider style={sliderStyle} data-key={"angle"}value={this.props.angle} min={0} max={175} step={5}
          onChange={(v) => this.onChange('angle', v, 175)}
        />
      </div>
    );
  }
}

export default PlatformSettings;