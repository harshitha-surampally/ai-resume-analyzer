import ResumeUpload from "@/components/ResumeUpload";

export default function UploadPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16">
      <div className="mb-8 max-w-md text-center">
        <span className="font-mono text-xs tracking-[0.2em] text-mark">
          STEP 1
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-paper sm:text-4xl">
          Upload your resume
        </h1>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          PDF or DOCX, up to 5MB.
        </p>
      </div>
      <ResumeUpload />
    </main>
  );
}
