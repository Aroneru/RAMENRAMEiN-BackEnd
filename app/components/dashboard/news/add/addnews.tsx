"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';
import { addNewsItemAction } from "./actions";

export default function AddNewsDashboard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [isPublished, setIsPublished] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // TipTap Editor
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
    content: '<p>Insert full news content</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  });

  const handleThumbnailChange = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setError("Please upload JPEG, JPG, or PNG image only");
      setSuccess(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      setSuccess(null);
      return;
    }

    setError(null);
    setThumbnail(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleThumbnailChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleThumbnailChange(file);
    }
  };

  const handleSubmit = async () => {
    const body = editor?.getHTML() || '';
    
    // Validation
    if (!title.trim()) {
      setError("Please enter news title");
      setSuccess(null);
      return;
    }
    if (!description.trim()) {
      setError("Please enter description");
      setSuccess(null);
      return;
    }
    if (!body.trim() || body === '<p>Insert full news content</p>' || body === '<p></p>') {
      setError("Please enter news content");
      setSuccess(null);
      return;
    }
    if (!thumbnail) {
      setError("Please upload a thumbnail");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("body", body.trim());
      formData.append("category", category.trim());
      formData.append("thumbnail", thumbnail);
      formData.append('isPublished', isPublished.toString());

      const result = await addNewsItemAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setSuccess("News added successfully!");
      setLoading(false);
      
      setTimeout(() => {
        router.push('/dashboard-news');
      }, 1500);
    } catch (err: any) {
      console.error("Error adding news:", err);
      setError(err.message || "Failed to add news");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen lg:ml-64 ml-0"
      style={{ backgroundColor: "#FFFDF7" }}
    >
      {/* Toast Error Notification */}
      {error && (
        <div
          className="fixed z-50 animate-slide-in"
          style={{
            top: "24px",
            right: "24px",
            width: "400px",
            maxWidth: "calc(100vw - 48px)",
          }}
        >
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <svg
                className="w-6 h-6 text-red-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                {error}
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="shrink-0 text-red-500 hover:text-red-700 transition-colors"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Toast Success Notification */}
      {success && (
        <div
          className="fixed z-50 animate-slide-in"
          style={{
            top: "24px",
            right: "24px",
            width: "400px",
            maxWidth: "calc(100vw - 48px)",
          }}
        >
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <svg
                className="w-6 h-6 text-green-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                {success}
              </p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="shrink-0 text-green-500 hover:text-green-700 transition-colors"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Navigator */}
      <div
        className="px-4 md:px-[45px] pt-20 md:pt-[60px] mb-8 md:mb-[75px]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: "700",
          fontSize: "clamp(18px, 4vw, 24px)",
        }}
      >
        <div className="flex flex-wrap items-center gap-2 text-[#1D1A1A]">
          <span className="whitespace-nowrap">Website Adjustment</span>
          <span className="text-[#1D1A1A]">/</span>
          <Link href="/dashboard-news" className="hover:underline whitespace-nowrap">
            News
          </Link>
          <span className="text-[#1D1A1A]">/</span>
          <span className="whitespace-nowrap">Add News</span>
        </div>
      </div>

      {/* Add News Form - Centered */}
      <div className="px-4 md:px-[45px] pb-10">
        <h2
          className="text-center text-xl md:text-2xl mb-6 md:mb-[35px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "500",
            color: "#1D1A1A",
          }}
        >
          Add News
        </h2>

        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          {/* 1. Thumbnail Upload */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
                isDragging
                  ? "border-[#4A90E2] bg-blue-50"
                  : "border-[#EAEAEA] bg-white"
              } ${loading ? "opacity-50 pointer-events-none" : ""}`}
              style={{
                height: "clamp(250px, 50vw, 330px)",
                transition: "all 0.3s ease",
              }}
            >
              {thumbnailPreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full h-full object-contain p-4"
                  />
                  {!loading && (
                    <button
                      onClick={() => {
                        setThumbnail(null);
                        setThumbnailPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <Image
                    src="/dashboard/upload.svg"
                    alt="Upload"
                    width={60}
                    height={60}
                    className="mb-4"
                  />
                  <p
                    className="text-center px-4"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "clamp(14px, 3vw, 18px)",
                      color: "#1D1A1A",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    Choose a file or drag & drop it here
                  </p>
                  <p
                    className="text-center px-4"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "clamp(12px, 2.5vw, 14px)",
                      color: "#999",
                      marginBottom: "20px",
                    }}
                  >
                    JPEG, JPG, and PNG formats, up to 10MB
                  </p>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileInput}
                    disabled={loading}
                    className="hidden"
                  />
                  <label
                    htmlFor="fileInput"
                    className={`px-6 py-2 border border-[#EAEAEA] rounded transition-colors ${
                      loading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "clamp(14px, 2.5vw, 16px)",
                      color: "#1D1A1A",
                    }}
                  >
                    Browse File
                  </label>
                </>
              )}
            </div>
          </div>

          {/* 2. Title Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Insert news title"
              disabled={loading}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* 3. Description Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Insert news description (summary)"
              rows={2}
              disabled={loading}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white resize-y disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
                minHeight: "80px",
              }}
            />
          </div>

          {/* 4. Content Field - TipTap Editor */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Content <span className="text-red-500">*</span>
            </label>
            
            {/* Toolbar */}
            {editor && (
              <div className="border border-[#EAEAEA] rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
                    editor.isActive('bold') ? 'bg-gray-300' : ''
                  }`}
                  style={{ color: '#1D1A1A' }}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-sm ${
                    editor.isActive('italic') ? 'bg-gray-300' : ''
                  }`}
                  style={{ color: '#1D1A1A' }}
                >
                  <em>I</em>
                </button>
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
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-xs sm:text-sm ${
                    editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
                  }`}
                  style={{ color: '#1D1A1A' }}
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-xs sm:text-sm ${
                    editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
                  }`}
                  style={{ color: '#1D1A1A' }}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-xs sm:text-sm ${
                    editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
                  }`}
                  style={{ color: '#1D1A1A' }}
                >
                  H3
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-xs sm:text-sm ${
                    editor.isActive('bulletList') ? 'bg-gray-300' : ''
                  }`}
                  style={{ color: '#1D1A1A' }}
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`px-2 sm:px-3 py-1 rounded hover:bg-gray-200 text-xs sm:text-sm ${
                    editor.isActive('orderedList') ? 'bg-gray-300' : ''
                  }`}
                  style={{ color: '#1D1A1A' }}
                >
                  1. List
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
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
            )}
            
            {/* Editor */}
            <div className="border border-[#EAEAEA] border-t-0 rounded-b-lg bg-white">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* 5. Category Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
              }}
            >
              <option value="general">General</option>
              <option value="event">Event</option>
            </select>
          </div>

          {/* 6. Publish Status Checkbox */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-[#EAEAEA] text-[#4A90E2] focus:ring-[#4A90E2]"
              />
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "clamp(14px, 3vw, 18px)",
                  color: "#1D1A1A",
                }}
              >
                Publish this news immediately
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end mt-8 gap-3 sm:gap-4">
            <Link href="/dashboard-news" className="w-full sm:w-auto">
              <button
                disabled={loading}
                className="w-full sm:w-auto px-8 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "clamp(16px, 3vw, 18px)",
                  height: "45px",
                  minWidth: "150px",
                }}
              >
                Cancel
              </button>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-8 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                height: "45px",
                minWidth: "150px",
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .ProseMirror {
          min-height: 200px;
          outline: none;
          font-family: "Helvetica Neue", sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #1D1A1A;
        }
        
        .ProseMirror p {
          margin-bottom: 1em;
          color: #1D1A1A;
        }
        
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #1D1A1A;
        }
        
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #1D1A1A;
        }
        
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #1D1A1A;
        }
        
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 2em;
          margin-bottom: 1em;
          color: #1D1A1A;
        }
        
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 2em;
          margin-bottom: 1em;
          color: #1D1A1A;
        }
        
        .ProseMirror li {
          color: #1D1A1A;
          margin-bottom: 0.25em;
          display: list-item;
        }
        
        .ProseMirror strong {
          font-weight: bold;
          color: #1D1A1A;
        }
        
        .ProseMirror em {
          font-style: italic;
          color: #1D1A1A;
        }
        
        .ProseMirror u {
          text-decoration: underline;
          color: #1D1A1A;
        }
        
        .ProseMirror s {
          text-decoration: line-through;
          color: #1D1A1A;
        }
      `}</style>
    </div>
  );
}