"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";

interface Props {
  name: string;
  defaultValue?: string;
}

export function TiptapEditor({ name, defaultValue = "" }: Props) {
  const [conteudo, setConteudo] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Escreva o roteiro aqui... use **negrito**, *itálico*, # título, > citação",
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Salva como markdown-like usando HTML → o react-markdown renderiza o que existe
      // Para simplicidade, guardamos texto puro com formatação básica
      setConteudo(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-roteiro focus:outline-none",
      },
    },
  });

  return (
    <div>
      <Toolbar editor={editor} />
      <div className="tiptap-editor rounded-b-lg border border-t-0 border-segueme-line bg-white">
        <EditorContent editor={editor} />
      </div>
      <textarea name={name} value={conteudo} readOnly hidden />
    </div>
  );
}

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const btn =
    "rounded px-2.5 py-1 text-sm font-medium transition-colors";
  const active = "bg-segueme-ink text-segueme-cream";
  const inactive = "text-segueme-ink hover:bg-segueme-cream";

  return (
    <div className="flex flex-wrap gap-1 rounded-t-lg border border-segueme-line bg-white p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btn} ${editor.isActive("bold") ? active : inactive}`}
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btn} ${editor.isActive("italic") ? active : inactive}`}
      >
        <em>I</em>
      </button>
      <span className="mx-1 w-px bg-segueme-line" />
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={`${btn} ${
          editor.isActive("heading", { level: 1 }) ? active : inactive
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={`${btn} ${
          editor.isActive("heading", { level: 2 }) ? active : inactive
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={`${btn} ${
          editor.isActive("heading", { level: 3 }) ? active : inactive
        }`}
      >
        H3
      </button>
      <span className="mx-1 w-px bg-segueme-line" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btn} ${
          editor.isActive("bulletList") ? active : inactive
        }`}
      >
        • Lista
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${btn} ${
          editor.isActive("orderedList") ? active : inactive
        }`}
      >
        1. Lista
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${btn} ${
          editor.isActive("blockquote") ? active : inactive
        }`}
      >
        ❝ Citação
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={`${btn} ${inactive}`}
      >
        — Divisor
      </button>
    </div>
  );
}
