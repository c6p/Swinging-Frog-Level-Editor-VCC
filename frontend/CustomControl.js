import React from 'react';
import styled from 'styled-components';
import CustomVcc from '@withkoji/custom-vcc-sdk';
import Koji from "@withkoji/vcc";

const Main = styled.div`
    padding: 0;
    margin: 0;
    background-color: #1e1e1e;
`;

const Wrapper = styled.div`
    position: absolute;
    left: 50%;
    top: 66px;
    transform: translate(-50%, 0);
    width: 96vw;
    height: 96vw;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.4);
`;

const Item = styled.img`
    position: absolute;
    width: 16px;
    height: 16px;
`;

const Icon = styled.img`
    width: 100%;
    height: 100%;
    margin: 0 auto;
`;

const Header = styled.div`
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 0px 0px 6px 6px;
    height: 57px;
    width: 220px;
    position: fixed;
    top: 0px;
    left: calc(50% - 110px);
    z-index: 999;
`;

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
    background-color: #1e1e1e;
    border-radius: 6px;
    border: 1px solid #777777;
    width: 40px;
    height: 40px;
    margin-right: 6px;
`;

function relativeCoords ( event ) {
  var bounds = event.target.getBoundingClientRect();
  var x = event.clientX - bounds.left;
  var y = event.clientY - bounds.top;
  return {x: Math.round(x), y: Math.round(y)};
}

class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.customVcc = new CustomVcc();

        this.state = {
            value: [],
            theme: this.customVcc.theme,
            maxIndex: 3,
            currValue: 1,
            setAllIndex: 0,
            icons: [
                Koji.config.images.emptySpace,
                Koji.config.images.handle,
                Koji.config.images.player,
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
    }

    chooseAsset(index) {
        this.setState({ currValue: index });
    }

    onSettingAsset(event) {
        const newValue = [...this.state.value];
        const pos = relativeCoords(event);
        if (this.state.currValue === 0) {
            const e = event.target;
            console.log(newValue, e);
            if (e.tagName === "IMG") {
                const index = newValue.findIndex(({x,y}) => x===e.x && y===e.y);
                if (index > -1)
                    newValue.splice(index, 1);
            }
        } else if (this.state.currValue === 1) {
            newValue.push({x: pos.x-8, y: pos.y-8});    // 16x16
        }
        this.customVcc.change(newValue);
        this.customVcc.save();
    }

    render() {
        return (
            <Main>
                <Header>
                    {this.state.currValue == 0 ? <PieceActive onClick={() => {this.chooseAsset(0)}}><Blank /></PieceActive> : <Piece onClick={() => {this.chooseAsset(0)}}><Blank /></Piece>}
                    {this.state.currValue == 1 ? <PieceActive onClick={() => {this.chooseAsset(1)}}><Icon src={this.state.icons[1]}></Icon></PieceActive> : <Piece onClick={() => {this.chooseAsset(1)}}><Icon src={this.state.icons[1]}></Icon></Piece>}
                    {this.state.currValue == 2 ? <PieceActive onClick={() => {this.chooseAsset(2)}}><Icon src={this.state.icons[2]}></Icon></PieceActive> : <Piece onClick={() => {this.chooseAsset(2)}}><Icon src={this.state.icons[2]}></Icon></Piece>}
                    {this.state.currValue == 3 ? <PieceActive onClick={() => {this.chooseAsset(3)}}><Icon src={this.state.icons[3]}></Icon></PieceActive> : <Piece onClick={() => {this.chooseAsset(3)}}><Icon src={this.state.icons[3]}></Icon></Piece>}
                </Header>
                <Wrapper
                theme={this.state.theme}
                onClick={(event) => this.onSettingAsset(event)}
                >
                    {this.state.value.map(handle => (
                        <Item style={{left: handle.x, top: handle.y}} src={Koji.config.images.handle}></Item>
                      ))}
                </Wrapper>
            </Main>
        );
    }
}

export default App;