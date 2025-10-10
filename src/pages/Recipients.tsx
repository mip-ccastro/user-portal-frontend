import { Contact2, SquarePen, Trash } from 'lucide-react'
import { Typography, Box, Button, IconButton } from '@mui/material'
import { useFetchRecipients } from '../hooks/useRecipient';
import { useState } from 'react';
import AddRecipientForm from '../components/forms/Recipient/AddRecipientForm';
import DataTable from '../components/common/DataGrid'
import dayjs from 'dayjs';
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import ReusableModal from '../components/common/ReusableDialog';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import UpdateRecipientForm from '../components/forms/Recipient/UpdateRecipientForm';

dayjs.extend(LocalizedFormat)

const Recipients = () => {
  const { data: rows } = useFetchRecipients()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<string>('')

  const ActionsCell = (params: GridRenderCellParams) => {
    const rowData = params.row;

    const handleEdit = () => {
      setModalUpdateOpen(true);
      setSelectedRow(rowData.id);
    };

    const handleDelete = () => {
      console.log("🚀 ~ handleDelete ~ rowData.id:", rowData.id);
    };

    return (
      <>
        <IconButton onClick={handleEdit} color="primary" size="small">
          <SquarePen fontSize="inherit" />
        </IconButton>
        <IconButton onClick={handleDelete} color="error" size="small" disabled={rowData.templates.length > 0}>
          <Trash fontSize="inherit" />
        </IconButton>
      </>
    );
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Recipient", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone Number", flex: 1 },
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
        <Contact2 />
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold" }}
          noWrap
          component="div"
        >
          Recipients
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Recipient
      </Button>
      <DataTable columns={columns} rows={rows} />
      <ReusableModal
        title="Add Recipient"
        isOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
        width={500}
      >
        <AddRecipientForm
          cancel={() => setModalOpen(false)}
          isOpen={modalOpen}
        />
      </ReusableModal>
      <ReusableModal
        title="Update Recipient"
        isOpen={modalUpdateOpen}
        handleClose={() => setModalOpen(false)}
        width={500}
      >
        <UpdateRecipientForm
          cancel={() => setModalUpdateOpen(false)}
          isOpen={modalUpdateOpen}
          recipientId={selectedRow}
        />
      </ReusableModal>
    </div>
  )
}

export default Recipients