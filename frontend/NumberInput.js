import styled from 'styled-components';

const Input = styled.input.attrs(props => ({
  type: "number",
  min: props.min || 0,
  max: props.max || null,
  size: props.size || "0.5em",
}))`
  color: #3;
  font-size: 1em;
  border: 2px solid #666;
  border-radius: 3px;
  width: 5rem;

  /* here we use the dynamically computed prop */
  margin: ${props => props.size};
  padding: ${props => props.size};
`;

export default Input;
