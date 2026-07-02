"use client";

import { useCallback, useRef, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import {
  MAX_FILE_SIZE_BYTES,
  formatFileSize,
  isAllowedFileSize,
  isAllowedFileType,
} from "@/lib/upload";
import { UploadResponse, UploadStatus } from "@/types";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = useCallback((candidate: File) => {
    if (!isAllowedFileType(candidate)) {
      setFile(null);
      setStatus("error");
      setMessage("Only PDF and DOCX files are supported.");
      return;
    }

    if (!isAllowedFileSize(candidate.size)) {
      setFile(null);
      setStatus("error");
      setMessage(
        `File is too large. Maximum size is ${formatFileSize(
          MAX_FILE_SIZE_BYTES
        )}.`
      );
      return;
    }

    setFile(candidate);
    setStatus("idle");
    setMessage("");
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      const dropped = event.dataTransfer.files?.[0];
      if (dropped) validateAndSetFile(dropped);
    },
    [validateAndSetFile]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) validateAndSetFile(selected);
    // allow re-selecting the same file after removal
    event.target.value = "";
  };

  const openFileDialog = () => inputRef.current?.click();

  const removeFile = () => {
    setFile(null);
    setStatus("idle");
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.message || "Upload failed. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "File uploaded successfully");
    } catch {
      setStatus("error");
      setMessage(
        "Something went wrong. Please check your connection and try again."
      );
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFileDialog();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mark ${
          isDragActive
            ? "border-mark bg-mark-soft/10"
            : "border-ink-line bg-ink/40 hover:border-paper/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleInputChange}
          className="hidden"
        />

        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mb-4 text-ink-soft"
          aria-hidden="true"
        >
          <path
            d="M12 16V4m0 0-4 4m4-4 4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="font-display text-base font-semibold text-paper">
          Drag &amp; drop your resume here
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          or click to browse — PDF or DOCX, up to{" "}
          {formatFileSize(MAX_FILE_SIZE_BYTES)}
        </p>
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-ink-line bg-ink/40 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-mono text-xs text-mark">FILE</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-paper">
                {file.name}
              </p>
              <p className="text-xs text-ink-soft">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            aria-label="Remove selected file"
            className="ml-3 shrink-0 text-ink-soft transition-colors hover:text-mark"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M5 5L15 15M15 5L5 15" />
            </svg>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || status === "uploading"}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-mark px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-mark-soft disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "uploading" ? (
          <>
            <Spinner className="h-4 w-4" />
            Uploading...
          </>
        ) : (
          "Upload resume"
        )}
      </button>

      {status === "success" && (
        <p role="status" className="mt-3 text-sm font-medium text-signal">
          {message}
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="mt-3 text-sm font-medium text-mark">
          {message}
        </p>
      )}
    </div>
  );
}
