import React from 'react';
import styled from 'styled-components';
import CustomVcc from '@withkoji/custom-vcc-sdk';
import Koji from "@withkoji/vcc";
import LevelSettings from "LevelSettings.js"
import HandleSettings from "HandleSettings.js"
import PlatformSettings from "PlatformSettings.js"
import ObstacleSettings from "ObstacleSettings.js"

const [LEFT, TOP] = [20, 66];
const HEIGHT = 1080;
const BLANK_ITEM = { x: 0, y: 0, width: 0, height: 0 };
const Items = { LEVEL: 0, HANDLE: 1, PLATFORM: 2, OBSTACLE: 3 };

const KEY_DELETE = 46;


const Main = styled.div`
    padding: 0;
    margin: 0;
`;
//background-color: #1e1e1e;

const GameArea = styled.div`
    position: absolute;
    left: ${LEFT}px;
    top: ${TOP}px;
    width: ${props => props.width + 'px'};
    height: 540px;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    background-color: #6DD5FACC;
`;
//    left: calc(50% - 10px);
//    transform: translate(-50%, 0);

const Finish = styled.div`
  position: absolute;
  left: ${props => 20 + props.width + 'px'};
  top: 66px;
  width: 20px;
  height: 540px;
  background-image: linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
`
//left: ${props => 'calc(50% + ' + props.width/2 + 'px)'};
//transform: translate(-50%, 0);

const Highlight = styled.div`
  position: absolute;
  border: 1px #f00 solid;
`;
//  left: ${props => props.selected.offsetLeft}px;
//  top: ${props => props.selected.offsetTop}px;
//  width: ${props => props.selected.offsetWidth}px;
//  height: ${props => props.selected.offsetHeight}px;
//visible: ${props => props.selected!==null}px;

const Handle = styled.img`
  position: absolute;
  width: 10px;
  height: 10px;
  z-index: 30;
`;
//background-image: ${Koji.config.images.handle};

const Platform = styled.img`
  position: absolute;
  z-index: 20;
`;

const Obstacle = styled.div`
  position: absolute;
  border: 3px #666 solid;
  z-index: 10;
`;
//

const Player = styled.span`
  position: absolute;
  left: 25px;
  top: 0;
  font-weight: bold;
  color: #f00;
  background-color: #fff;
`;


const Icon = styled.img`
    max-height: 100%;
    margin: 0 auto;
`;
//height: 100%;

const Header = styled.div`
    display: flex;
    background-color: rgba(0.1, 0.1, 0.1, 0.4);
    color: white;
    border-radius: 0px 0px 6px 6px;
    top: 0px;
    z-index: 999;
`;

const Toolbar = styled.div`
    height: 57px;
    width: 220px;
    display: inline-block;
`;
// background-color: rgba(0, 0, 0, 0.4);
//left: calc(50% - 110px);

const Piece = styled.button`
    background-color: transparent;
    color: white;
    border-radius: 6px;
    width: 50px;
    height: 50px;
    padding: 0px;
    border: 0px;
    margin-left: 4px;
    margin-top: 3px;
    cursor: pointer;
    vertical-align: bottom;
    &:hover{
        background-color: rgba(255, 255, 255, 0.3);
    }
`;

const PieceActive = styled.button`
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 6px;
    width: 50px;
    height: 50px;
    padding: 0px;
    border: 0px;
    margin-left: 4px;
    margin-top: 3px;
    cursor: pointer;
    vertical-align: bottom;
`;

const Blank = styled.div`
    border: 1px solid #f00;
    width: 40px;
    height: 40px;
    margin-right: 6px;
`;


function relativeCoords(event) {
  var bounds = event.target.getBoundingClientRect();
  var x = event.clientX - bounds.left;
  var y = event.clientY - bounds.top;
  return { x: Math.round(x), y: Math.round(y) };
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.customVcc = new CustomVcc();

    this.state = {
      value: {
        width: 2160,
        handles: [],
        platforms: [],
        obstacles: []
      },
      show: {
        level: true,
        handle: false,
        platform: false,
        obstacle: false,
      },
      platform: {angle:0},
      obstacle: {width:100, height:100, angle:0},
      theme: this.customVcc.theme,
      maxIndex: 3,
      currValue: 1,
      setAllIndex: 0,
      selected: { item: null, x: 0, y: 0, width: 0, height: 0 },
      icons: [
        Koji.config.images.emptySpace,
        Koji.config.images.handle,
        Koji.config.images.platform,
        Koji.config.images.obstacle
      ]
    };

    this.customVcc.onUpdate((newProps) => {
      if (newProps.value && newProps.value !== '') {
        this.setState({
          ...this.state,
          ...newProps,
        });
      }
    });

    this.customVcc.onTheme((theme) => {
      this.setState({
        theme
      });
    });
  }

  componentDidMount() {
    this.customVcc.register('50%', '100vh');
    this.customVcc.onUpdate(({ value }) => {
      this.setState({ value });
    });
    //WebFont.load({ google: { families: [Koji.config.settings.googleFont] } });
    //document.body.style.fontFamily = Koji.config.settings.googleFont;
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener("keydown", (event) => this.handleKeyDown(event), false);
  }

  handleKeyDown(event) {
    const s = this.state.selected.item;
    if (event.keyCode !== KEY_DELETE || s === null)
      return

    this.deleteSelectedItem();
  }

  deleteSelectedItem() {
    const s = this.state.selected.item;
    let [key, index] = s.id.split('_');
    this.state.value[key].splice(index, 1);
    this.selectItem()
  }

  modifySelectedItem(value) {
    const s = this.state.selected.item;
    let [key, index] = s.id.split('_');
    const newValue = {...this.state.value};
    newValue[key][index] = value;
    // TODO change defaults
    //console.log(key, index, value, newValue)
    this.customVcc.change(newValue);
    this.customVcc.save();
    window.requestAnimationFrame(() => {
      const {left,top,width,height} = s.getBoundingClientRect()
      this.setState({ selected: { left: left-LEFT, top: top-TOP, width, height, item:s }});
    })
  }

  chooseAsset(index) {
    this.setState({ currValue: index });
    this.selectItem(null)
  }

  showDialog(type) {
    let show = {
      level: false,
      handle: false,
      platform: false,
      obstacle: false,
    }
    switch (type) {
      case Items.HANDLE:
        show.handle = true
        break
      case Items.PLATFORM:
        show.platform = true
        break
      case Items.OBSTACLE:
        show.obstacle = true
        break
      default:
        show.level = true
    }
    this.setState({ show });
  }

  selectItem(item = null) {
    let rect = BLANK_ITEM
    let type = Items.LEVEL;
    if (item!==null && item.classList.contains("Item")) {
      rect = item.getBoundingClientRect()
      if (item.classList.contains("Handle"))
        type = Items.HANDLE;
      else if (item.classList.contains("Platform"))
        type = Items.PLATFORM;
      else if (item.classList.contains("Obstacle"))
        type = Items.OBSTACLE;
    }
    const {left,top,width,height} = rect
    this.setState({ selected: { left: left-LEFT, top: top-TOP, width, height, item }});
    this.showDialog(type)
  }

  selectedObject() {
    const s = this.state.selected.item;
    if (!('id' in s))
      return {}
    let [key, index] = s.id.split('_');
    return this.state.value[key][index]
  }

  onSettingAsset(event) {
    //console.log(event.target.classList)
    //if (event.target.classList.contains("Item"))
    //  this.selectItem(event.target)
    //let {handles} = this.state.value
    if (this.state.currValue === 0) {
      this.selectItem(event.target)
      return
      //this.selectItem(null)
      //const e = event.target;
      //console.log(newValue, e);
      /*if (e.classList.contains("Handle")) {
        const index = newValue.handles.findIndex(({ x, y }) => x === e.x && y === e.y);
        if (index > -1)
          newValue.handles.splice(index, 1);
      }*/
    }
      if (!event.target.classList.contains("GameArea"))
        return
      const newValue = { ...this.state.value };
      const pos = relativeCoords(event);
      let key = null
    if (this.state.currValue === 1) {
      key = "handles_" + newValue.handles.length
      newValue.handles.push({ x: pos.x * 2, y: pos.y * 2 });
    } else if (this.state.currValue === 2) {
      key = "platforms_" + newValue.platforms.length
      newValue.platforms.push({ x: pos.x * 2, y: pos.y * 2, angle: this.state.platform.angle });
    } else if (this.state.currValue === 3) {
      key = "obstacles_" + newValue.obstacles.length
      newValue.obstacles.push({ x: pos.x * 2, y: pos.y * 2, width: this.state.obstacle.width, height: this.state.obstacle.height, angle: this.state.obstacle.angle });
    }
    this.customVcc.change(newValue);
    this.customVcc.save();
    if (key !== null) {
      window.requestAnimationFrame(() => this.selectItem(document.getElementById(key)))
    }
  }

  setWidth({ value }) {
    const newValue = { ...this.state.value };
    newValue.width = value;
    this.customVcc.change(newValue);
    this.customVcc.save();
  }

  render() {
    return (
      <Main>
        <Header>
          <Toolbar>
            {this.state.currValue == 0 ? <PieceActive onClick={() => { this.chooseAsset(0) }}>Select Item</PieceActive> : <Piece onClick={() => { this.chooseAsset(0) }}>Select Item</Piece>}
            {this.state.currValue == 1 ? <PieceActive onClick={() => { this.chooseAsset(1) }}><Icon src={this.state.icons[1]}></Icon></PieceActive> : <Piece onClick={() => { this.chooseAsset(1) }}><Icon src={this.state.icons[1]}></Icon></Piece>}
            {this.state.currValue == 2 ? <PieceActive onClick={() => { this.chooseAsset(2) }}><Icon src={this.state.icons[2]}></Icon></PieceActive> : <Piece onClick={() => { this.chooseAsset(2) }}><Icon src={this.state.icons[2]}></Icon></Piece>}
            {this.state.currValue == 3 ? <PieceActive onClick={() => { this.chooseAsset(3) }}><Icon src={this.state.icons[3]}></Icon></PieceActive> : <Piece onClick={() => { this.chooseAsset(3) }}><Icon src={this.state.icons[3]}></Icon></Piece>}
          </Toolbar>
          {this.state.show.level && <LevelSettings value={this.state.value.width} onChange={this.setWidth.bind(this)}
            levelHeight={HEIGHT} />}
          {this.state.show.handle && <HandleSettings x={this.selectedObject().x} y={this.selectedObject().y}
            levelWidth={this.state.value.width} levelHeight={HEIGHT}
            onChange={this.modifySelectedItem.bind(this)} onClick={this.deleteSelectedItem.bind(this)} />}
          {this.state.show.platform && <PlatformSettings x={this.selectedObject().x} y={this.selectedObject().y} angle={this.selectedObject().angle}
            levelWidth={this.state.value.width} levelHeight={HEIGHT}
            onChange={this.modifySelectedItem.bind(this)} onClick={this.deleteSelectedItem.bind(this)} />}
          {this.state.show.obstacle && <ObstacleSettings x={this.selectedObject().x} y={this.selectedObject().y} width={this.selectedObject().width} height={this.selectedObject().height} angle={this.selectedObject().angle}
            levelWidth={this.state.value.width} levelHeight={HEIGHT}
            onChange={this.modifySelectedItem.bind(this)} onClick={this.deleteSelectedItem.bind(this)} />}
        </Header>
        <GameArea className="GameArea" width={this.state.value.width / 2}
          theme={this.state.theme}
          onClick={(event) => this.onSettingAsset(event)}
        >
          {this.state.value.handles.map((handle, i) => (
            <Handle id={"handles_" + i} key={i} className="Handle Item" style={{ left: (handle.x - 10) / 2, top: (handle.y - 10) / 2, pointerEvents: this.state.currValue==0 ? 'auto' : 'none'}} src={Koji.config.images.handle}></Handle>
          ))}
          {this.state.value.platforms.map((p, i) => (
            <Platform id={"platforms_" + i} key={i} className="Platform Item"
            style={{ left: (p.x - 28) / 2, top: (p.y - 5) / 2, transform: 'rotate('+p.angle+'deg)', pointerEvents: this.state.currValue==0 ? 'auto' : 'none'}} src={Koji.config.images.platform}></Platform>
          ))}
          {this.state.value.obstacles.map((p, i) => (
            <Obstacle id={"obstacles_" + i} key={i} className="Obstacle Item"
            style={{ left: (p.x - p.width/2) / 2, top: (p.y - p.height/2) / 2, width: p.width/2, height: p.height/2, borderRadius: p.height/2, transform: 'rotate('+p.angle+'deg)', pointerEvents: this.state.currValue==0 ? 'auto' : 'none'}} src={Koji.config.images.platform}></Obstacle>
          ))}
          <Player>P</Player>
          <Highlight style={Object.assign({'pointerEvents': 'none', 'visible': this.state.selected.item===null ? 'false' : 'true'}, this.state.selected)}></Highlight>
        </GameArea>
        <Finish width={this.state.value.width / 2}></Finish>
      </Main>
    );
  }
}

export default App;