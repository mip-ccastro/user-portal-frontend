/* eslint-disable @typescript-eslint/no-explicit-any */

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes, type EditorState } from "lexical";
import { Box, Paper } from "@mui/material";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import TemplateVariables from "./TemplateVariables";
import Toolbar from "./Toolbar";

export type TemplateProps = {
  content: any;
  setContent: any;
  initialContent?: string;
  isUpdating?: boolean;
};

const EmailTemplateEditor = (props: TemplateProps) => {
  const { content, setContent } = props;
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current && content) {
      isFirstRender.current = false;

      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(content, "text/html");

        const nodes = $generateNodesFromDOM(editor, dom);

        const root = $getRoot();
        root.clear();
        $insertNodes(nodes);
      }, { discrete: true });

      setTimeout(() => {
        const currentHtml = editor.getEditorState().read(() => {
          return $generateHtmlFromNodes(editor);
        });
        
        setContent(currentHtml);
      }, 150);
    }
  }, [editor, content, setContent]);

  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      setContent(html);
    });
  };

  return (
    <Box>
      <TemplateVariables />
      <Toolbar />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            position: "relative",
          }}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                style={{
                  padding: "16px",
                  minHeight: "300px",
                  outline: "none",
                }}
              />
            }
            placeholder={
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  color: "#999",
                  pointerEvents: "none",
                }}
              >
                Enter your email template...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <LinkPlugin />
          <HistoryPlugin />
          <ListPlugin />
        </Box>
      </Paper>

      {/* Preview */}
      {/* <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Preview:
        </Typography>
        <Box
          className="email-preview"
          sx={{
            p: 2,
            bgcolor: "grey.100",
            borderRadius: 1,
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Paper> */}

      <style>{`
        .editor-input {
          font-family: inherit;
          font-size: 16px;
        }
        
        /* Don't override inline styles */
        .editor-input [style] {
          /* Preserve all inline styles */
        }
        
        .editor-text-bold {
          font-weight: bold;
        }
        .editor-text-italic {
          font-style: italic;
        }
        .editor-text-underline {
          text-decoration: underline;
        }
        .editor-text-strikethrough {
          text-decoration: line-through;
        }
        .editor-text-code {
          background-color: #f0f0f0;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        
        .editor-paragraph {
          margin: 0 0 8px 0;
        }
        
        .editor-heading-h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0;
        }
        
        .editor-heading-h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0;
        }
        
        .editor-heading-h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0;
        }
        
        .editor-list-ul,
        .editor-list-ol {
          margin: 0;
          padding-left: 24px;
        }
        
        .editor-listitem {
          margin: 4px 0;
        }
        
        .email-preview p {
          margin: 0 0 8px 0;
        }
      `}</style>
    </Box>
  );
};

export default EmailTemplateEditor;