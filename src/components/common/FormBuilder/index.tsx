/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box, Grid } from "@mui/material";
import { generateDynamicSchema } from "./schemaGenerator";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import AddFieldForm from "./Forms/AddFieldForm";
import Builder from "./Builder";
import Preview from "./Preview";
import ReusableModal from "../ReusableDialog";
import type { Schema } from "./types";
import UpdateFieldForm from "./Forms/UpdateFieldForm";

export interface FormBuilderProps {
  fields: Array<Schema>;
  setFields: (fields: Array<Schema>) => void;
}

const FormBuilder = ({ fields, setFields }: FormBuilderProps) => {
  const [open, setOpen] = useState(false);
  const [openUpdateField, setOpenUpdateField] = useState(false);
  const [selected, setSelected] = useState<Schema | null>(null);

  const schema = useMemo(() => generateDynamicSchema(fields), [fields]);

  const form = useForm({ resolver: zodResolver(schema) });

  const addField = (item: Schema) => {
    setFields([...fields, item]);
    setOpen(false);
  };

  const updateField = (item: Schema) => {
    const updatedFields = fields.map((field) => {
      if (field.id === item.id) {
        return item;
      }
      return field;
    });
    setFields(updatedFields);
    setOpenUpdateField(false);
  };

  const editItem = (item: Schema) => {
    setSelected(item);
    setOpenUpdateField(true);
  };

  const onSubmit = (data: any) => {
    console.log("🚀 ~ onSubmit ~ ", {
      data,
      fields,
    });
  };

  return (
    <Box>
      <Grid container spacing={1} direction={"row"}>
        <Grid size={5}>
          <Builder
            fields={fields}
            setOpen={setOpen}
            setFields={setFields}
            editItem={editItem}
          />
        </Grid>
        <Grid size={7}>
          <Preview fields={fields} form={form} onSubmit={onSubmit} />
        </Grid>
      </Grid>
      <ReusableModal
        isOpen={open}
        handleClose={() => setOpen(false)}
        title="Add Field"
        description="Add New Field"
        width={500}
      >
        <AddFieldForm
          isOpen={open}
          cancel={() => setOpen(false)}
          onSubmit={addField}
        />
      </ReusableModal>
      <ReusableModal
        isOpen={openUpdateField}
        handleClose={() => setOpenUpdateField(false)}
        title="Edit Field"
        description="Edit Field"
        width={500}
      >
        <UpdateFieldForm
          field={selected}
          cancel={() => setOpenUpdateField(false)}
          isOpen={openUpdateField}
          onSubmit={updateField}
        />
      </ReusableModal>
    </Box>
  );
};

export default FormBuilder;
