import React, { useEffect, useState } from "react";

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
    <div>
      <h3>Recorder</h3>
      {isRecording ? (
        <p>Recording...</p>
      ) : (
        <audio
          controls
          src={recordedFile ? URL.createObjectURL(recordedFile) : ""}
        />
      )}
      <br />
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop" : "Start"} Recording
      </button>
      {!isRecording && recordedFile && (
        <button
          onClick={() => {
            saveRecording(recordedFile);
            setRecordedFile(null);
          }}
          children={"Save Recording"}
        />
      )}
    </div>
  );
};
