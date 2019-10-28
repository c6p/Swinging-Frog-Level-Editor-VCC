import React from 'react';
import styled from 'styled-components';
import CustomVcc from '@withkoji/custom-vcc-sdk';
import Koji from "@withkoji/vcc";

const Wrapper = styled.div`
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100%;
    padding-top: 5vmin;
    display: flex;
    flex-direction: column;
    background-color: ${Koji.config.colors.background};
`;

const Grid = styled.div`
    border: 1px solid ${({ theme }) => theme.colors['border.default'] || 'black'};
    width: 100vw;
    display: flex;
    flex-direction: column;

    user-select: none;
    text-align: center;
`;

const GridRow = styled.div`
    width: 100%;
    display: flex;
`;

const GridItem = styled.div`
    cursor: pointer;
    
    width: 10%;
    height: auto;

    border: 0.1vmin solid black;
  
    padding: 1vmin;

   

    &:hover{
        opacity: 0.7;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;

    justify-content: center;
    align-items: center;
    margin-bottom: 2vmin;


    
`;

const Input = styled.input`
    border: 0;
    opacity: 0.8;

    border-radius: 1vmin;

    font-family: inherit;

    padding: 1vmin;

    transition: all 0.1s ease-out;

    width: auto;

    color: ${Koji.config.colors.inputLabel};
    background-color: ${Koji.config.colors.inputBackground};

    &:hover{
        opacity: 1;
    }
`;

const InputLabel = styled.div`
    margin-right: 1vmin;
    color: ${Koji.config.colors.inputLabel};
    
`;

const InputButton = styled.button`
    border: 0;
    color: ${Koji.config.colors.inputLabel};
    background-color: ${Koji.config.colors.inputBackground};

    outline: none;

    font-family: inherit;
    border-radius: 1vmin;
    margin-right: 2vmin;
    font-size: 3vmin;

    padding: 1vmin;

    opacity: 0.8;

      &:hover{
        opacity: 1;
    }
`;

const WarningLabel = styled.div`
    font-size: 3vmin;
    color: ${Koji.config.colors.inputLabel};

    margin-left: 1vmin;

`;


let maxValue = 0;
class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.customVcc = new CustomVcc();

        const initialGrid = Array(11).fill(Array(11).fill(0));

        this.state = {
            value: initialGrid,
            theme: this.customVcc.theme,
            maxIndex: 2,
            setAllIndex: 0

        };


        console.log(this.state.value)

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



        this.assignColor = this.assignColor.bind(this);
        this.initMaxIndex = this.initMaxIndex.bind(this);
    }

    initMaxIndex() {
        maxValue = 0;
        for (let i = 0; i < this.state.value.length; i++) {
            for (let j = 0; j < this.state.value[i].length; j++) {
                if (this.state.value[i][j] > maxValue) {

                    maxValue = this.state.value[i][j];
                }
            }
        }

        this.setState({ maxIndex: maxValue }, () => {

            if (this.state.maxIndex < 1) {
                this.setState({ maxIndex: 1 });
            }
        });

    }

    componentDidMount() {
        this.customVcc.register('500px', '550px');

        setTimeout(this.initMaxIndex, 500);

        WebFont.load({ google: { families: [Koji.config.settings.googleFont] } });
        document.body.style.fontFamily = Koji.config.settings.googleFont;

        document.addEventListener('contextmenu', event => event.preventDefault());

    }

    onIncrease(row, item) {

        const newValue = [...this.state.value];
        const newRow = [...newValue[row]];
        newRow[item]++;
        if (newRow[item] > this.state.maxIndex) {
            newRow[item] = 0;
        }

        newValue[row] = newRow;
        this.customVcc.change(newValue);
        this.customVcc.save();
    }

    handleMaxChange(event) {

        this.setState({ maxIndex: event.target.value })
    }

    setAll() {
        const newValue = Array(11).fill(Array(11).fill(this.state.setAllIndex));

        this.setState({
            value: newValue
        });
    }

    handleSetChange(event) {

        this.setState({ setAllIndex: event.target.value })
    }
    assignColor(value) {
        if (value < Koji.config.colors.gridItemColors.length) {
            return Koji.config.colors.gridItemColors[value];
        } else {
            return "#ffffff";
        }
    }

    render() {
        return (
            <Wrapper>
                <InputWrapper>
                    <InputLabel>{"Max Index:"} </InputLabel>

                    <Input type="number" onChange={(event) => this.handleMaxChange(event)} value={this.state.maxIndex} />
                </InputWrapper>

                <Grid theme={this.state.theme}>
                    {this.state.value.map((row, i) => (
                        <GridRow key={i}>
                            {this.state.value[i].map((item, j) => (
                                <GridItem
                                    key={`${i}-${j}`}
                                    isSelected={item === 1}
                                    onClick={() => this.onIncrease(i, j)}
                                    theme={this.state.theme}
                                    style={{ backgroundColor: this.assignColor(this.state.value[i][j]) }}
                                >
                                    {this.state.value[i][j]}
                                </GridItem>
                            ))}
                        </GridRow>
                    ))}
                </Grid>


                <InputWrapper style={{ justifyContent: "flex-end", marginTop: "3vmin", marginRight: "3vmin" }}>

                    <InputButton
                        onClick={() => this.setAll()}
                    >{"Fill"}
                    </InputButton>

                    <Input type="number" onChange={(event) => this.handleSetChange(event)} value={this.state.setAllIndex} />
                </InputWrapper>

                <WarningLabel> {"0 - Empty Space"} </WarningLabel>
                <WarningLabel> {"Important: Grid values must NOT exceed the array length of objects in the level."} </WarningLabel>
                <WarningLabel> {"Example: If you have 3 available blocks defined, grid values must not be higher than 3."} </WarningLabel>
            </Wrapper>
        );
    }
}

export default App;
