import React, { Component } from "react";
import DropzoneComponent from "react-dropzone-component";
import "dropzone/dist/min/dropzone.min.css";

const ReactDOMServer = require("react-dom/server");

const dropzoneComponentConfig = {
  iconFiletypes: [],
  showFiletypeIcon: true,
  postUrl: "https://httpbin.org/post",
};

const dropzoneConfig = {
  maxFiles: 1,
  uploadMultiple: false,
  thumbnailHeight: 25,
  maxFilesize: 2,
  maxFileSize: 2,
  parallelUploads: 1,
  dictDefaultMessage: "Clique aqui ou arraste para anexar",
  dictFileTooBig: "Seu arquivo é muito grande!",
  dictInvalidFileType: "Tipo de arquivo inválido",
  dictMaxFilesExceeded: "Só é permitido anexar 1 (um) arquivo",
  // acceptedFiles: "*",
  renameFilename: name => name.replace(/[^\w\s]/gi, ""),

  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className="dz-preview dz-file-preview mb-3">
      <div className="d-flex flex-row ">
        <div className="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
          <div>
            {" "}
            <span data-dz-name />{" "}
          </div>
          <div className="text-primary text-extra-small" data-dz-size />
          <div className="dz-progress">
            <span className="dz-upload" data-dz-uploadprogress />
          </div>
          <div className="dz-error-message">
            <span data-dz-errormessage />
          </div>
        </div>
      </div>
      <a href="#/" className="remove" data-dz-remove>
        <i className="glyph-icon simple-icon-trash" style={{ fontSize: "14px" }} />{" "}
      </a>
    </div>,
  ),
  headers: { "My-Awesome-Header": "header value" },
};

export default class DropzoneExample extends Component {
  render() {
    return (
      <DropzoneComponent
        className="simple-dropzone"
        config={dropzoneComponentConfig}
        djsConfig={{ ...dropzoneConfig, ...this.props.dropzoneConfig }}
        eventHandlers={{
          uploadprogress: () => this.props.setFileUploading(true),
          success: file => {
            this.props.setFiles(file);
            this.props.setFileUploading(false);
          },
          removedfile: file => this.props.setFiles(this.props.files.filter(i => i.upload.uuid !== file.upload.uuid)),
          init: dropzone => {
            this.myDropzone = dropzone;
          },
        }}
      />
    );
  }
}
