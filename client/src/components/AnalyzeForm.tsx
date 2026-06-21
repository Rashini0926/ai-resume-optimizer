import { useState } from 'react';

interface AnalyzeFormProps {
  onSubmit: (resumeText: string, jobDescription: string) => void;
  isLoading: boolean;
}

function AnalyzeForm({ onSubmit, isLoading }: AnalyzeFormProps) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescription.trim()) return;
    onSubmit(resumeText, jobDescription);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Your Resume Text
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={8}
          placeholder="Paste your resume content here..."
          required
        />
      </label>

      <label>
        Job Description
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          placeholder="Paste the job description here..."
          required
        />
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
    </form>
  );
}

export default AnalyzeForm;