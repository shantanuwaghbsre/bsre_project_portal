import React, { useState } from "react";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { Stack } from "@mui/material";
interface Base64ToPdfProps {
  b64: string;
}

const Base64ToPdf: React.FC<Base64ToPdfProps> = ({ b64 }) => {
  const [open, setOpen] = useState(false);
  const [pdfInfo, setPdfInfo] = useState({
    fileSize: "",
    pdfVersion: "",
    createDate: "",
    modifyDate: "",
    creatorTool: "",
  });

  const decodeBase64 = () => {
    // Decode the Base64 string to binary
    const bin = atob(b64);
    setOpen(!open);
    // Extract some information about the PDF file
    const fileSize = Math.round(bin.length / 1024) + " KB";
    const pdfVersion = bin.match(/^.PDF-([0-9.]+)/)?.[1] || "Unknown";
    const createDate =
      bin.match(/<xmp:CreateDate>(.+?)<\/xmp:CreateDate>/)?.[1] || "Unknown";
    const modifyDate =
      bin.match(/<xmp:ModifyDate>(.+?)<\/xmp:ModifyDate>/)?.[1] || "Unknown";
    const creatorTool =
      bin.match(/<xmp:CreatorTool>(.+?)<\/xmp:CreatorTool>/)?.[1] || "Unknown";

    // Set the PDF information in the state
    setPdfInfo({ fileSize, pdfVersion, createDate, modifyDate, creatorTool });
  };

  const pdfDataUrl = `data:application/pdf;base64,${b64}`;

  return (
    <div>
      {b64 !== "" ? (
        <>
          <h1 style={{ fontFamily: "revert-layer" }}>
            Residential Quotation PDF
          </h1>

          <object
            data={pdfDataUrl}
            type="application/pdf"
            width="100%"
            height="1000px"
            aria-label="PDF Preview"
          >
            <p>
              Your browser does not support PDFs. Please download the file to
              view it.
            </p>
          </object>
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <Stack>
              <button onClick={decodeBase64}>Show PDF Information</button>
              {pdfInfo.fileSize && open === true ? (
                <div>
                  <h3>PDF Information:</h3>
                  <p>File Size: {pdfInfo.fileSize}</p>
                  <p>PDF Version: {pdfInfo.pdfVersion}</p>
                  <p>Create Date: {pdfInfo.createDate}</p>
                  <p>Modify Date: {pdfInfo.modifyDate}</p>
                  <p>Creator Tool: {pdfInfo.creatorTool}</p>
                </div>
              ) : null}
            </Stack>

            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <h3>Download PDF</h3>
              <a href={pdfDataUrl} download="file.pdf">
                <DownloadForOfflineIcon
                  style={{ height: "40px", width: "40px" }}
                />
              </a>
            </Stack>
          </Stack>
        </>
      ) : null}
    </div>
  );
};

export default Base64ToPdf;
