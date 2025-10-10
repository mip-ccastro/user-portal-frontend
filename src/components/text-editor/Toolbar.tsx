/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Bold,
  Italic,
  Redo,
  Underline,
  Undo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Palette,
  Highlighter,
  Type,
  Indent,
  Outdent,
} from 'lucide-react';
import { Divider, IconButton, Paper, Select, MenuItem, Popover, Box, TextField, Button } from '@mui/material';
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import { $createLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $getSelectionStyleValueForProperty, $patchStyleText, $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { useState, useEffect, useCallback } from 'react';

const FONT_FAMILY_OPTIONS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
];

const FONT_SIZE_OPTIONS = [
  '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'
];

const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF',
  '#F3F3F3', '#FFFFFF', '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF',
  '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
];

const HIGHLIGHT_COLORS = [
  'transparent', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500', '#FF6B6B', '#4ECDC4',
  '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2',
];

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState('paragraph');
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('transparent');
  
  // Link state
  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  // Popover states
  const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
  const [highlightAnchor, setHighlightAnchor] = useState<null | HTMLElement>(null);
  const [linkAnchor, setLinkAnchor] = useState<null | HTMLElement>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isHeadingNode(element)) {
          const tag = element.getTag();
          setBlockType(tag);
        } else {
          const type = element.getType();
          if (type === 'quote') {
            setBlockType('quote');
          } else {
            setBlockType('paragraph');
          }
        }
      }

      // Update current styles
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '16px')
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial, sans-serif')
      );
      setTextColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000000')
      );
      setBgColor(
        $getSelectionStyleValueForProperty(selection, 'background-color', 'transparent')
      );

      // Check if selection is a link
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
        const linkNode = $isLinkNode(node) ? node : parent;
        if ($isLinkNode(linkNode)) {
          setLinkUrl(linkNode.getURL());
        }
      } else {
        setIsLink(false);
        setLinkUrl('');
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatBlock = (type: any) => {
    if (blockType === type) return;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (type === 'paragraph') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (type === 'quote') {
          $setBlocksType(selection, () => $createQuoteNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(type));
        }
      }
    });
  };

  const applyStyleText = (styles: Record<string, string>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, styles);
      }
    });
  };

  const onFontSizeChange = (size: string) => {
    applyStyleText({ 'font-size': size });
  };

  const onFontFamilyChange = (family: string) => {
    applyStyleText({ 'font-family': family });
  };

  const onTextColorChange = (color: string) => {
    applyStyleText({ 'color': color });
    setTextColor(color);
    setColorAnchor(null);
  };

  const onHighlightColorChange = (color: string) => {
    applyStyleText({ 'background-color': color });
    setBgColor(color);
    setHighlightAnchor(null);
  };

  const insertLink = () => {
    if (!linkUrl) return;
    
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
      }
    });
    setLinkAnchor(null);
    setLinkUrl('');
  };

  const removeLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setLinkAnchor(null);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexWrap: 'wrap',
      }}
    >
      {/* Block Type */}
      <Select
        size="small"
        value={blockType}
        onChange={(e) => formatBlock(e.target.value)}
        sx={{ mr: 1, minWidth: 120 }}
      >
        <MenuItem value="paragraph">Paragraph</MenuItem>
        <MenuItem value="h1">Heading 1</MenuItem>
        <MenuItem value="h2">Heading 2</MenuItem>
        <MenuItem value="h3">Heading 3</MenuItem>
        <MenuItem value="quote">Quote</MenuItem>
      </Select>

      {/* Font Family */}
      <Select
        size="small"
        value={fontFamily}
        onChange={(e) => onFontFamilyChange(e.target.value)}
        sx={{ mr: 1, minWidth: 140 }}
      >
        {FONT_FAMILY_OPTIONS.map((font) => (
          <MenuItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
            {font.label}
          </MenuItem>
        ))}
      </Select>

      {/* Font Size */}
      <Select
        size="small"
        value={fontSize}
        onChange={(e) => onFontSizeChange(e.target.value)}
        sx={{ mr: 1, minWidth: 80 }}
      >
        {FONT_SIZE_OPTIONS.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Select>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Text Formatting */}
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        title="Underline (Ctrl+U)"
      >
        <Underline size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        title="Code"
      >
        <Code size={18} />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Text Color */}
      <IconButton
        size="small"
        onClick={(e) => setColorAnchor(e.currentTarget)}
        title="Text Color"
        sx={{ color: textColor }}
      >
        <Type size={18} />
      </IconButton>
      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={() => setColorAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 0.5, maxWidth: 280 }}>
          {TEXT_COLORS.map((color) => (
            <Box
              key={color}
              onClick={() => onTextColorChange(color)}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: color,
                border: '1px solid #ccc',
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            />
          ))}
        </Box>
      </Popover>

      {/* Highlight Color */}
      <IconButton
        size="small"
        onClick={(e) => setHighlightAnchor(e.currentTarget)}
        title="Highlight Color"
      >
        <Highlighter size={18} />
      </IconButton>
      <Popover
        open={Boolean(highlightAnchor)}
        anchorEl={highlightAnchor}
        onClose={() => setHighlightAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, maxWidth: 200 }}>
          {HIGHLIGHT_COLORS.map((color) => (
            <Box
              key={color}
              onClick={() => onHighlightColorChange(color)}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: color,
                border: '1px solid #ccc',
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            />
          ))}
        </Box>
      </Popover>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Link */}
      <IconButton
        size="small"
        onClick={(e) => setLinkAnchor(e.currentTarget)}
        title="Insert Link"
        sx={{ color: isLink ? 'primary.main' : 'inherit' }}
      >
        <LinkIcon size={18} />
      </IconButton>
      <Popover
        open={Boolean(linkAnchor)}
        anchorEl={linkAnchor}
        onClose={() => setLinkAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="contained" onClick={insertLink}>
              {isLink ? 'Update' : 'Insert'}
            </Button>
            {isLink && (
              <Button size="small" variant="outlined" color="error" onClick={removeLink}>
                Remove
              </Button>
            )}
          </Box>
        </Box>
      </Popover>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Alignment */}
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        title="Align Left"
      >
        <AlignLeft size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        title="Align Center"
      >
        <AlignCenter size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        title="Align Right"
      >
        <AlignRight size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        title="Justify"
      >
        <AlignJustify size={18} />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Lists */}
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        title="Bullet List"
      >
        <List size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Indent/Outdent */}
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
        title="Decrease Indent"
      >
        <Outdent size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
        title="Increase Indent"
      >
        <Indent size={18} />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Undo/Redo */}
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={18} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo (Ctrl+Y)"
      >
        <Redo size={18} />
      </IconButton>
    </Paper>
  );
};

export default Toolbar;