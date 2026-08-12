interface Props {
  items: any[];
}

function HistoryTable({ items }: Props) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2>📜 Analysis History</h2>

      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Job Role</th>
            <th>Industry</th>
            <th>ATS Score</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td>{item.jobRole}</td>
              <td>{item.industry}</td>
              <td>{item.atsScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryTable;