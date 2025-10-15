import { Box, List, Typography } from "@mui/material";
import { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableListItem from "./DraggableListItem";
import type { Schema } from "./types";

export interface ListProps {
  items: Array<Schema>;
  setItems: (items: Array<Schema>) => void;
  editItem: (item: Schema) => void;
}

const DraggableList = (props: ListProps) => {
  const { items, setItems, editItem } = props;

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const updatedItems = [...items];
      const [movedItem] = updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, movedItem);
      setItems(updatedItems);
    },
    [items, setItems]
  );

  const removeItem = useCallback(
    (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    },
    [items, setItems]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        {items.length > 0 ? (
          <List>
            {items.map((item, index) => (
              <DraggableListItem
                key={item.id}
                item={item}
                index={index}
                moveItem={moveItem}
                removeItem={removeItem}
                editItem={editItem}
              />
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              fontWeight={"bold"}
            >
              No field(s) added
            </Typography>
          </Box>
        )}
      </Box>
    </DndProvider>
  );
};

export default DraggableList;
