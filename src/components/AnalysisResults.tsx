import { useState, useEffect } from 'react';
import { 
  Target, 
  Lightbulb, 
  TrendingUp, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Hash
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreDisplay } from './ScoreDisplay';
import { ResumeAnalysis } from '@/utils/resumeAnalyzer';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
  fileName?: string;
}

export const AnalysisResults = ({ analysis, fileName }: AnalysisResultsProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'bg-score-excellent' };
    if (score >= 80) return { level: 'Very Good', color: 'bg-score-good' };
    if (score >= 70) return { level: 'Good', color: 'bg-score-needs-improvement' };
    if (score >= 60) return { level: 'Fair', color: 'bg-score-needs-improvement' };
    return { level: 'Needs Improvement', color: 'bg-score-poor' };
  };

  const overallLevel = getScoreLevel(analysis.overallScore);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Resume Analysis Complete</h2>
        {fileName && (
          <p className="text-muted-foreground">
            Analysis for: <span className="font-medium">{fileName}</span>
          </p>
        )}
      </div>

      {/* Overall Score */}
      <Card className="p-8 text-center bg-gradient-to-br from-card to-primary/5 shadow-elegant">
        <div className="space-y-4">
          <ScoreDisplay 
            score={analysis.overallScore} 
            label="Overall Score"
            size="lg"
            showAnimation={showAnimation}
          />
          <div className="space-y-2">
            <Badge 
              className={cn(
                "px-4 py-2 text-white font-medium",
                overallLevel.color
              )}
            >
              {overallLevel.level}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Your resume scores {analysis.overallScore}/100 based on industry standards
            </p>
          </div>
        </div>
      </Card>

      {/* Detailed Scores */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Detailed Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <ScoreDisplay 
              score={analysis.scores.formatting} 
              label="Formatting"
              description="Structure & layout"
              showAnimation={showAnimation}
            />
          </div>
          <div className="text-center space-y-3">
            <ScoreDisplay 
              score={analysis.scores.keywords} 
              label="Keywords"
              description="Industry relevance"
              showAnimation={showAnimation}
            />
          </div>
          <div className="text-center space-y-3">
            <ScoreDisplay 
              score={analysis.scores.grammar} 
              label="Grammar"
              description="Language quality"
              showAnimation={showAnimation}
            />
          </div>
          <div className="text-center space-y-3">
            <ScoreDisplay 
              score={analysis.scores.readability} 
              label="Readability"
              description="Clarity & flow"
              showAnimation={showAnimation}
            />
          </div>
        </div>
      </Card>

      {/* Stats and Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Word Count</span>
              </div>
              <span className="font-semibold">{analysis.wordCount}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Reading Level</span>
              </div>
              <span className="font-semibold">{analysis.readingLevel}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Keywords Found</span>
              </div>
              <span className="font-semibold">{analysis.matchedKeywords.length}</span>
            </div>
          </div>
        </Card>

        {/* Matched Keywords */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Matched Keywords</h3>
          </div>
          
          {analysis.matchedKeywords.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Keywords that match common job requirements:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedKeywords.slice(0, 15).map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="capitalize">
                    {keyword}
                  </Badge>
                ))}
                {analysis.matchedKeywords.length > 15 && (
                  <Badge variant="outline">
                    +{analysis.matchedKeywords.length - 15} more
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No relevant keywords found</p>
            </div>
          )}
        </Card>
      </div>

      {/* Suggestions */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Improvement Suggestions</h3>
        </div>
        
        <div className="space-y-4">
          {analysis.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
              <p className="text-sm text-foreground">{suggestion}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};