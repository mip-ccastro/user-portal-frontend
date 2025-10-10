import { $createTextNode, $insertNodes } from "lexical";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const TEMPLATE_VARIABLES = [
  { label: "First Name", value: "{{first_name}}" },
  { label: "Last Name", value: "{{last_name}}" },
  { label: "Email", value: "{{email}}" },
  { label: "Company", value: "{{company}}" },
  { label: "Date", value: "{{date}}" },
];

const TemplateVariables = () => {
  const [editor] = useLexicalComposerContext();

  const insertVariable = (variable: string) => {
    editor.update(() => {
      const textNode = $createTextNode(variable);
      $insertNodes([textNode]);
    });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Insert Variable:
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {TEMPLATE_VARIABLES.map((variable) => (
          <Chip
            key={variable.value}
            label={variable.label}
            onClick={() => insertVariable(variable.value)}
            clickable
            size="small"
          />
        ))}
      </Stack>
    </Box>
  );
};

export default TemplateVariables;
