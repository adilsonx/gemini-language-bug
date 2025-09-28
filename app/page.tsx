"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { FiUpload, FiFile, FiLoader, FiAlertTriangle } from "react-icons/fi";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setSummary("");
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    maxSize: 20 * 1024 * 1024, // 20MB limit
  });

  const handleSummarize = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/pdf-summarize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error processing PDF");
      }

      const result = await response.json();
      setSummary(result.summary);
      toast.success("PDF processed successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error processing PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FiAlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Gemini PDF Language Bug Reproduction
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This tool demonstrates a language preservation issue with the new
            Gemini 2.5 Flash Lite Preview model when processing PDF documents.
            The model sometimes returns summaries in incorrect languages
            (Italian, Spanish) instead of the original document language.
          </p>
        </div>

        {/* Bug Description */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Issue Description
          </h2>
          <div className="text-red-700 space-y-2">
            <p>
              • Model:{" "}
              <code className="bg-red-100 px-1 rounded">
                gemini-2.5-flash-lite-preview-09-2025
              </code>
            </p>
            <p>• Expected: Summary in the original document language</p>
            <p>
              • Actual: Summary sometimes appears in Italian or Spanish for
              specific english documents
            </p>
            <p>
              • The same problem occured with a "preview" version of gemini
              flash 2.0 few months ago
            </p>
            <p>
              • Reproduction rate: 20-30% of documents, making the model
              unusable in production environments
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Upload PDF Document
          </h3>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the PDF file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag and drop a PDF file here, or click to select
                </p>
                <p className="text-sm text-gray-500">Maximum size: 20MB</p>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiFile className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {file.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={handleSummarize}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <FiLoader className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Generate Summary"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {summary && (
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Generated Summary
            </h2>
            <div className="prose prose-gray max-w-none text-gray-800 bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans">{summary}</pre>
            </div>

            {/* Language Analysis */}
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Language Analysis
              </h3>
              <p className="text-yellow-700 text-sm">
                Please check if the summary above is in the expected language of
                your source document. If it appears in Italian or Spanish
                instead of the original language, this demonstrates the bug.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
