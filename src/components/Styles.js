import styled from 'styled-components';

export const Body = styled.div`
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  margin-top: 40px;
`;

export const Button = styled.button`
  background-color: rgb(91, 209, 115);
  border: none;
  border-radius: 8px;
  color: #282c34;
  cursor: pointer;
  font-size: 16px;
  margin: 0px 20px;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
`;

export const Container = styled.div`
  //background-color: linear-gradient(0.1turn, #131111, #242324 50%, #111113);
  background-color: #1a1a1b;
  display: flex;
  flex-direction: column;
  //height: calc(100vh);
  //height: 100vh;
`;

export const Header = styled.header`
  //background-color: #282c34;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 10px;
  justify-content: space-around;
  min-height: 70px;
`;

export const Image = styled.img`
  height: 38vmin;
  pointer-events: none;
`;

export const Link = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  color: rgb(91, 209, 115);
  margin-top: 8px;
  text-decoration: underline;
`;
