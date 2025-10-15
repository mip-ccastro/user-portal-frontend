import { Box, Button, Paper } from "@mui/material";
import type { Schema } from "./types";
import { Plus } from "lucide-react";
import DraggableList from "./DraggableList";

export interface BuilderProps {
  fields: Schema[];
  setOpen: (open: boolean) => void;
  setFields: (fields: Schema[]) => void;
  editItem: (item: Schema) => void;
}

const Builder = (props: BuilderProps) => {
  const { fields, setOpen, setFields, editItem } = props ?? {};

  return (
    <Paper
      style={{
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "24px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<Plus size={16} />}
          onClick={() => setOpen(true)}
        >
          Add Field
        </Button>
      </Box>
      <DraggableList items={fields} setItems={setFields} editItem={editItem} />
    </Paper>
  );
};

export default Builder;
