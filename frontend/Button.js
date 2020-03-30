import styled from 'styled-components';

const Button = styled.button`
  /* This renders the buttons above... Edit me! */
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0.5rem;
  margin: 0.5rem 1rem;
  background: transparent;
  color: white;
  border: 2px solid #666;
  &:hover{
      background-color: #666;
  }
`;

export default Button;