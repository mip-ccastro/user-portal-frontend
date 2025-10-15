import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
} from "@mui/material";
import { GripVertical, Trash2, EditIcon } from "lucide-react";
import type { Identifier, XYCoord } from "dnd-core";
import type { Schema } from "./types";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ItemType = "LIST_ITEM";

interface DraggableListItemProps {
  item: Schema;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  removeItem: (index: number) => void;
  editItem: (item: Schema) => void;
}

const DraggableListItem: React.FC<DraggableListItemProps> = ({
  item,
  index,
  moveItem,
  removeItem,
  editItem
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => {
      return { id: item.id.toString(), index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <ListItem
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        mb: 1,
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
      data-handler-id={handlerId}
      secondaryAction={
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton edge="end" aria-label="delete" onClick={() => editItem(item)}>
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => removeItem(index)}
          >
            <Trash2 />
          </IconButton>
        </Box>
      }
    >
      <ListItemIcon>
        <GripVertical />
      </ListItemIcon>
      <ListItemText primary={item.label ? item.label : item.name} />
    </ListItem>
  );
};

export default DraggableListItem;
