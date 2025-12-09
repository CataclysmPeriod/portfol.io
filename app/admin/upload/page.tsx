"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { uploadArtwork } from "@/app/actions/artwork";
import TagInput from "@/app/components/TagInput";
import RichTextEditor from "@/app/components/RichTextEditor";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));

    const result = await uploadArtwork(formData);
    
    if (result.success) {
      router.push("/admin/manage");
    } else {
      alert("Upload failed");
    }
    setIsUploading(false);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Image Preview */}
      <div className="border border-white/10 rounded-lg aspect-square flex items-center justify-center bg-white/5 overflow-hidden relative">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-white/50 mb-4">No image selected</p>
            <label className="cursor-pointer bg-white/10 px-4 py-2 rounded hover:bg-white/20 transition-colors inline-block">
              choose file
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>

      {/* Right: Form */}
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">upload artwork</h1>
          <p className="text-white/50 text-sm">share your creation with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">artwork title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-navy border border-white/20 rounded p-3 focus:outline-none focus:border-cyan transition-colors"
              placeholder="Enter title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">artwork description*</label>
            <div className="bg-white text-black rounded overflow-hidden">
                <ReactQuill 
                    theme="snow" 
                    value={description} 
                    onChange={setDescription} 
                    className="h-48 mb-12" // mb-12 to make space for toolbar
                />
            </div>
          </div>

          <div className="space-y-2 pt-8">
            <label className="text-sm font-medium block mb-2">tags</label>
            <TagInput value={tags} onChange={setTags} />
          </div>

          <div className="pt-4 flex justify-end gap-4">
             <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded hover:bg-white/10 transition-colors"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-6 py-2 bg-white text-navy font-bold rounded hover:bg-cyan transition-colors disabled:opacity-50"
            >
              {isUploading ? "uploading..." : "publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
