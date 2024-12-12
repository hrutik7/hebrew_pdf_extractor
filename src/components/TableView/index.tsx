import React from 'react';
import { TableData } from '../../types/Table';
import { VirtualTable } from './VirtualTable';

interface TableViewProps {
  table: TableData;
}

export const TableView: React.FC<TableViewProps> = ({ table }) => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Table from page {table.pageNumber}</h3>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <VirtualTable table={table} />
      </div>
    </div>
  );
};