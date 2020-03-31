import React from "react";

export default ({ recordings, deleteRecording }) => {
  return (
    <div>
      <h3>Recordings</h3>
      {recordings.map(f => (
        <div key={f.name}>
          <span>{f.name}</span>
          <audio src={f.toURL()} controls />
          <button onClick={deleteRecording} children="Delete" />
        </div>
      ))}
    </div>
  );
};
