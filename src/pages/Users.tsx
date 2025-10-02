import { Box, Button, IconButton, Typography } from "@mui/material";
import { Trash, SquarePen, UsersIcon } from "lucide-react";
import { useFetchUsers } from "../hooks/useUser";
import { useState } from "react";
import capitalize from "lodash/capitalize";
import CreateUserForm from "../components/forms/User/CreateUserForm";
import DataTable from "../components/common/DataGrid";
import dayjs from "dayjs";
import DeleteUserForm from "../components/forms/User/DeleteUserForm";
import ReusableModal from "../components/common/ReusableDialog";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { User } from "../utils/types/users";
import UpdateUserForm from "../components/forms/User/UpdateUserForm";
import { useAuthContext } from "../hooks/useAuth";

const Users = () => {
  const { data: rows = [] } = useFetchUsers();
  const { user } = useAuthContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null);

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedToDelete(null);
  };

  const CustomStatus = (params: GridRenderCellParams) => {
    const status = params.value;
    if (status === 0) {
      return (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: "#f44336",
            color: "white",
          }}
        >
          Inactive
        </span>
      );
    } else if (status === 1) {
      return (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: "#4caf50",
            color: "white",
          }}
        >
          Active
        </span>
      );
    } else if (status === 2) {
      return (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: "#f2ea4eff",
            color: "white",
          }}
        >
          Suspended
        </span>
      );
    }
  };

  const ActionsCell = (params: GridRenderCellParams) => {
    const rowData = params.row;

    const handleEdit = () => {
      setSelectedUser(rowData.id);
      setUpdateModalOpen(true);
    };

    const handleDelete = () => {
      setSelectedToDelete(rowData.id);
      setDeleteModalOpen(true);
    };

    return (
      <>
        <IconButton onClick={handleEdit} color="primary" size="small">
          <SquarePen fontSize="inherit" />
        </IconButton>
        <IconButton
          onClick={handleDelete}
          color="error"
          size="small"
          disabled={rowData.id === user?.user_id}
        >
          <Trash fontSize="inherit" />
        </IconButton>
      </>
    );
  };

  const columns: GridColDef[] = [
    { field: "first_name", headerName: "First name", flex: 1 },
    { field: "last_name", headerName: "Last name", flex: 1 },
    {
      field: "username",
      headerName: "Username",
      flex: 1.5,
      valueGetter: (value, row) => `${row?.user_credentials?.username || ""}`,
    },
    { field: "email", headerName: "Email", flex: 2 },
    {
      field: "user_role",
      headerName: "Role",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <span style={{ fontWeight: 600 }}>{capitalize(params.value)}</span>
      ),
    },
    {
      field: "user_status",
      headerName: "Status",
      width: 130,
      renderCell: CustomStatus,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <span>{dayjs(params.value).format("YYYY-MM-DD hh:mm A")}</span>
      ),
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <span>{dayjs(params.value).format("YYYY-MM-DD hh:mm A")}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ActionsCell,
    },
  ];

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <UsersIcon />
        <Typography variant="h5" sx={{ fontWeight: "bold" }} noWrap component="div">
          Users
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        sx={{ mb: 2 }}
      >
        Create User
      </Button>
      <DataTable
        columns={columns}
        rows={rows.map((user: User) => ({ ...user, id: user.user_id }))}
      />
      <ReusableModal
        title="Create User"
        isOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
        width={800}
      >
        <CreateUserForm cancel={() => setModalOpen(false)} isOpen={modalOpen} />
      </ReusableModal>

      <ReusableModal
        title="Update User"
        isOpen={updateModalOpen}
        handleClose={closeUpdateModal}
        width={800}
      >
        <UpdateUserForm
          cancel={closeUpdateModal}
          isOpen={updateModalOpen}
          userId={selectedUser ?? ""}
        />
      </ReusableModal>
      <ReusableModal
        title="Delete User"
        isOpen={deleteModalOpen}
        handleClose={closeDeleteModal}
        width={800}
      >
        <DeleteUserForm
          cancel={closeDeleteModal}
          isOpen={deleteModalOpen}
          userId={selectedToDelete ?? ""}
        />
      </ReusableModal>
    </div>
  );
};

export default Users;
