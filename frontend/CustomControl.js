import React from 'react';
import styled from 'styled-components';
import CustomVcc from '@withkoji/custom-vcc-sdk';
import Koji from '@withkoji/vcc';
import LevelSettings from 'LevelSettings.js';
import HandleSettings from 'HandleSettings.js';
import PlatformSettings from 'PlatformSettings.js';
import ObstacleSettings from 'ObstacleSettings.js';
import Draggable from 'react-draggable';

const [LEFT, TOP] = [20, 66];
const HEIGHT = 1080;
const BLANK_ITEM = { x: 0, y: 0, width: 0, height: 0 };
const Items = { LEVEL: 0, HANDLE: 1, PLATFORM: 2, OBSTACLE: 3 };

const KEY_DELETE = 46;

function scrollLeft() { return document.documentElement.scrollLeft || document.body.scrollLeft }
function scrollTop() { return document.documentElement.scrollTop || document.body.scrollTop }

const Main = styled.div`
    padding: 0;
    margin: 0;
`;

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

const Finish = styled.div`
  position: absolute;
  left: ${props => 20 + props.width + 'px'};
  top: ${TOP}px;
  width: 10px;
  height: 540px;
  background-color: white;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'%3E%3Cpath fill='rgb(0,0,0)' fill-rule='evenodd' d='M0 0h1v1H0V0zm1 1h1v1H1V1z'/%3E%3C/svg%3E");
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
`;

const Highlight = styled.div`
  position: absolute;
  border: 1px #f00 solid;
`;


const Handle = styled.img`
  position: absolute;
  width: 10px;
  height: 10px;
  z-index: 30;
`;

const Platform = styled.img`
  position: absolute;
  z-index: 20;
`;

const Obstacle = styled.div`
  position: absolute;
  border: 3px #666 solid;
  z-index: 10;
`;

const Player = styled.span`
  position: absolute;
  left: 25px;
  top: 0;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #f00;
  background-color: #fff;
  user-select: none;
`;


const Icon = styled.img`
    max-height: 100%;
    margin: 0 auto;
`;

const Header = styled.div`
    display: flex;
    background-color: rgba(0.1, 0.1, 0.1, 0.4);
    color: white;
    border-radius: 0px 0px 6px 6px;
    top: 0px;
    z-index: 999;
    position: fixed;
    width: 100%;
`;

const Toolbar = styled.div`
    height: 57px;
    width: 220px;
    display: inline-block;
`;

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
        handles: false,
        platforms: false,
        obstacles: false,
      },
      platforms: { angle: 0 },
      obstacles: { width: 100, height: 100, angle: 0 },
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
      if (typeof value === 'object')
        this.setState({ value });
      else
        this.setState({
          value: {
            width: 2160,
            handles: [],
            platforms: [],
            obstacles: []
          }
        });
    });
    //WebFont.load({ google: { families: [Koji.config.settings.googleFont] } });
    //document.body.style.fontFamily = Koji.config.settings.googleFont;
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('keydown', (event) => this.handleKeyDown(event), false);
  }

  handleKeyDown(event) {
    const s = this.state.selected.item;
    if (event.keyCode !== KEY_DELETE || s === null)
      return;

    this.deleteSelectedItem();
  }

  deleteSelectedItem() {
    const s = this.state.selected.item;
    let [key, index] = s.id.split('_');
    this.state.value[key].splice(index, 1);
    this.selectItem();
  }

  modifySelectedItem(value, mKey = null) {
    const s = this.state.selected.item;
    let [key, index] = s.id.split('_');
    const newValue = { ...this.state.value };
    newValue[key][index] = value;
    this.customVcc.change(newValue);
    this.customVcc.save();
    if (mKey !== null)
      this.setState(prevState => ({ [key]: { ...prevState[key], [mKey]: value[mKey] } }));
    window.requestAnimationFrame(() => {
      const { left, top, width, height } = s.getBoundingClientRect();
      this.setState({ selected: { left: left + scrollLeft() - LEFT, top: top + scrollTop() - TOP, width, height, item: s } });
    });
  }

  chooseAsset(index) {
    this.setState({ currValue: index });
    this.selectItem(null);
  }

  showDialog(type) {
    let show = {
      level: false,
      handles: false,
      platforms: false,
      obstacles: false,
    };
    switch (type) {
      case Items.HANDLE:
        show.handles = true;
        break;
      case Items.PLATFORM:
        show.platforms = true;
        break;
      case Items.OBSTACLE:
        show.obstacles = true;
        break;
      default:
        show.level = true;
    }
    this.setState({ show });
  }

  selectItem(item = null) {
    let rect = BLANK_ITEM;
    let type = Items.LEVEL;
    if (item !== null && item.classList.contains('Item')) {
      rect = item.getBoundingClientRect();
      if (item.classList.contains('Handle'))
        type = Items.HANDLE;
      else if (item.classList.contains('Platform'))
        type = Items.PLATFORM;
      else if (item.classList.contains('Obstacle'))
        type = Items.OBSTACLE;
    }
    const { left, top, width, height } = rect;
    this.setState({ selected: { left: left + scrollLeft() - LEFT, top: top + scrollTop() - TOP, width, height, item } });
    this.showDialog(type);
  }

  selectedObject() {
    const s = this.state.selected.item;
    if (!('id' in s))
      return {};
    let [key, index] = s.id.split('_');
    return this.state.value[key][index];
  }

  onSettingAsset(event) {
    if (this.state.currValue === 0) {
      this.selectItem(event.target);
      return;
    }
    if (!event.target.classList.contains('GameArea'))
      return;
    const newValue = { ...this.state.value };
    const pos = relativeCoords(event);
    let key = null;
    if (this.state.currValue === 1) {
      key = 'handles_' + newValue.handles.length;
      newValue.handles.push({ x: pos.x * 2, y: pos.y * 2 });
    } else if (this.state.currValue === 2) {
      key = 'platforms_' + newValue.platforms.length;
      newValue.platforms.push({ x: pos.x * 2, y: pos.y * 2, angle: this.state.platforms.angle });
    } else if (this.state.currValue === 3) {
      key = 'obstacles_' + newValue.obstacles.length;
      newValue.obstacles.push({ x: pos.x * 2, y: pos.y * 2, width: this.state.obstacles.width, height: this.state.obstacles.height, angle: this.state.obstacles.angle });
    }
    this.customVcc.change(newValue);
    this.customVcc.save();
    if (key !== null) {
      window.requestAnimationFrame(() => this.selectItem(document.getElementById(key)));
    }
  }

  setWidth({ value }) {
    const newValue = { ...this.state.value };
    newValue.width = value;
    this.customVcc.change(newValue);
    this.customVcc.save();
  }

  onDrag(_, ui) {
    const { x, y } = this.selectedObject();
    const { left, top } = this.state.selected
  }

  onStop(e, ui) {
    e.preventDefault();
    e.stopPropagation();
    this.selectItem(ui.node.firstChild ? ui.node.firstChild : ui.node);
    const s = this.selectedObject();
    const { x, y } = s;
    this.modifySelectedItem(Object.assign(s, {
      x: Math.max(0, Math.min(this.state.value.width - 1, x + ui.x * 2)),
      y: Math.max(0, Math.min(HEIGHT - 1, y + ui.y * 2))
    }));
  }

  onStart(_, ui) {
    // assume hasClass(Item)
    this.selectItem(ui.node.firstChild ? ui.node.firstChild : ui.node);
  }

  render() {
    const dragHandlers = { position: { x: 0, y: 0 }, onStart: this.onStart.bind(this), onStop: this.onStop.bind(this) }
    return (
      <Main>
        <Header>
          <Toolbar>
            {this.state.currValue == 0 ? <PieceActive onClick={() => { this.chooseAsset(0); }}>Modify & Drag</PieceActive> : <Piece onClick={() => { this.chooseAsset(0); }}>Modify & Drag</Piece>}
            {this.state.currValue == 1 ? <PieceActive onClick={() => { this.chooseAsset(1); }}><Icon src={this.state.icons[1]}></Icon></PieceActive> : <Piece onClick={() => { this.chooseAsset(1); }}><Icon src={this.state.icons[1]}></Icon></Piece>}
            {this.state.currValue == 2 ? <PieceActive onClick={() => { this.chooseAsset(2); }}><Icon src={this.state.icons[2]}></Icon></PieceActive> : <Piece onClick={() => { this.chooseAsset(2); }}><Icon src={this.state.icons[2]}></Icon></Piece>}
            {this.state.currValue == 3 ? <PieceActive onClick={() => { this.chooseAsset(3); }}><Icon src={this.state.icons[3]}></Icon></PieceActive> : <Piece onClick={() => { this.chooseAsset(3); }}><Icon src={this.state.icons[3]}></Icon></Piece>}
          </Toolbar>
          {this.state.show.level && <LevelSettings value={this.state.value.width} onChange={this.setWidth.bind(this)}
            levelHeight={HEIGHT} />}
          {this.state.show.handles && <HandleSettings x={this.selectedObject().x} y={this.selectedObject().y}
            levelWidth={this.state.value.width} levelHeight={HEIGHT}
            onChange={this.modifySelectedItem.bind(this)} onClick={this.deleteSelectedItem.bind(this)} />}
          {this.state.show.platforms && <PlatformSettings x={this.selectedObject().x} y={this.selectedObject().y} angle={this.selectedObject().angle}
            levelWidth={this.state.value.width} levelHeight={HEIGHT}
            onChange={this.modifySelectedItem.bind(this)} onClick={this.deleteSelectedItem.bind(this)} />}
          {this.state.show.obstacles && <ObstacleSettings x={this.selectedObject().x} y={this.selectedObject().y} width={this.selectedObject().width} height={this.selectedObject().height} angle={this.selectedObject().angle}
            levelWidth={this.state.value.width} levelHeight={HEIGHT}
            onChange={this.modifySelectedItem.bind(this)} onClick={this.deleteSelectedItem.bind(this)} />}
        </Header>
        <Finish width={this.state.value.width / 2}></Finish>
        <GameArea className="GameArea" width={this.state.value.width / 2}
          theme={this.state.theme}
          onClick={(event) => this.onSettingAsset(event)}
        >
          <Player>P</Player>
          {this.state.value.obstacles.map((p, i) => (
            <Draggable key={i} {...dragHandlers}>
              <div style={{ display: 'flex', position: 'absolute', left: p.x / 2, top: p.y / 2, pointerEvents: 'none' }} >
                <Obstacle id={'obstacles_' + i} className="Obstacle Item"
                  style={{ width: p.width / 2, height: p.height / 2, borderRadius: p.height / 2, transform: 'translate(-50%, -50%) rotate(' + p.angle + 'deg)', pointerEvents: this.state.currValue == 0 ? 'auto' : 'none' }} src={Koji.config.images.platform}></Obstacle>
              </div>
            </Draggable>
          ))}
          {this.state.value.platforms.map((p, i) => (
            <Draggable key={i} {...dragHandlers}>
              <div style={{ display: 'flex', position: 'absolute', left: p.x / 2, top: p.y / 2, pointerEvents: 'none' }} >
                <Platform id={'platforms_' + i} className="Platform Item"
                  style={{ position: 'relative', transform: 'translate(-50%, -50%) rotate(' + p.angle + 'deg)', pointerEvents: this.state.currValue == 0 ? 'auto' : 'none' }} src={Koji.config.images.platform}></Platform>
              </div>
            </Draggable>
          ))}
          {this.state.value.handles.map((p, i) => (
            <Draggable key={i} {...dragHandlers}>
              <div style={{ display: 'flex', position: 'absolute', left: p.x / 2, top: p.y / 2, pointerEvents: 'none' }} >
                <Handle id={'handles_' + i} className="Handle Item"
                  style={{ transform: 'translate(-50%, -50%)', pointerEvents: this.state.currValue == 0 ? 'auto' : 'none' }} src={Koji.config.images.handle}></Handle>
              </div>
            </Draggable>
          ))}
          <Highlight style={Object.assign({ 'pointerEvents': 'none', 'visible': this.state.selected.item === null ? 'false' : 'true' }, this.state.selected)}></Highlight>
        </GameArea>
      </Main>
    );
  }
}

export default App;