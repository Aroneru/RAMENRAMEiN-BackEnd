"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';
import { getNewsItemAction, updateNewsItemAction, deleteNewsItemAction } from "./actions";

interface EditNewsProps {
  id: string;
}

export default function EditNewsDashboard({ id }: EditNewsProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [isPublished, setIsPublished] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsContent, setNewsContent] = useState<string>("");

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

  useEffect(() => {
    if (id) {
      loadNewsData();
    } else {
      setError("No news ID provided");
      setLoadingData(false);
    }
  }, [id]);

  // Set editor content when editor is ready and newsContent is available
  useEffect(() => {
    if (editor && newsContent && !editor.isDestroyed) {
      editor.commands.setContent(newsContent);
    }
  }, [editor, newsContent]);

  const loadNewsData = async () => {
    if (!id) return;

    try {
      const result = await getNewsItemAction(id);

      if (result.error) {
        setError(result.error);
        setLoadingData(false);
        return;
      }

      if (result.data) {
        setTitle(result.data.title || "");
        setDescription(result.data.description || "");
        setCategory(result.data.category || "general");
        setIsPublished(result.data.is_published || false);
        setCurrentThumbnail(result.data.image_url || "");
        setThumbnailPreview(result.data.image_url || null);
        
        // Store content in state
        if (result.data.content) {
          setNewsContent(result.data.content);
        }
      }

      setLoadingData(false);
    } catch (err: unknown) {
      console.error("Error loading news:", err);
      setError((err as Error).message || "Failed to load news");
      setLoadingData(false);
    }
  };

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

  const handleEditImageClick = () => {
    document.getElementById('fileInput')?.click();
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
    if (!id) {
      setError('No news ID provided');
      return;
    }

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

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("body", body.trim());
      formData.append("category", category.trim());
      formData.append("isPublished", isPublished.toString());
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      formData.append("currentThumbnail", currentThumbnail);

      const result = await updateNewsItemAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setSuccess("News updated successfully!");
      setLoading(false);
      
      setTimeout(() => {
        router.push('/dashboard-news');
      }, 1500);
    } catch (err: unknown) {
      console.error("Error updating news:", err);
      setError((err as Error).message || "Failed to update news");
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) {
      setError('No news ID provided');
      setShowDeleteModal(false);
      return;
    }

    setError(null);
    setSuccess(null);
    setDeleting(true);

    try {
      const result = await deleteNewsItemAction(id);

      if (result.error) {
        setError(result.error);
        setDeleting(false);
        setShowDeleteModal(false);
        return;
      }

      setSuccess("News deleted successfully!");
      setDeleting(false);
      setShowDeleteModal(false);
      
      setTimeout(() => {
        router.push('/dashboard-news');
      }, 1500);
    } catch (err: unknown) {
      console.error("Error deleting news:", err);
      setError((err as Error).message || "Failed to delete news");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (loadingData) {
    return (
      <div
        className="min-h-screen lg:ml-64 ml-0 flex items-center justify-center"
        style={{ backgroundColor: "#FFFDF7" }}
      >
        <div className="text-xl">Loading news data...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen lg:ml-64 ml-0"
      style={{ backgroundColor: "#FFFDF7" }}
    >
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={handleDeleteCancel}
        >
          <div
            className="bg-white rounded-lg shadow-xl animate-scale-in overflow-hidden w-full max-w-[400px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div
                className="rounded-full bg-red-100 flex items-center justify-center"
                style={{ width: "64px", height: "64px" }}
              >
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h3
              className="text-center mb-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "24px",
                fontWeight: "600",
                color: "#1D1A1A",
              }}
            >
              Delete News?
            </h3>

            <p
              className="text-center mb-6"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "16px",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              Are you sure you want to delete this news? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "16px",
                  minWidth: "120px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "16px",
                  minWidth: "120px",
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <span className="whitespace-nowrap">Edit News</span>
        </div>
      </div>

      {/* Edit News Form - Centered */}
      <div className="px-4 md:px-[45px] pb-10">
        <h2
          className="text-center text-xl md:text-2xl mb-6 md:mb-[35px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "500",
            color: "#1D1A1A",
          }}
        >
          Edit News
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
              Thumbnail
            </label>
            
            <input
              type="file"
              id="fileInput"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileInput}
              disabled={loading || deleting}
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
                isDragging
                  ? "border-[#4A90E2] bg-blue-50"
                  : "border-[#EAEAEA] bg-white"
              } ${loading || deleting ? "opacity-50 pointer-events-none" : ""}`}
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
                  {!loading && !deleting && (
                    <button
                      onClick={handleEditImageClick}
                      className="absolute top-2 right-2 bg-[#FFC700] text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-[#E6B300] transition-colors shadow-md"
                      title="Change image"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span className="hidden sm:inline" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "14px", fontWeight: "500" }}>
                        Edit
                      </span>
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
                  <label
                    htmlFor="fileInput"
                    className={`px-6 py-2 border border-[#EAEAEA] rounded transition-colors ${
                      loading || deleting
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
              disabled={loading || deleting}
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
              disabled={loading || deleting}
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
              disabled={loading || deleting}
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
                disabled={loading || deleting}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-8 gap-3 sm:gap-4">
            <button
              onClick={handleDeleteClick}
              disabled={loading || deleting}
              className="w-full sm:w-auto px-8 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-3 sm:order-1"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                height: "45px",
                minWidth: "150px",
              }}
            >
              Delete
            </button>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-1 sm:order-2">
              <Link href="/dashboard-news" className="w-full sm:w-auto">
                <button
                  disabled={loading || deleting}
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
                disabled={loading || deleting}
                className="w-full sm:w-auto px-8 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "clamp(16px, 3vw, 18px)",
                  height: "45px",
                  minWidth: "150px",
                }}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
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
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
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