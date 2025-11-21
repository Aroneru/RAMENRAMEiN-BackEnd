"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';

interface TipTapEditorProps {
  content: string;
  onChange?: (html: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  if (!editor) {
    return (
      <div className="px-4 py-3 min-h-[200px] text-gray-400">
        Loading editor...
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 sm:gap-2 border border-[#EAEAEA] border-b-0 rounded-t-lg p-2 sm:p-3 bg-gray-50">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive('bold') ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          <strong>B</strong>
        </button>
        
        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive('italic') ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          <em>I</em>
        </button>
        
        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive('underline') ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          <u>U</u>
        </button>
        
        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive('strike') ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          <s>S</s>
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          H3
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive('bulletList') ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive('orderedList') ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          1.
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          ⬅
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
          }`}
          style={{ color: '#1D1A1A' }}
        >
          ➡
        </button>
      </div>
      
      {/* Editor */}
      <div className="border border-[#EAEAEA] border-t-0 rounded-b-lg bg-white">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
