export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ALLOWED_EXTENSIONS = [".pdf", ".docx"] as const;

type FileLike = {
  name: string;
  type: string;
};

export function isAllowedFileType(file: FileLike): boolean {
  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();

  const hasAllowedMimeType = (
    ALLOWED_MIME_TYPES as readonly string[]
  ).includes(file.type);
  const hasAllowedExtension = (
    ALLOWED_EXTENSIONS as readonly string[]
  ).includes(extension);

  return hasAllowedMimeType || hasAllowedExtension;
}

export function isAllowedFileSize(sizeInBytes: number): boolean {
  return sizeInBytes > 0 && sizeInBytes <= MAX_FILE_SIZE_BYTES;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
