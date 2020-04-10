import React, { useState } from "react";

import Recorder from "./components/Recorder";
import Recordings from "./components/Recordings";
import Settings from "./components/Settings";
import useFilesystem from "./services/fileSystemNew";
import { Container } from "./styles/Layout";

const FILE_SYSTEM_NAME = "scratchnote";
const FILE_SYSTEM_SIZE = 10 * 1024 * 1024;

export default () => {
  const [config, setConfig] = useState({
    deviceId: "default",
    fileOptions: { mimeType: "audio/webm" },
  });

  const [isRecordingsVisibleOnPhone, setIsRecordingsVisibleOnPhone] = useState(
    false
  );
  const [isSettingsVisibleOnPhone, setIsSettingsVisibleOnPhone] = useState(
    false
  );
  const [files, { saveFile, deleteFile }] = useFilesystem(
    FILE_SYSTEM_NAME,
    FILE_SYSTEM_SIZE
  );

  return (
    <Container>
      <Recordings
        visibleOnPhone={isRecordingsVisibleOnPhone}
        setIsVisibleOnPhone={setIsRecordingsVisibleOnPhone}
        recordings={files}
        deleteRecording={deleteFile}
      />
      <Settings
        visibleOnPhone={isSettingsVisibleOnPhone}
        setIsVisibleOnPhone={setIsSettingsVisibleOnPhone}
        onConfigChange={setConfig}
      />
      <Recorder
        setIsRecordingsVisibleOnPhone={setIsRecordingsVisibleOnPhone}
        setIsSettingsVisibleOnPhone={setIsSettingsVisibleOnPhone}
        config={config}
        saveRecording={saveFile}
      />
    </Container>
  );
};
