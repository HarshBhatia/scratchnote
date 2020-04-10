import localforage from "localforage";
import React, { useState } from "react";
import styled from "styled-components";

import { Header, Wrapper } from "../styles/Layout";

const dtfIN = new Intl.DateTimeFormat("IN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});
export default ({
  recordings,
  deleteRecording,
  visibleOnPhone,
  setIsVisibleOnPhone,
}) => {
  const [playingKey, setPlayingKey] = useState(null);
  const [playingFile, setPlayingFile] = useState(null);
  return (
    <Wrapper visibleOnPhone={visibleOnPhone}>
      <CloseButton onClick={() => setIsVisibleOnPhone(false)}>
        <img src={require("../assets/x.svg")} alt="Close" />
      </CloseButton>
      <Header>
        <h3>Recordings</h3>
      </Header>
      <RecordingList>
        {recordings &&
          Object.keys(recordings).map((k) => (
            <RecordingContainer
              key={k}
              onClick={async () => {
                if (playingKey === k) return setPlayingKey(null);
                setPlayingKey(k);
                setPlayingFile(
                  URL.createObjectURL(await localforage.getItem(`file:${k}`))
                );
              }}
            >
              {/* <p>{JSON.stringify(recordings[k])}</p> */}
              <Title>{recordings[k].name}</Title>
              <TimeStamp>{dtfIN.format(recordings[k].createdAt)}</TimeStamp>
              <DeleteButton onClick={() => deleteRecording(k)}>
                <img
                  src={require("../assets/trash.svg")}
                  alt={"Delete"}
                  style={{ height: "1.35rem" }}
                />
              </DeleteButton>
              {playingKey === k && (
                <Player autoplay src={playingFile} controls />
              )}
            </RecordingContainer>
          ))}
      </RecordingList>
    </Wrapper>
  );
};
const Title = styled.p`
  font-weight: 500;
  text-transform: uppercase;
  font-size: 16px;
  margin-bottom: 10px;
`;
const TimeStamp = styled.span`
  font-weight: 500;
  text-transform: uppercase;
  font-size: 12px;
  margin-bottom: 0;
  color: #555555;
`;
const Player = styled.audio`
  width: fill-available;
  -webkit-appearance: none;
  color: white;
`;
const DeleteButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: #212121;
  position: absolute;
  right: 1rem;
  top: 1.7rem;

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
  position: relative;
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
