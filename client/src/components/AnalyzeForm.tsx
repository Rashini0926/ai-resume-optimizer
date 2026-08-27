import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

interface AnalyzeFormProps {
  onSubmit: (resumeText: string, jobDescription: string, industry: string, jobRole: string) => void;
  isLoading: boolean;
}

const industries = [
  "Software Development",
  "Data and Analytics",
  "Cybersecurity",
  "Cloud and DevOps",
  "Finance",
  "Healthcare",
  "Marketing",
  "Education",
  "Engineering",
  "Other",
];

const extractPdfText = async (file: File) => {
  const document = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = await Promise.all(Array.from({ length: document.numPages }, async (_, index) => {
    const page = await document.getPage(index + 1);
    const content = await page.getTextContent();
    return content.items.map((item) => "str" in item ? item.str : "").join(" ");
  }));
  return pages.join("\n\n").trim();
};

function AnalyzeForm({ onSubmit, isLoading }: AnalyzeFormProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [industry, setIndustry] = useState(industries[0]);
  const [jobRole, setJobRole] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBusy = isLoading || isExtracting;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError("");
    if (file.type !== "application/pdf") {
      setUploadError("Please choose a PDF file.");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Please choose a PDF smaller than 10 MB.");
      event.target.value = "";
      return;
    }
    setIsExtracting(true);
    try {
      const extractedText = await extractPdfText(file);
      if (!extractedText) throw new Error("No selectable text was found in this PDF.");
      setResumeText(extractedText);
      setFileName(file.name);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to read this PDF. Please paste your resume text instead.");
      setFileName("");
      event.target.value = "";
    } finally {
      setIsExtracting(false);
    }
  };

  const clearFile = () => {
    setFileName("");
    setResumeText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (resumeText.trim() && jobDescription.trim() && industry && jobRole.trim()) {
      onSubmit(resumeText.trim(), jobDescription.trim(), industry, jobRole.trim());
    }
  };

  return <section className="analysis-card"><div className="card-heading"><div className="heading-icon" aria-hidden="true">✦</div><div><h2>Start your analysis</h2><p>Upload a CV PDF or paste your resume, then add the target job details.</p></div></div><form className="analysis-form" onSubmit={handleSubmit}><div className="job-meta-grid"><label>Industry<select value={industry} onChange={(event) => setIndustry(event.target.value)} required disabled={isBusy}>{industries.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label>Target job role<input type="text" value={jobRole} onChange={(event) => setJobRole(event.target.value)} placeholder="e.g. Frontend Developer" maxLength={120} required disabled={isBusy} /></label></div><div className="form-grid"><div className="resume-field"><div className="field-label">Your resume</div><input ref={fileInputRef} id="resume-pdf" className="file-input" type="file" accept="application/pdf,.pdf" onChange={(event) => void handleFileChange(event)} disabled={isBusy} /><label className="upload-zone" htmlFor="resume-pdf"><span className="upload-icon" aria-hidden="true">↑</span><span><strong>{isExtracting ? "Reading your PDF…" : "Upload CV as PDF"}</strong><small>PDF only · maximum 10 MB</small></span></label>{fileName && <div className="uploaded-file"><span aria-hidden="true">✓</span><span>{fileName}</span><button type="button" onClick={clearFile} disabled={isBusy}>Remove</button></div>}{uploadError && <p className="field-error" role="alert">{uploadError}</p>}<label className="paste-label" htmlFor="resume-text">Or paste resume text<textarea id="resume-text" value={resumeText} onChange={(event) => { setResumeText(event.target.value); setFileName(""); }} rows={7} placeholder="Paste your resume content here..." required disabled={isBusy} /></label></div><label>Job description<textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={15} placeholder="Paste the target job description here..." required disabled={isBusy} /></label></div><button className="analyze-button" type="submit" disabled={isBusy}>{isLoading ? <><span className="spinner" aria-hidden="true" /> Analyzing your resume…</> : isExtracting ? <><span className="spinner" aria-hidden="true" /> Preparing your CV…</> : <>Analyze Resume <span aria-hidden="true">→</span></>}</button></form></section>;
}

export default AnalyzeForm;
