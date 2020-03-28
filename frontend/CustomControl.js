import React from 'react';
import styled from 'styled-components';
import CustomVcc from '@withkoji/custom-vcc-sdk';
import Koji from "@withkoji/vcc";

const Main = styled.div`
    padding: 0;
    margin: 0;
    background-color: #1e1e1e;
`;

const GameArea = styled.div`
    position: absolute;
    left: calc(50% - 10px);
    top: 66px;
    transform: translate(-50%, 0);
    width: ${props => props.width+'px'};
    height: 540px;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    background-color: #6DD5FACC;
`;

const Finish = styled.div`
  position: absolute;
  left: ${props => 'calc(50% + ' + props.width/2 + 'px)'};
  top: 66px;
  transform: translate(-50%, 0);
  width: 20px;
  height: 540px;
  background-image: linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
`

const Highlight = styled.div`
  position: absolute;
  border: 1px #f00 solid;
  left: ${props => props.selected.offsetLeft}px;
  top: ${props => props.selected.offsetTop}px;
  width: ${props => props.selected.offsetWidth}px;
  height: ${props => props.selected.offsetHeight}px;
`;
//visible: ${props => props.selected!==null}px;

const Handle = styled.img`
  position: absolute;
  width: 10px;
  height: 10px;
`;
//background-image: ${Koji.config.images.handle};

const Platform = styled.img`
  position: absolute;
`;


const Icon = styled.img`
    width: 100%;
    margin: 0 auto;
`;
 //height: 100%;

const Header = styled.div``;

const Toolbar = styled.div`
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 0px 0px 6px 6px;
    height: 57px;
    width: 220px;
    position: fixed;
    top: 0px;
    z-index: 999;
`;
//left: calc(50% - 110px);

const Piece = styled.button`
    background-color: transparent;
    border-radius: 6px;
    width: 50px;
    height: 50px;
    padding: 5px;
    border: 0px;
    margin-left: 4px;
    margin-top: 3px;
    cursor: pointer;
    &:hover{
        background-color: rgba(255, 255, 255, 0.3);
    }
`;

const PieceActive = styled.button`
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    width: 50px;
    height: 50px;
    padding: 5px;
    border: 0px;
    margin-left: 4px;
    margin-top: 3px;
    cursor: pointer;
`;

const Blank = styled.div`
    border: 1px solid #f00;
    width: 40px;
    height: 40px;
    margin-right: 6px;
`;

const BLANK_ITEM = {offsetLeft:-10, offsetTop:-10, offsetWidth:0, offsetHeight:0};

const KEY_DELETE = 46;
function deleteItem(items, item) {
  items = [...items];
  //const index = items.findIndex(({ x, y }) => x === e.x && y === e.y);
  //if (index > -1)
  //  items.splice(index, 1);
  return items;
}

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
        platforms: []
      },
      theme: this.customVcc.theme,
      maxIndex: 3,
      currValue: 1,
      setAllIndex: 0,
      selectedItem: BLANK_ITEM,
      icons: [
        Koji.config.images.emptySpace,
        Koji.config.images.handle,
        Koji.config.images.platform,
        Koji.config.images.exit
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
    const s = this.state.selectedItem;
    if (event.keyCode !== KEY_DELETE || s === BLANK_ITEM)
      return

    let [key, index] = s.id.split(' ');
    this.state.value[key].splice(index, 1);

    this.setState(prevState => ({
      selectedItem: BLANK_ITEM,
      value: {
        ...prevState.value,
        [key]: prevState.value[key]
      }
    }))
  }

  chooseAsset(index) {
    this.setState({ currValue: index });
  }

  onSettingAsset(event) {
    //console.log(event.target.classList)
    if (event.target.classList.contains("Item"))
      this.setState({selectedItem: event.target});
    if (!event.target.classList.contains("GameArea"))
      return
    const newValue = {...this.state.value};
    const pos = relativeCoords(event);
    //let {handles} = this.state.value
    if (this.state.currValue === 0) {
      const e = event.target;
      //console.log(newValue, e);
      /*if (e.classList.contains("Handle")) {
        const index = newValue.handles.findIndex(({ x, y }) => x === e.x && y === e.y);
        if (index > -1)
          newValue.handles.splice(index, 1);
      }*/
    } else if (this.state.currValue === 1)
      newValue.handles.push({ x: pos.x * 2, y: pos.y * 2 });
    else if (this.state.currValue === 2)
      newValue.platforms.push({ x: pos.x * 2, y: pos.y * 2 });
    this.customVcc.change(newValue);
    this.customVcc.save();
  }

  render() {
    return (
      <Main>
        <Header>
          <Toolbar>
            {this.state.currValue == 0 ? <PieceActive onClick={() => { this.chooseAsset(0) }}><Blank /></PieceActive> : <Piece onClick={() => { this.chooseAsset(0) }}><Blank /></Piece>}
            {this.state.currValue == 1 ? <PieceActive onClick={() => { this.chooseAsset(1) }}><Icon src={this.state.icons[1]}></Icon></PieceActive> : <Piece onClick={() => { this.chooseAsset(1) }}><Icon src={this.state.icons[1]}></Icon></Piece>}
            {this.state.currValue == 2 ? <PieceActive onClick={() => { this.chooseAsset(2) }}><Icon src={this.state.icons[2]}></Icon></PieceActive> : <Piece onClick={() => { this.chooseAsset(2) }}><Icon src={this.state.icons[2]}></Icon></Piece>}
            {this.state.currValue == 3 ? <PieceActive onClick={() => { this.chooseAsset(3) }}><Icon src={this.state.icons[3]}></Icon></PieceActive> : <Piece onClick={() => { this.chooseAsset(3) }}><Icon src={this.state.icons[3]}></Icon></Piece>}
          </Toolbar>
        </Header>
        <GameArea className="GameArea" width={this.state.value.width/2}
          theme={this.state.theme}
          onClick={(event) => this.onSettingAsset(event)}
        >
          {this.state.value.handles.map((handle, i) => (
            <Handle id={"handles "+i} key={i} className="Handle Item" style={{ left: (handle.x - 10) / 2, top: (handle.y - 10) / 2 }} src={Koji.config.images.handle}></Handle>
          ))}
          {this.state.value.platforms.map((handle, i) => (
            <Platform id={"platforms "+i} key={i} className="Platform Item" style={{ left: (handle.x - 28) / 2, top: (handle.y - 5) / 2 }} src={Koji.config.images.platform}></Platform>
          ))}
          <Highlight selected={this.state.selectedItem}></Highlight>
        </GameArea>
        <Finish width={this.state.value.width/2}></Finish>
      </Main>
    );
  }
}

export default App;