"use client";

import { useCallback, useRef, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import {
  MAX_FILE_SIZE_BYTES,
  formatFileSize,
  isAllowedFileSize,
  isAllowedFileType,
} from "@/lib/upload";
import type {
  ExtractionResult,
  UploadResponse,
  UploadStatus,
} from "@/types";
import type { ResumeAnalysisResult } from "@/lib/ai/types";
import AnalysisResult from "@/components/AnalysisResult";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = useCallback((candidate: File) => {
    if (!isAllowedFileType(candidate)) {
      setFile(null);
      setStatus("error");
      setMessage("Only PDF and DOCX files are supported.");
      setExtraction(null);
      setAnalysis(null);
      setAnalysisError(null);
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
      setExtraction(null);
      setAnalysis(null);
      setAnalysisError(null);
      return;
    }

    setFile(candidate);
    setStatus("idle");
    setMessage("");
    setExtraction(null);
    setAnalysis(null);
    setAnalysisError(null);
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
    setExtraction(null);
    setAnalysis(null);
    setAnalysisError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setMessage("");
    setExtraction(null);
    setAnalysis(null);
    setAnalysisError(null);

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
        setExtraction(null);
        return;
      }

      setStatus("success");
      setMessage(data.message || "File uploaded successfully");
      setExtraction(data.extraction ?? null);
    } catch {
      setStatus("error");
      setMessage(
        "Something went wrong. Please check your connection and try again."
      );
      setExtraction(null);
    }
  };
const handleAnalyze = async () => {
  if (!extraction?.success) return;

  setIsAnalyzing(true);
  setAnalysisError(null);
  setAnalysis(null);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText: extraction.data.text,
        filename: file?.name ?? "",
        jobDescription: jobDescription.trim() || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setAnalysisError(data.error || "Analysis failed. Please try again.");
      return;
    }

    setAnalysis(data.result);
  } catch {
    setAnalysisError(
      "Something went wrong while analyzing the resume. Please try again."
    );
  } finally {
    setIsAnalyzing(false);
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
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mark ${isDragActive
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
      {extraction?.success === true && (
        <div className="mt-4 rounded-xl border border-ink-line bg-ink/40 px-4 py-3">
          <p className="font-mono text-xs text-ink-soft">
            {extraction.data.fileType.toUpperCase()} • Extracted{" "}
            {extraction.data.charCount.toLocaleString()} characters
          </p>

          <p className="mt-2 line-clamp-3 text-sm text-paper">
            {extraction.data.text.slice(0, 300)}
            {extraction.data.text.length > 300 ? "…" : ""}
          </p>
        </div>
      )}

      {extraction?.success === false && (
        <p role="alert" className="mt-3 text-sm font-medium text-mark">
          Text extraction: {extraction.message}
        </p>
      )}
      {extraction?.success === true && (
  <div className="mt-4">
    <label
      htmlFor="job-description"
      className="mb-1 block text-sm font-medium text-paper"
    >
      Job description <span className="text-ink-soft">(optional)</span>
    </label>

    <textarea
      id="job-description"
      value={jobDescription}
      onChange={(event) => setJobDescription(event.target.value)}
      placeholder="Paste a job description here to compare it against this resume later..."
      rows={6}
      className="w-full rounded-xl border border-ink-line bg-ink/40 px-4 py-3 text-sm text-paper placeholder:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-mark"
    />
  </div>
)}
      {extraction?.success === true && (
  <button
    type="button"
    onClick={handleAnalyze}
    disabled={isAnalyzing}
    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-mark px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-mark-soft disabled:cursor-not-allowed disabled:opacity-40"
  >
    {isAnalyzing ? (
      <>
        <Spinner className="h-4 w-4" />
        Analyzing...
      </>
    ) : (
      "Analyze Resume"
    )}
  </button>
)}

{analysisError && (
  <p role="alert" className="mt-3 text-sm font-medium text-mark">
    {analysisError}
  </p>
)}

{analysis && <AnalysisResult analysis={analysis} />}
    </div>
  );
}
