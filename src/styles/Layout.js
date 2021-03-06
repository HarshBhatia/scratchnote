import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10vh;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  height: 70vh;
  background: #f5f8fa;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  @media screen and (max-width: 768px) {
    width: 100%;
    margin-top: 0;
    height: inherit;
  }
`;

export const Wrapper = styled.div`
  flex: 300px;
  font-family: "Work Sans", sans-serif;
  @media screen and (max-width: 768px) {
    ${(props) =>
      !props.visibleOnPhone &&
      css`
        display: none;
      `}
  }
  height: inherit;
`;

export const Header = styled.div`
  background: #ffffff;
  margin: 0;
  font-weight: bold;
  font-size: 0.875rem;
  text-transform: uppercase;
  padding: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;
