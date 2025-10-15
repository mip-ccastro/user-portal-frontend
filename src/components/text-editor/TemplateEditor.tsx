import { CodeNode } from '@lexical/code';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ListItemNode, ListNode } from "@lexical/list";
import EmailTemplateEditor from "./EmailTemplateEditor";
import SmsTemplateEditor from "./SmsTemplateEditor";
import type { UpdateTemplateInput } from '../../utils/validations/updateTemplateSchema';
import { AutoLinkNode, LinkNode } from '@lexical/link';

export type TemplateProps = {
  form: UseFormReturn<UpdateTemplateInput>;
  isUpdating: boolean;
  variables?: Array<{ label: string; value: string }>;
};

const editorConfig = {
  namespace: "TemplateEditor",
  theme: {
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
      strikethrough: 'editor-text-strikethrough',
      code: 'editor-text-code',
    },
    paragraph: 'editor-paragraph',
    list: {
      ul: "editor-list-ul",
      ol: "editor-list-ol",
      listitem: "editor-listitem",
    },
    heading: {
      h1: 'editor-heading-h1',
      h2: 'editor-heading-h2',
      h3: 'editor-heading-h3',
    },
  },
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode, 
    ListItemNode,
    CodeNode,
    LinkNode,
    AutoLinkNode,
  ],
  onError(error: Error) {
    console.error(error);
  },
  editable: true,
};


const TemplateEditor = (props: TemplateProps) => {

  const { form, isUpdating, variables = [] } = props ?? {}
  const { control, watch } = form;
  const type = watch("type");

  return (
    <Controller
        name="content"
        control={control}
        rules={{ required: 'Email content is required' }}
        render={({ field }) => (
          <LexicalComposer initialConfig={editorConfig}>
            {type === "email" ? (
              <EmailTemplateEditor content={field.value} setContent={field.onChange} isUpdating={isUpdating} variables={variables}/>
            ) : (
              <SmsTemplateEditor content={field.value} setContent={field.onChange} />
            )}
          </LexicalComposer>
        )}
    />
  );
};

export default TemplateEditor;
