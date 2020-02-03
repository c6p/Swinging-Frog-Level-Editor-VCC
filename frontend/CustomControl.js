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
    top: 75px;
    transform: translate(-50%, 0);
    width: 96vw;
    height: 96vw;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    background: url(${Koji.config.images.grid});
    background-size: 100% 100%;
    background-repeat: no-repeat;
`;

const Grid = styled.div`
    width: auto;
    display: flex;
    flex-direction: column;
    user-select: none;
    text-align: center;
`;

const GridRow = styled.div`
    width: 96vw;
    display: flex;
    
`;

const GridItem = styled.div`
    cursor: pointer;
    width: 8vw;
    height: auto;
    &:hover{
        opacity: 0.7;
    }
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
    width: 166px;
    position: fixed;
    top: 0px;
    left: calc(50% - 83px);
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

class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.customVcc = new CustomVcc();

        const initialGrid = Array(12).fill(Array(12).fill(0));

        this.state = {
            value: initialGrid,
            theme: this.customVcc.theme,
            maxIndex: 2,
            currValue: 0,
            setAllIndex: 0,
            icons: [
                Koji.config.images.emptySpace,
                Koji.config.images.wall,
                Koji.config.images.player
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
        //WebFont.load({ google: { families: [Koji.config.settings.googleFont] } });
        //document.body.style.fontFamily = Koji.config.settings.googleFont;
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    chooseAsset(index) {
        this.setState({ currValue: index });
    }

    onSettingAsset(row, item) {
        const newValue = [...this.state.value];
        if(this.state.currValue == 2){
            for(let i=0; i<newValue.length; i++){
                if(newValue[i].indexOf(2) != -1){
                    newValue[i][newValue[i].indexOf(2)] = 0;
                    break;
                }
            }
        }
        const newRow = [...newValue[row]];
        newRow[item] = this.state.currValue;
        newValue[row] = newRow;
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
                </Header>
                <Wrapper>
                    <Grid theme={this.state.theme}>
                        {this.state.value.map((row, i) => (
                            <GridRow key={i}>
                                {this.state.value[i].map((item, j) => (
                                    <GridItem
                                        key={`${i}-${j}`}
                                        isSelected={item === 1}
                                        onClick={() => { this.onSettingAsset(i, j) }}
                                        theme={this.state.theme}
                                    >
                                        {this.state.value[i][j] > 0 && <Icon src={this.state.icons[this.state.value[i][j]]}></Icon>}
                                    </GridItem>
                                ))}
                            </GridRow>
                        ))}
                    </Grid>
                </Wrapper>
            </Main>
        );
    }
}

export default App;