import React from 'react';
import { FixedSizeList } from 'react-window';
import { TableData } from '../../types/Table';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { useWindowSize } from '../../hooks/useWindowSize';

interface VirtualTableProps {
  table: TableData;
}

export const VirtualTable: React.FC<VirtualTableProps> = ({ table }) => {
  const { width } = useWindowSize();
  const tableWidth = Math.min(width - 48, 1200); // Responsive width with max-width
  const columnWidth = tableWidth / table.headers.length;
  const tableHeight = 500;
  const headerHeight = 40;

  return (
    <div className="w-full">
      <TableHeader headers={table.headers} columnWidth={columnWidth} />
      <FixedSizeList
        height={tableHeight - headerHeight}
        itemCount={table.rows.length}
        itemSize={48}
        width={tableWidth}
        itemData={{
          rows: table.rows,
          columnWidth,
        }}
      >
        {TableRow}
      </FixedSizeList>
    </div>
  );
};