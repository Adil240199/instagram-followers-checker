"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileCode2,
  Trash2,
  Upload,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_FILE_SIZE, ALLOWED_FILE_EXTENSIONS } from "@/lib/constants";
import { parseInstagramHtml } from "@/lib/parsers/htmlParser";
import { InstagramUser } from "@/types/instagram";
interface FileUploadProps {
  title: string;
  description: string;
  onUsersParsed: (users: InstagramUser[]) => void;
}

export default function FileUpload({
  title,
  description,
  onUsersParsed,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<InstagramUser[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError(null);
    setUsers([]);

    const fileExtension = `.${selectedFile.name
      .split(".")
      .pop()
      ?.toLowerCase()}`;

    const isValidExtension = ALLOWED_FILE_EXTENSIONS.includes(fileExtension);

    if (!isValidExtension) {
      setFile(null);
      setError("Please select an HTML file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("File size must be less than 10 MB.");
      return;
    }

    try {
      const html = await selectedFile.text();

      const parsedUsers = parseInstagramHtml(html);

      if (parsedUsers.length === 0) {
        setFile(null);
        setError("No Instagram profiles were found in this file.");
        return;
      }
      onUsersParsed(parsedUsers);

      setFile(selectedFile);
      setUsers(parsedUsers);

      console.log("Parsed Instagram users:", parsedUsers);
    } catch {
      setFile(null);
      setError("Could not read the file. Please try another HTML file.");
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const dropped = e.dataTransfer.files?.[0];

    if (!dropped) return;

    const fakeEvent = {
      target: { files: e.dataTransfer.files },
    } as unknown as ChangeEvent<HTMLInputElement>;

    await handleFileChange(fakeEvent);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setUsers([]);
    onUsersParsed([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card
      className={cn("border-dashed", isDragging && "ring-2 ring-primary/40")}
    >
      <CardContent
        className="p-6"
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        aria-label={`${title} upload drop zone`}
      >
        {!file ? (
          <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Upload className="h-5 w-5" />
            </div>

            <h3 className="mb-1 text-lg font-semibold">{title}</h3>

            <p className="mb-5 max-w-sm text-sm text-muted-foreground">
              {description}
            </p>

            <Button onClick={handleChooseFile}>Choose file</Button>

            <input
              ref={inputRef}
              type="file"
              accept=".html,.htm,text/html"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="mt-3 text-xs text-muted-foreground">
              HTML • Max 10 MB
            </p>

            {error && (
              <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-56 flex-col justify-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <FileCode2 className="h-6 w-6" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="break-all font-semibold">{file.name}</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">File selected</p>

                <p className="mt-1 text-sm font-medium">
                  {users.length.toLocaleString()} Instagram profiles found
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="mx-auto mt-4"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove file
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
