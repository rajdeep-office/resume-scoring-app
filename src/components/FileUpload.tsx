import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileProcessor } from '@/utils/fileProcessor';

interface FileUploadProps {
  onFileProcessed: (text: string, fileName: string) => void;
  className?: string;
}

export const FileUpload = ({ onFileProcessed, className }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcess = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      const validation = FileProcessor.validateFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      const text = await FileProcessor.processFile(file);
      onFileProcessed(text, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileProcess(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
          "hover:border-primary hover:bg-primary/5",
          isDragOver ? "border-primary bg-primary/10" : "border-border",
          isProcessing && "pointer-events-none opacity-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="resume-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-white" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isProcessing ? 'Processing your resume...' : 'Upload your resume'}
            </h3>
            <p className="text-muted-foreground">
              Drag & drop your resume here, or{' '}
              <span className="text-primary font-medium">browse files</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports PDF, Word (.doc, .docx), and text files up to 10MB
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>Word</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>Text</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-score-poor/10 border border-score-poor/20 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-score-poor flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-score-poor">Upload Error</p>
            <p className="text-sm text-score-poor/80">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};