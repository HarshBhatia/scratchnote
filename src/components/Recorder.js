import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Header, Wrapper } from "../styles/Layout";

export default ({
  config,
  saveRecording,
  setIsSettingsVisibleOnPhone,
  setIsRecordingsVisibleOnPhone,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    async function initRecorder() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: config.deviceId },
          video: false,
        });

        const mediaRecorder = new MediaRecorder(stream, config.fileOptions);
        let recordedChunks = [];

        mediaRecorder.addEventListener("dataavailable", function (e) {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        });

        mediaRecorder.addEventListener("stop", function () {
          setRecordedFile(new Blob(recordedChunks));
          recordedChunks = [];
        });
        console.log("media recorder init success!");
        setRecorder(mediaRecorder);
      } catch (e) {
        alert(JSON.stringify(e));
      }
    }
    initRecorder();
  }, [config]);

  const startRecording = async () => {
    if (isRecording) return false;

    setRecordedFile(null);
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!isRecording) return false;

    recorder.stop();
    setIsRecording(false);
  };

  return (
    <Wrapper style={styles.wrapper}>
      <SettingsButton
        onClick={() => {
          setIsSettingsVisibleOnPhone(true);
        }}
      >
        <img src={require("../assets/settings.svg")} alt="Settings" />
      </SettingsButton>
      <RecordButton onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop" : "REC"}
      </RecordButton>
      {!isRecording && recordedFile && (
        <SaveButton
          onClick={() => {
            saveRecording(recordedFile, prompt("filename"));
            setRecordedFile(null);
          }}
          children={"Save"}
        />
      )}
      <Player>
        {isRecording ? (
          <Indicator>RECORDING...</Indicator>
        ) : recordedFile ? (
          <audio
            controls
            src={recordedFile ? URL.createObjectURL(recordedFile) : ""}
          />
        ) : null}
      </Player>
      <RecordingsButton onClick={() => setIsRecordingsVisibleOnPhone(true)}>
        <p style={{ alignSelf: "center", padding: "0.25rem" }}>RECORDINGS</p>
        <img src={require("../assets/file-text.svg")} alt="Settings" />
      </RecordingsButton>
    </Wrapper>
  );
};

const Indicator = styled.p`
  animation: blinkingText 1.2s infinite;
  @keyframes blinkingText {
    0% {
      color: #000;
    }
    49% {
      color: #000;
    }
    60% {
      color: transparent;
    }
    99% {
      color: transparent;
    }
    100% {
      color: #000;
    }
  }
`;

const SaveButton = styled.button`
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  align-self: center;
  /* bottom: 70px; */
  position: absolute;
  -webkit-appearance: none;
  border: none;
  height: fit-content;
  /* padding: 10px; */
  border-radius: 0.2rem;
  background: #1e90ff;
  color: white;
  font-family: "Work Sans";
  font-weight: bold;
  font-size: 1rem;
  text-transform: uppercase;
  width: fit-content;
  padding: 9px 14px;
  bottom: 3.2rem;
`;
const RecordButton = styled.button`
  align-self: center;
  margin-top: 60%;
  -webkit-appearance: none;
  height: 5rem;
  width: 5rem;
  border-radius: 5rem;
  font-family: "Work Sans", sans-serif;
  font-weight: bold;
  color: white;
  background: #ff4757;
  box-shadow: -10 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: none;
  /* box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-size: 1rem;
  text-transform: uppercase;

  &:focus {
    outline: none;
  }
`;

const styles = {
  wrapper: {
    position: "relative",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    boxShadow:
      " 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
};

const Player = styled.div`
  position: absolute;
  align-self: center;

  bottom: 100px;
`;

const SettingsButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
const RecordingsButton = styled.button`
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
