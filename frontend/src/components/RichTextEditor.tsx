import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react';

interface RichTextEditorProps {
  value?: string;
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  content,
  onChange,
  placeholder = 'متن خود را اینجا بنویسید...',
  className = '',
}: RichTextEditorProps) {
  const initialContent = value ?? content ?? '';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'right',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'min-h-[160px] max-h-[380px] overflow-y-auto px-4 py-3 text-sm focus:outline-none text-slate-100 leading-relaxed font-sans',
        dir: 'rtl',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || '');
    }
  }, [initialContent, editor]);

  if (!editor) {
    return null;
  }

  const btnClass = (active: boolean) =>
    `p-1.5 rounded text-xs transition-colors ${
      active
        ? 'bg-primary/30 text-primary border border-primary/40'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
    }`;

  return (
    <div
      className={`w-full rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/40 ${className}`}
      dir="rtl"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-3 py-2 bg-slate-950/40 rounded-t-xl">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30"
          title="بازگشت (Undo)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30"
          title="انجام مجدد (Redo)"
        >
          <Redo className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
          title="ضخیم (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
          title="مورب (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive('underline'))}
          title="خط زیرین (Underline)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={btnClass(editor.isActive({ textAlign: 'right' }))}
          title="راست‌چین"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={btnClass(editor.isActive({ textAlign: 'center' }))}
          title="وسط‌چین"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={btnClass(editor.isActive({ textAlign: 'left' }))}
          title="چپ‌چین"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={btnClass(editor.isActive({ textAlign: 'justify' }))}
          title="هم‌تراز (Justify)"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
          title="لیست نشانه‌دار"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
          title="لیست شماره‌دار"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
