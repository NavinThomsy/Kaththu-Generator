import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import HardBreak from '@tiptap/extension-hard-break';
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
  Palette
} from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false, // Disable default to use our custom one
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            'Enter': () => this.editor.commands.setHardBreak(),
            'Shift-Enter': () => this.editor.commands.setHardBreak(),
          }
        },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }




  // Editor height state
  const [editorHeight, setEditorHeight] = React.useState(384);
  const isResizing = React.useRef(false);
  const startY = React.useRef(0);
  const startHeight = React.useRef(0);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      e.preventDefault();

      const delta = e.clientY - startY.current;
      const newHeight = Math.max(200, startHeight.current + delta);
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
        {/* Text Formatting */}
        <div className="flex gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded border transition-colors ${editor.isActive('bold')
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            title="Bold"
          >
            <Bold className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded border transition-colors ${editor.isActive('italic')
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            title="Italic"
          >
            <Italic className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded border transition-colors ${editor.isActive('underline')
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            title="Underline"
          >
            <UnderlineIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px bg-gray-300" />

        {/* Alignment */}
        <div className="flex gap-1">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded border transition-colors ${editor.isActive({ textAlign: 'left' })
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            title="Align Left"
          >
            <AlignLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded border transition-colors ${editor.isActive({ textAlign: 'center' })
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            title="Align Center"
          >
            <AlignCenter className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded border transition-colors ${editor.isActive({ textAlign: 'right' })
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            title="Align Right"
          >
            <AlignRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded border transition-colors ${editor.isActive({ textAlign: 'justify' })
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            title="Justify"
          >
            <AlignJustify className="w-5 h-5" />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px bg-gray-300" />

        {/* Lists */}
        <div className="flex gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded border transition-colors ${editor.isActive('bulletList')
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            title="Bullet List"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded border transition-colors ${editor.isActive('orderedList')
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            title="Numbered List"
          >
            <ListOrdered className="w-5 h-5" />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px bg-gray-300" />

        {/* Color Picker */}
        <div className="relative flex items-center justify-center p-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors">
          <Palette className="w-5 h-5 text-gray-700 pointer-events-none" />
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Text Color"
          />
        </div>
      </div>

      <div
        id="tiptap-editor-container"
        className="group relative w-full border border-gray-300 rounded-lg overflow-hidden focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200 focus-within:border-gray-400 transition-all bg-white"
        style={{ height: `${editorHeight}px` }}
      >
        <style>{`
          .ProseMirror:focus { outline: none !important; box-shadow: none !important; }
          .ProseMirror { min-height: 100%; outline: none !important; }
        `}</style>

        <EditorContent
          editor={editor}
          className="h-full w-full prose prose-sm max-w-none outline-none [&_.ProseMirror]:outline-none overflow-y-auto p-4 pb-6"
        />

        <div
          className="absolute bottom-0 right-0 p-1 cursor-se-resize text-gray-400 hover:text-gray-600 transition-colors z-10"
          style={{ position: 'absolute', bottom: '0px', right: '0px', left: 'auto' }}
          onMouseDown={(e) => {
            e.preventDefault();
            isResizing.current = true;
            startY.current = e.clientY;
            startHeight.current = editorHeight;
            document.body.style.cursor = 'se-resize';
            document.body.style.userSelect = 'none';
          }}
          title="Drag to resize"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L15 7M15 7V15M15 15H7M15 15L4 4"
              stroke="transparent"
              strokeWidth="0"
            />
            {/* Actual visual lines */}
            <path
              d="M11 14L15 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 14L15 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M5 14L15 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
