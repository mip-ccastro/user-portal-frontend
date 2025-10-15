import { $createTextNode, $insertNodes } from "lexical";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export interface TemplateVariable {
  label: string;
  value: string;
}

export interface TemplateVariablesProps {
  variables?: Array<TemplateVariable>;
}

const TemplateVariables = (props: TemplateVariablesProps) => {
  const { variables = [] } = props;

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
      {variables?.length === 0 ? (
        <Typography variant="body2">
          No variables available. Please select a form for this template or select a different form.
        </Typography>
      ) : (
        <>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {variables?.map((variable) => (
              <Chip
                key={variable.value}
                label={variable.label}
                onClick={() => insertVariable(variable.value)}
                clickable
                size="small"
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default TemplateVariables;
