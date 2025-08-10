import { useState } from 'react';
import { PlusCircle, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  className?: string;
}

export const TextInput = ({ onTextSubmit, className }: TextInputProps) => {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
      setText('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isExpanded) {
    return (
      <div className={cn("w-full", className)}>
        <button
          onClick={() => setIsExpanded(true)}
          className={cn(
            "w-full p-6 border-2 border-dashed border-border rounded-lg",
            "hover:border-primary hover:bg-primary/5 transition-all duration-300",
            "flex items-center justify-center space-x-3 text-muted-foreground hover:text-primary"
          )}
        >
          <Type className="w-6 h-6" />
          <span className="font-medium">Or paste your resume text directly</span>
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="space-y-2">
        <label htmlFor="resume-text" className="text-sm font-medium text-foreground">
          Paste your resume text
        </label>
        <Textarea
          id="resume-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your complete resume text here..."
          className="min-h-[200px] resize-none"
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to analyze
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          Analyze Resume
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsExpanded(false);
            setText('');
          }}
        >
          Cancel
        </Button>
      </div>
      
      {text.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {text.length} characters, approximately {Math.ceil(text.split(/\s+/).length)} words
        </div>
      )}
    </div>
  );
};