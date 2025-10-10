import { Box, Button, IconButton, Typography } from "@mui/material";
import { LayoutTemplate, Mail, Smartphone, SquarePen, Trash } from "lucide-react";
import { navigateTo } from "../services/navigateService";
import { useFetchTemplates } from "../hooks/useTemplate";
import { useState } from "react";
import CreateTemplateForm from "../components/forms/Template/CreateTemplateForm";
import DataTable from "../components/common/DataGrid";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import ReusableModal from "../components/common/ReusableDialog";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

dayjs.extend(LocalizedFormat)

const Templates = () => {
  const { data: rows } = useFetchTemplates();
  const [modalOpen, setModalOpen] = useState(false);

  const ActionsCell = (params: GridRenderCellParams) => {
    const rowData = params.row;

    const handleEdit = () => {
      navigateTo(`/template/${rowData.id}`);
    };

    const handleDelete = () => {
      console.log("🚀 ~ handleDelete ~ rowData.id:", rowData.id);
    };

    return (
      <>
        <IconButton onClick={handleEdit} color="primary" size="small">
          <SquarePen fontSize="inherit" />
        </IconButton>
        <IconButton onClick={handleDelete} color="error" size="small">
          <Trash fontSize="inherit" />
        </IconButton>
      </>
    );
  };

  const columns: GridColDef[] = [
    { field: "template_name", headerName: "Template", flex: 1 },
    { 
      field: "type", 
      headerName: "Type", 
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {

        const value = params.value

        return (
          <Box sx={{ textTransform: "capitalize", display: "flex", alignItems: "center", height: '100%', gap: 1 }}>
            {value.toLowerCase() === "email" ? <Mail /> : <Smartphone />}
            <Typography variant="body2" fontWeight={"bold"} >{(value).toUpperCase()}</Typography>
          </Box>
        )
      }
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
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ActionsCell,
    },
  ];

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <LayoutTemplate />
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold" }}
          noWrap
          component="div"
        >
          Templates
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        sx={{ mb: 2 }}
      >
        Create Template
      </Button>
      <DataTable columns={columns} rows={rows} />
      <ReusableModal
        title="Create Template"
        isOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
        width={500}
      >
        <CreateTemplateForm
          cancel={() => setModalOpen(false)}
          isOpen={modalOpen}
        />
      </ReusableModal>
    </div>
  );
};

export default Templates;
