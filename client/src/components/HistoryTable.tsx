export interface HistoryItem {
  _id: string;
  atsScore: number;
  industry: string;
  jobRole: string;
  createdAt: string;
}

interface Props { items: HistoryItem[]; }

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const scoreTone = (score: number) => score >= 75 ? 'good' : score >= 50 ? 'medium' : 'low';

function HistoryTable({ items }: Props) {
  return <section className="history-card">
    <div className="history-heading">
      <div><p className="eyebrow">Your activity</p><h2>Analysis history</h2></div>
      <span className="history-count">{items.length} {items.length === 1 ? 'analysis' : 'analyses'}</span>
    </div>
    {items.length ? <div className="table-scroll"><table>
      <thead><tr><th>Date</th><th>Industry</th><th>Job role</th><th>ATS score</th></tr></thead>
      <tbody>{items.map((item) => <tr key={item._id}>
        <td>{formatDate(item.createdAt)}</td><td>{item.industry || '—'}</td><td>{item.jobRole || '—'}</td>
        <td><span className={`score-pill ${scoreTone(item.atsScore)}`}>{item.atsScore}<small>/100</small></span></td>
      </tr>)}</tbody>
    </table></div> : <div className="empty-state"><span aria-hidden="true">◌</span><p>No analyses yet</p><small>Your completed resume analyses will appear here.</small></div>}
  </section>;
}

export default HistoryTable;
