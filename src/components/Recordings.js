import React from "react";
import styled from "styled-components";

import { Header, Wrapper } from "../styles/Layout";

export default ({ recordings, deleteRecording }) => {
  return (
    <Wrapper>
      <Header>
        <h3>Recordings</h3>
      </Header>
      <RecordingList>
        {recordings.map(f => (
          <RecordingContainer key={f.name}>
            <span>{f.name}</span>
            <Controls>
              <Player src={f.toURL()} controls />
              <button onClick={deleteRecording} children="Delete" />
            </Controls>
          </RecordingContainer>
        ))}
      </RecordingList>
    </Wrapper>
  );
};

const Player = styled.audio`
  width: fill-available;
`;

const RecordingList = styled.div`
  height: 70vh;
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
