import React from 'react';
import styled from 'styled-components';
import CustomVcc from '@withkoji/custom-vcc-sdk';
import Koji from "@withkoji/vcc";

const Wrapper = styled.div`
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
    width: 100%;
    display: flex;
    
`;

const GridItem = styled.div`
    cursor: pointer;
    
    width: 30px;
    height: 30px;
   

    &:hover{
        opacity: 0.7;
    }
`;

const Icon = styled.img`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  backgroundColor: ${Koji.config.colors.gridItemBackground};
`;

const Label = styled.div`
  font-size: 14px;
  color: ${Koji.config.colors.text};
  margin-left: 2vmin;
  margin-bottom: 1vmin;

`;

let maxValue = 0;
class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.customVcc = new CustomVcc();

        const initialGrid = Array(12).fill(Array(12).fill(0));

        this.state = {
            value: initialGrid,
            theme: this.customVcc.theme,
            maxIndex: 2,
            setAllIndex: 0,
            icons: [Koji.config.images.emptySpace,
            Koji.config.images.wall,
            Koji.config.images.player]

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

        console.log(row, item);
    }

    render() {
        return (
            <Wrapper style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                <Grid theme={this.state.theme}>
                    {this.state.value.map((row, i) => (
                        <GridRow key={i}>
                            {this.state.value[i].map((item, j) => (
                                <GridItem
                                    key={`${i}-${j}`}
                                    isSelected={item === 1}
                                    onClick={() => {
                                        this.onIncrease(i, j)
                                    }}
                                    theme={this.state.theme}
                                >
                                    {this.state.value[i][j] > 0 && <Icon src={this.state.icons[this.state.value[i][j]]}></Icon>}

                                </GridItem>
                            ))}
                        </GridRow>
                    ))}
                </Grid>
            </Wrapper>
        );
    }
}

export default App;
