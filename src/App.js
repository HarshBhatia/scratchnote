import React, { useEffect, useState } from "react";
const options = { mimeType: "audio/webm" };

export default () => {
  const [availableMics, setAvailableMics] = useState([]);
  const [selectedMicIndex, setSelectedMicIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordingFile, setRecordingFile] = useState(null);

  useEffect(() => {
    getAudioInputDevices().then(setAvailableMics);
  }, []);

  useEffect(() => {
    async function initRecorder() {
      if (availableMics.length < 1 || selectedMicIndex === null) return false;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: availableMics[selectedMicIndex].deviceId },
        video: false
      });
      const mediaRecorder = new MediaRecorder(stream, options);
      let recordedChunks = [];

      mediaRecorder.addEventListener("dataavailable", function(e) {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });

      mediaRecorder.addEventListener("stop", function() {
        setRecordingFile(new Blob(recordedChunks));
        recordedChunks = [];
      });
      console.log("media recorder init success!");
      setRecorder(mediaRecorder);
    }
    initRecorder();
  }, [availableMics, selectedMicIndex]);

  const startRecording = async () => {
    if (isRecording) return false;

    setRecordingFile(null);
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
      <div onChange={({ target: { value } }) => setSelectedMicIndex(value)}>
        <p>Select input:</p>
        {availableMics.map(({ deviceId }, i) => (
          <p key={deviceId}>
            <input type="radio" name="audioInputDevice" value={i} />
            {deviceId}
          </p>
        ))}
      </div>
      {isRecording ? (
        <p>Recording...</p>
      ) : (
        <audio
          controls
          src={recordingFile ? URL.createObjectURL(recordingFile) : ""}
        />
      )}
      <br />
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop" : "Start"} Recording
      </button>
    </div>
  );
};

const getAudioInputDevices = async () => {
  if (!("mediaDevices" in navigator)) return false;

  const allDevices = await navigator.mediaDevices.enumerateDevices();
  return allDevices.filter(d => d.kind === "audioinput");
};
