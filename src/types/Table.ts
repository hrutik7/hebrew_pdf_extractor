export interface TableData {
  headers: string[];
  rows: string[][];
  pageNumber: number;
}

export interface ExtractedContent {
  tables: TableData[];
  additionalText: string[];
}