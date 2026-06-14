type Props = {
  data: any[];
  columns: { key: string; label: string }[];
  onDelete: (id: string) => void;
};

export const DataTable = ({ data, columns, onDelete }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key}>{c.label}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((c) => (
              <td key={c.key}>{item[c.key]}</td>
            ))}

            <td>
              <button onClick={() => onDelete(item._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};