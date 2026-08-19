# AI Resume Analyzer

An AI-powered resume analysis and optimization web application that helps users evaluate their resumes, identify ATS issues, compare them against a job description, and improve resume content using AI.

## Features

- Upload resumes in PDF or DOCX format
- Resume text extraction
- AI-powered resume analysis
- Overall resume score
- Resume strengths and weaknesses
- Actionable improvement suggestions
- ATS compatibility score
- ATS issue detection
- Section-by-section feedback
- Recommended keywords
- Missing resume sections
- Priority improvements
- Achievement suggestions
- Optional job-description matching
- Matched and missing skills
- AI-powered resume improvement suggestions
- Original vs improved resume content
- Explanation of why each improvement is better
- Saved resume analysis history
- Saved resume improvement versions
- Persistent analysis data using Prisma and SQLite
- Input validation and error handling

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Google Gemini API
- Prisma ORM
- SQLite
- PDF/DOCX resume text extraction

## How It Works

### 1. Upload Resume

The user uploads a PDF or DOCX resume.

The application validates:

- File type
- File extension
- File size
- Required upload data

The maximum supported file size is 5 MB.

### 2. Extract Resume Text

The uploaded resume is processed and its text is extracted.

The application does not need to permanently store the uploaded resume file for analysis.

### 3. Analyze Resume

The extracted resume text is sent to the AI analysis pipeline.

The AI generates structured resume feedback including:

- Overall score
- Summary
- Strengths
- Weaknesses
- Suggestions
- ATS score
- ATS issues
- Section feedback
- Recommended keywords
- Missing sections
- Priority improvements
- Achievement suggestions

### 4. Job Description Matching

A job description can optionally be provided.

When provided, the AI also calculates:

- Job match score
- Matched skills
- Missing skills

### 5. Resume Improvement

The application can generate targeted improvements for resume content.

Each improvement contains:

- Resume section
- Original text
- Improved text
- Rationale

The application also validates generated improvements to prevent unsupported content from being introduced.

### 6. Save Results

Resume analyses are stored using Prisma and SQLite.

Saved analyses can be viewed through the Analysis History page.

Improvement versions are also saved and associated with their original analysis.

## Project Structure

The project follows a Next.js application structure with separate areas for:

- Pages and routes
- Reusable UI components
- AI analysis and improvement logic
- API routes
- Resume extraction utilities
- Upload validation
- Prisma database access
- Shared TypeScript types

Important areas include:

```text
app/
components/
lib/
prisma/
generated/