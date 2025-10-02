/* eslint-disable @typescript-eslint/no-explicit-any */

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
const paginationModel = { page: 0, pageSize: 5 };

export interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
}

export default function DataTable(props: DataTableProps) {
  const { rows = [], columns = [] } = props;

  return (
    <Paper sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        rowSelection={false}
        sx={{
          border: 0,
          height: 600,
        }}
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
      />
    </Paper>
  );
}
