export type NavLink = {
  label: string;
  href: string;
};

export type Feature = {
  tag: string;
  title: string;
  description: string;
};

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export type UploadResponse = {
  success: boolean;
  filename?: string;
  message: string;
};
