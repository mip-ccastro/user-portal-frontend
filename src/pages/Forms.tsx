import { Box, Button, IconButton, Typography } from '@mui/material'
import { Files, Send, SquarePen, Trash } from 'lucide-react'
import { navigateTo } from '../services/navigateService';
import { useFetchForms } from '../hooks/useFormHook';
import { useState } from 'react';
import CreateForm from '../components/forms/Forms/CreateForm';
import DataTable from '../components/common/DataGrid'
import dayjs from 'dayjs';
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import ReusableModal from '../components/common/ReusableDialog';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useAuthContext } from '../hooks/useAuth';

dayjs.extend(LocalizedFormat)

const Forms = () => {
  const { data: rows } = useFetchForms();
  const [open, setOpen] = useState(false)
  const { user } = useAuthContext()
  
  const ActionsCell = (params: GridRenderCellParams) => {
    const rowData = params.row;
    
    const handleSubmitForm = () => {
      navigateTo(`/form/submit/${rowData.id}`);
    };

    const handleEdit = () => {
      navigateTo(`/form/${rowData.id}`);
    };

    const handleDelete = () => {
      console.log("🚀 ~ handleDelete ~ rowData.id:", rowData.id);
    };

    return (
      <>
        <IconButton onClick={handleSubmitForm} color="primary" size="small">
          <Send fontSize="inherit" />
        </IconButton>
        {
          user?.user_role === "admin" && (
            <>
              <IconButton onClick={handleEdit} color="primary" size="small">
                <SquarePen fontSize="inherit" />
              </IconButton>
              <IconButton onClick={handleDelete} color="error" size="small" disabled={rowData.templates.length > 0}>
                <Trash fontSize="inherit" />
              </IconButton>
            </>
          )
        }
      </>
    );
  };

  const columns: GridColDef[] = [
    { field: "form_name", headerName: "Form", flex: 1 },
    { field: "form_description", headerName: "Description", flex: 2 },
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
        <Files />
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold" }}
          noWrap
          component="div"
        >
          Forms
        </Typography>
      </Box>
      {
        user?.user_role === "admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            sx={{ mb: 2 }}
          >
            Create Form
          </Button>
        )
      }
      <DataTable columns={columns} rows={rows} />
      <ReusableModal
        title='Create Form'
        isOpen={open} 
        handleClose={() => setOpen(false)}
      >
        <CreateForm
          cancel={() => setOpen(false)}
          isOpen={open}
        />
      </ReusableModal>
    </div>
  )
}

export default Forms