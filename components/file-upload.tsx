'use client'
import { UploadDropzone } from "@/lib/uploadthing";

import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (url?: string) => void;
}

export const FileUpload = ({
  endpoint,
  value,
  onChange,
}: FileUploadProps) => {
  const fileType = value.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative size-20">
        <Image
          fill
          src={value}
          alt='Upload'
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(err: Error) => {
        console.log(err)
      }}
    />

  );
};