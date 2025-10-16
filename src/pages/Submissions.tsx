import { Box, Typography } from "@mui/material";
import { Library } from "lucide-react";
import { useFetchSubmissions } from "../hooks/useSubmission";
import DataTable from "../components/common/DataGrid";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

dayjs.extend(LocalizedFormat);

const Submissions = () => {

    const { data: rows } = useFetchSubmissions();

  const columns: GridColDef[] = [
    {
      field: "form_name",
      headerName: "Form",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <span>{params.row.form?.form_name}</span>
      ),
    },
    {
      field: "submitted_by",
      headerName: "Submitted By",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <span>
          {params.row.user?.first_name + " " + params.row.user?.last_name}
        </span>
      ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <span>{dayjs(params.value).format("lll")}</span>
      ),
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <span>{dayjs(params.value).format("lll")}</span>
      ),
    },
  ];

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Library />
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold" }}
          noWrap
          component="div"
        >
          Submission
        </Typography>
      </Box>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default Submissions;
