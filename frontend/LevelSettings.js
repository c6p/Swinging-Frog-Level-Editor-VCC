import React from 'react';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';
import styled from 'styled-components';

const Span = styled.span`
  font-weight: bold;
  text-decoration: underline;
`

class LevelSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: props.min || 720,
      max: props.max || 5400,
      step: props.step || 60,
      value: props.value || 1080,
    };
  }
  onSliderChange(value) {
    this.setState({value});
    this.props.onChange({value});
  }
  render() {
    const style = { display: 'inline-flex', flexGrow: 1, margin: '0 1vw', alignItems: 'center' };
    const sliderStyle = { display: 'inline-block', flexGrow: 1, width: 0 };
    const labelStyle = { flexGrow: 0, margin: '0 1vw', display: 'inline-block' };
    return (
      <div style={style}>
        <label style={labelStyle}>Height: <Span>{this.props.levelHeight}</Span>,   Level Area Width: <Span>{this.state.value}</Span></label>
        <Slider style={sliderStyle} value={this.state.value} min={this.state.min} max={this.state.max} step={this.state.step}
          onChange={this.onSliderChange.bind(this)}
        />
      </div>
    );
  }
}

export default LevelSettings;