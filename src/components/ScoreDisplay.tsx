import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  label: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

export const ScoreDisplay = ({ 
  score, 
  label, 
  description, 
  size = 'md',
  showAnimation = true 
}: ScoreDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-score-excellent';
    if (score >= 80) return 'text-score-good';
    if (score >= 70) return 'text-score-needs-improvement';
    return 'text-score-poor';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'stroke-score-excellent';
    if (score >= 80) return 'stroke-score-good';
    if (score >= 70) return 'stroke-score-needs-improvement';
    return 'stroke-score-poor';
  };

  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <svg className={cn(sizeClasses[size], "transform -rotate-90")} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-border"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              getScoreBackground(score),
              showAnimation && "transition-all duration-1000 ease-out"
            )}
            style={{
              strokeDashoffset: showAnimation ? strokeDashoffset : circumference,
            }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "font-bold transform rotate-90",
            textSizeClasses[size],
            getScoreColor(score)
          )}>
            {score}
          </span>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="font-semibold text-foreground">{label}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};