import type { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

function ResultCard({ result }: ResultCardProps) {
  return (
    <div>
      <h2>ATS Score: {result.atsScore}/100</h2>

      <h3>✅ Matched Keywords</h3>
      <ul>
        {result.matchedKeywords.map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>

      <h3>❌ Missing Keywords</h3>
      <ul>
        {result.missingKeywords.map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>

      <h3>💡 Suggestions</h3>
      <ul>
        {result.suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
}

export default ResultCard;