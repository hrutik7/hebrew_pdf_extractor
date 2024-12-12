import React from 'react';
import { ListChildComponentProps } from 'react-window';

interface TableRowProps extends ListChildComponentProps {
  data: {
    rows: string[][];
    columnWidth: number;
  };
}

export const TableRow: React.FC<TableRowProps> = ({ index, style, data }) => {
  const { rows, columnWidth } = data;
  const row = rows[index];

  return (
    <div style={style} className="flex hover:bg-gray-50">
      {row.map((cell, cellIndex) => (
        <div
          key={cellIndex}
          style={{ width: columnWidth }}
          className="px-4 py-2 border-b border-gray-200 truncate"
        >
          {cell}
        </div>
      ))}
    </div>
  );
};