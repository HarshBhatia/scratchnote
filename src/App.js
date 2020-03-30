import React, { useEffect, useState } from "react";
const options = { mimeType: "audio/webm" };
const FILE_SYSTEM_SIZE = 10 * 1024 * 1024;
export default () => {
  const [availableMics, setAvailableMics] = useState([]);
  const [selectedMicIndex, setSelectedMicIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordingFile, setRecordingFile] = useState(null);
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    getAudioInputDevices().then(setAvailableMics);
    navigator.permissions.query({ name: "microphone" }).then(function(result) {
      if (result.state === "granted") {
      } else if (result.state === "prompt") {
      } else if (result.state === "denied") {
      }
      result.onchange = function() {};
    });
  }, []);

  useEffect(() => {
    async function initRecorder() {
      try {
        if (availableMics.length < 1 || selectedMicIndex === null) return false;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
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
      } catch (e) {
        alert(JSON.stringify(e));
      }
    }
    initRecorder();
  }, [availableMics, selectedMicIndex]);

  useEffect(() => {
    listRecordings(setRecordings, console.log);
  }, [recordingFile, isRecording]);

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

  const saveRecording = (blob, fileName) => {
    const onRequestQuotaSuccess = () => {
      window.webkitRequestFileSystem(
        window.PERSISTENT,
        FILE_SYSTEM_SIZE,
        onFileSystemAllocate
      );
    };

    const onFileSystemAllocate = fileSystem => {
      fileSystem.root.getFile(fileName, { create: true }, function(file) {
        file.createWriter(function(fileContent) {
          fileContent.write(blob);
          setRecordingFile(null);
        });
      });
    };

    navigator.webkitPersistentStorage.requestQuota(
      FILE_SYSTEM_SIZE,
      onRequestQuotaSuccess
    );
  };

  const listRecordings = (onSuccess, onError) => {
    function onInitFs(fs) {
      var dirReader = fs.root.createReader();
      var entries = [];
      function toArray(list) {
        return Array.prototype.slice.call(list || [], 0);
      }

      // Call the reader.readEntries() until no more results are returned.
      var readEntries = function() {
        dirReader.readEntries(function(results) {
          if (!results.length) {
            onSuccess(entries.sort());
          } else {
            entries = entries.concat(toArray(results));
            readEntries();
          }
        }, onError);
      };

      readEntries(); // Start reading dirs.
    }

    window.webkitRequestFileSystem(
      window.PERSISTENT,
      FILE_SYSTEM_SIZE,
      onInitFs,
      onError
    );
  };

  return (
    <div>
      <hr />
      <h3>Options</h3>
      <div onChange={({ target: { value } }) => setSelectedMicIndex(value)}>
        <p>Select input:</p>
        {availableMics.map(({ deviceId }, i) => (
          <p key={deviceId}>
            <input type="radio" name="audioInputDevice" value={i} />
            {deviceId}
          </p>
        ))}
      </div>
      <hr />
      <h3>Recorder</h3>
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
      {!isRecording && recordingFile && (
        <button
          onClick={() => {
            saveRecording(
              recordingFile,
              prompt("Please enter your name", "Harry Potter") + ".webm"
            );
          }}
        >
          Save recording
        </button>
      )}
      <hr />
      <h3>Recordings</h3>
      {recordings.map(f => (
        <div key={f.name}>
          <span>{f.name}</span>
          <audio src={f.toURL()} controls />
        </div>
      ))}
    </div>
  );
};

const getAudioInputDevices = async () => {
  if (!("mediaDevices" in navigator)) return [];

  const allDevices = await navigator.mediaDevices.enumerateDevices();
  alert(JSON.stringify(allDevices));

  return allDevices.filter(d => d.kind === "audioinput");
};
