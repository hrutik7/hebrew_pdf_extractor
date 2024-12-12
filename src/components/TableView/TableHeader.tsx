import React from 'react';

interface TableHeaderProps {
  headers: string[];
  columnWidth: number;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ headers, columnWidth }) => {
  return (
    <div className="flex border-b border-gray-300 bg-gray-50">
      {headers.map((header, index) => (
        <div
          key={index}
          style={{ width: columnWidth }}
          className="px-4 py-3 font-semibold text-gray-900 truncate"
        >
          {header}
        </div>
      ))}
    </div>
  );
};