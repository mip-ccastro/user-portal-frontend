/* eslint-disable @typescript-eslint/no-explicit-any */

import { $getRoot, type EditorState } from 'lexical';
import { $createParagraphNode, $createTextNode } from 'lexical';
import { Box, Paper, Typography } from '@mui/material';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';
import TemplateVariables from './TemplateVariables';

export type TemplateProps = {
  content: any;
  setContent: any;
  initialContent?: string;
  isUpdating?: boolean;
}

const SmsTemplateEditor = (props: TemplateProps) => {
  const { content, setContent } = props;
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);
  const maxLength = 160; // Standard SMS length

  useEffect(() => {
    if (isFirstRender.current && content) {
      isFirstRender.current = false;

      editor.update(() => {
        const root = $getRoot();
        root.clear();
        
        const paragraph = $createParagraphNode();
        const textNode = $createTextNode(content);
        paragraph.append(textNode);
        root.append(paragraph);
      });
    }
  }, [editor, content]);

  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      setContent(textContent);
    });
  };

  const characterCount = content?.length || 0;
  const smsCount = Math.ceil(characterCount / maxLength);
  const isOverLimit = characterCount > maxLength;

  return (
    <Box>
      <TemplateVariables />
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            border: '1px solid',
            borderColor: isOverLimit ? 'error.main' : 'divider',
            borderRadius: 1,
            position: 'relative',
          }}
        >
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  padding: '16px',
                  minHeight: '150px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              />
            }
            placeholder={
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  color: '#999',
                  pointerEvents: 'none',
                }}
              >
                Enter your SMS template. Use variables above to personalize...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
        </Box>

        {/* Character Counter */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
            px: 1,
          }}
        >
          <Typography 
            variant="caption" 
            color={isOverLimit ? 'error' : 'text.secondary'}
          >
            {characterCount} / {maxLength} characters
            {smsCount > 1 && ` (${smsCount} SMS)`}
          </Typography>
          
          {isOverLimit && (
            <Typography variant="caption" color="error">
              Message exceeds standard SMS length
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default SmsTemplateEditor;