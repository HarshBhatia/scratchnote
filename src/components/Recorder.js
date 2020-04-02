import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Header, Wrapper } from "../styles/Layout";

export default ({ config, saveRecording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    async function initRecorder() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: config.deviceId },
          video: false
        });

        const mediaRecorder = new MediaRecorder(stream, config.fileOptions);
        let recordedChunks = [];

        mediaRecorder.addEventListener("dataavailable", function(e) {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        });

        mediaRecorder.addEventListener("stop", function() {
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
      <RecordButton onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop" : "Start"}
      </RecordButton>
      <Player>
        {!isRecording && recordedFile && (
          <button
            onClick={() => {
              saveRecording(recordedFile);
              setRecordedFile(null);
            }}
            children={"Save Recording"}
          />
        )}
        {isRecording ? (
          <p>Recording...</p>
        ) : (
          <audio
            controls
            src={recordedFile ? URL.createObjectURL(recordedFile) : ""}
          />
        )}
      </Player>
    </Wrapper>
  );
};

const RecordButton = styled.button`
  align-self: center;
  margin: auto;
  -webkit-appearance: none;
  height: 5rem;
  width: 5rem;
  border-radius: 5rem;
  font-family: "Work Sans", sans-serif;
  font-weight: bold;
  color: white;
  background: red;
  box-shadow: -10 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: none;
  /* box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-size: 0.9rem;
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
      " 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
  }
};

const Player = styled.div`
  position: absolute;
  align-self: center;

  bottom: 0px;
`;
