function DataTable({ columns, data, actions }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
            ))}
            {actions && (
              <td>
                {actions.map((action) => (
                  <button
                    key={action.label}
                    className="button"
                    style={{ marginRight: '0.25rem', background: action.variant === 'danger' ? '#b91c1c' : '#e5e7eb' }}
                    onClick={() => action.onClick(row)}
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )}

export default DataTable
