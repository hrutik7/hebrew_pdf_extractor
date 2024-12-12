import React from 'react';
import { TableData } from '../types/Table';
import { AutoSizer, Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css';

interface TableViewProps {
  table: TableData;
}

export const TableView: React.FC<TableViewProps> = ({ table }) => {
  return (
    <div className="h-[600px] w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Table from page {table.pageNumber}</h3>
      </div>
      <AutoSizer>
        {({ height, width }) => (
          <Table
            width={width}
            height={height}
            headerHeight={40}
            rowHeight={48}
            rowCount={table.rows.length}
            rowGetter={({ index }) => table.rows[index]}
          >
            {table.headers.map((header, index) => (
              <Column
                key={index}
                label={header}
                dataKey={index.toString()}
                width={width / table.headers.length}
                cellRenderer={({ cellData }) => (
                  <div className="px-4 py-2">{cellData}</div>
                )}
              />
            ))}
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};