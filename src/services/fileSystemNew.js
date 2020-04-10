import localforage from "localforage";
import { useEffect, useState } from "react";

export default (name, size) => {
  const [files, setFiles] = useState(null);
  useEffect(() => {
    localforage.config({ name, size });
  }, []);

  useEffect(() => {
    const allFiles = {};
    localforage
      .iterate((value, key) => {
        if (!key.includes("file:")) {
          allFiles[key] = value;
        }
      })
      .then(() => setFiles(allFiles))
      .catch(console.log);
  }, [localforage.length()]);

  const saveFile = async (blob, name) => {
    console.log("called save file");
    const id = generateRandomID();

    const meta = { name, createdAt: Date.now() };

    try {
      await localforage.setItem(id, meta);
      await localforage.setItem(`file:${id}`, blob);
      return id;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteFile = async (fileId) => {
    await localforage.removeItem(fileId);
  };

  return [files, { saveFile, deleteFile }];
};

const generateRandomID = () => {
  return Math.trunc(Math.random() * 1000000).toString();
};
