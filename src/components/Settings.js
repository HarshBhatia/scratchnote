import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Header, Wrapper } from "../styles/Layout";

async function getAudioInputDevices() {
  if (!("mediaDevices" in navigator)) return [];

  const allDevices = await navigator.mediaDevices.enumerateDevices();
  return allDevices.filter((d) => d.kind === "audioinput");
}

export default ({ onConfigChange, visibleOnPhone, setIsVisibleOnPhone }) => {
  const [availableMics, setAvailableMics] = useState([]);
  const [selectedMicIndex, setSelectedMicIndex] = useState(0);
  useEffect(() => {
    // getAudioInputDevices.then(setAvailableMics);
  }, [availableMics]);

  return (
    <Wrapper visibleOnPhone={visibleOnPhone}>
      <CloseButton
        onClick={() => {
          setIsVisibleOnPhone(false);
        }}
      >
        <img src={require("../assets/x.svg")} alt="Close" />
      </CloseButton>
      <Header>
        <h3>Options</h3>
      </Header>
      <SettingsContainer>
        <div onChange={({ target: { value } }) => setSelectedMicIndex(value)}>
          <p>Select input:</p>
          {availableMics.map(({ deviceId }, i) => (
            <p key={deviceId}>
              <input type="radio" name="audioInputDevice" value={deviceId} />
              {deviceId}
            </p>
          ))}
        </div>
      </SettingsContainer>
    </Wrapper>
  );
};

const CloseButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const SettingsContainer = styled.div`
  padding: 1rem;
`;
