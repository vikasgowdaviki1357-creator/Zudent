import React from 'react';
import EmptyState from './EmptyState';
import '../../styles/components.css';

export default function Table({ columns, data, emptyMessage = 'No data available', striped = true, hoverable = true, className = '' }) {
  if (!data || data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className={`table-container ${className}`}>
      <table className={`data-table ${striped ? 'table-striped' : ''} ${hoverable ? 'table-hoverable' : ''}`}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row.id || rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={col.key || colIdx}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
