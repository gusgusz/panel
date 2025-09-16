import React, { useState } from "react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

const quillModules = {
  toolbar: [["bold", "italic", "underline", "strike"]],
};

{
  /*toolbar: [
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],*/
}

{
  /*const quillFormats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];*/
}
const quillFormats = ["header", "bold", "italic", "underline"];

const EditorsUi = ({ match, value, setValue }) => {
  return <ReactQuill theme="snow" value={value} onChange={val => setValue(val)} modules={quillModules} formats={quillFormats} />;
};
export default EditorsUi;
