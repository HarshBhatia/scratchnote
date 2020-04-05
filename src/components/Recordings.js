import React from "react";
import styled from "styled-components";

import { Header, Wrapper } from "../styles/Layout";

export default ({
  recordings,
  deleteRecording,
  visibleOnPhone,
  setIsVisibleOnPhone,
}) => {
  return (
    <Wrapper visibleOnPhone={visibleOnPhone}>
      <CloseButton onClick={() => setIsVisibleOnPhone(false)}>
        <img src={require("../assets/x.svg")} alt="Close" />
      </CloseButton>
      <Header>
        <h3>Recordings</h3>
      </Header>
      <RecordingList>
        {recordings.map((f) => (
          <RecordingContainer key={f.name}>
            <Title>{f.name}</Title>
            <Controls>
              <Player src={f.toURL()} controls />
              <DeleteButton onClick={() => deleteRecording(f)}>
                <img
                  src={require("../assets/trash.svg")}
                  alt={"Delete"}
                  style={{ height: "1.35rem" }}
                />
              </DeleteButton>
            </Controls>
          </RecordingContainer>
        ))}
      </RecordingList>
    </Wrapper>
  );
};
const Title = styled.p`
  font-weight: 500;
  text-transform: uppercase;
  font-size: 12px;
  margin-bottom: 15px;
`;
const Player = styled.audio`
  width: fill-available;
  -webkit-appearance: none;
  color: white;
  height: 20px;
`;
const DeleteButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: #212121;
  margin-top: -3px;

  filter: invert(32%) sepia(8%) saturate(1381%) hue-rotate(180deg)
    brightness(93%) contrast(87%);
  &:focus {
    outline: none;
  }
  &:hover {
    filter: invert(62%) sepia(5%) saturate(2078%) hue-rotate(177deg)
      brightness(79%) contrast(75%);
  }
`;
const RecordingList = styled.div`
  height: inherit;
  overflow: scroll;
`;

const Controls = styled.div`
  display: flex;
`;
const RecordingContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: solid 0.1px #e3e3e3;
`;

const CloseButton = styled.button`
  top: 0.75rem;
  right: 0.75rem;
  position: absolute;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
