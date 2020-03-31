import React, { useState } from "react";

import Recorder from "./components/Recorder";
import Recordings from "./components/Recordings";
import Settings from "./components/Settings";
import useFilesystem from "./services/filesystem";

const FILE_SYSTEM_SIZE = 10 * 1024 * 1024;

export default () => {
  const [config, setConfig] = useState({
    deviceId: "default",
    fileOptions: { mimeType: "audio/webm" }
  });

  const [files, { saveFile, deleteFile }] = useFilesystem(FILE_SYSTEM_SIZE);

  return (
    <div>
      {/* <Settings onConfigChange={setConfig} /> */}
      <Recorder config={config} saveRecording={saveFile} />
      <Recordings recordings={files} deleteRecording={deleteFile} />
    </div>
  );
};
