import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Classes } from "@blueprintjs/core";
import { When } from "react-if";

const FileUpload = ({ onChange, id }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const onDrop = useCallback(
    (file) => {
      console.log(file, "ev");
      if (file.length > 0) {
        setSelectedFile(file[0]);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);
        fileReader.onload = () => {
          onChange?.(fileReader.result.split(",")[1]);
        };
      }
    },
    [onChange]
  );

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
    },
    onDrop,
    isDragActive: true,
  });

  const imgSrc = useMemo(() => {
    return selectedFile === null ? null : URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  return (
    <div {...getRootProps()} className={Classes.CARD}>
      <input id={id} {...getInputProps()} />
      <When condition={!isDragActive && selectedFile === null}>
        <div>
          <h3>Silakan tarik file ke kotak</h3>
          <p>Pilih file gambar (JPEG dan PNG)</p>
        </div>
      </When>
      <When condition={selectedFile !== null}>
        <div>
          <img src={imgSrc} style={{ width: "100%" }} alt="Upload" />
          <p>{selectedFile?.name}</p>
        </div>
      </When>
    </div>
  );
};

export default FileUpload;
