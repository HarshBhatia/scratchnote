import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Header, Wrapper } from "../styles/Layout";

async function getAudioInputDevices() {
  if (!("mediaDevices" in navigator)) return [];

  const allDevices = await navigator.mediaDevices.enumerateDevices();
  return allDevices.filter(d => d.kind === "audioinput");
}

export default ({ onConfigChange }) => {
  const [availableMics, setAvailableMics] = useState([]);
  const [selectedMicIndex, setSelectedMicIndex] = useState(0);
  useEffect(() => {
    // getAudioInputDevices.then(setAvailableMics);
  }, [availableMics]);

  return (
    <Wrapper>
      {" "}
      <Header>
        <h3>Options</h3>
      </Header>
      <div onChange={({ target: { value } }) => setSelectedMicIndex(value)}>
        <p>Select input:</p>
        {availableMics.map(({ deviceId }, i) => (
          <p key={deviceId}>
            <input type="radio" name="audioInputDevice" value={deviceId} />
            {deviceId}
          </p>
        ))}
      </div>
    </Wrapper>
  );
};
