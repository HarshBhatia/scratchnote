import { useEffect, useState } from "react";

export default ({ fileSystemSize }) => {
  const [files, setFiles] = useState([]);
  const [fileSystem, setFileSystem] = useState(null);
  const [fileCount, setFileCount] = useState(0);

  //init filesystem
  useEffect(() => {
    const onRequestQuotaSuccess = () => {
      window.webkitRequestFileSystem(
        window.PERSISTENT,
        fileSystemSize,
        setFileSystem
      );
    };

    navigator.webkitPersistentStorage.requestQuota(
      fileSystemSize,
      onRequestQuotaSuccess
    );
  }, [fileSystemSize]);

  //update files object
  useEffect(() => {
    if (!fileSystem) return;

    var dirReader = fileSystem.root.createReader();
    var entries = [];
    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function() {
      dirReader.readEntries(
        function(results) {
          if (!results.length) {
            setFiles(entries.sort());
            setFileCount(entries.length);
          } else {
            entries = entries.concat(toArray(results));
            readEntries();
          }
        },
        e => {
          throw new Error(e);
        }
      );
    };

    readEntries(); // Start reading dirs.
  }, [fileCount, fileSystem]);

  const saveFile = (blob, fileName = `reording${fileCount}`) => {
    fileSystem.root.getFile(fileName, { create: true }, function(file) {
      file.createWriter(function(fileContent) {
        fileContent.write(blob);
        setFileCount(fileCount + 1);
      });
    });
  };
  const deleteFile = () => {};

  return [files, { saveFile, deleteFile }];
};

function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}
