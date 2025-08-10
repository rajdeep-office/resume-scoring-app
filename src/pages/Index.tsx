import { useState } from 'react';
import { FileText, Zap, Target, TrendingUp } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { TextInput } from '@/components/TextInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { ResumeAnalyzer, ResumeAnalysis } from '@/utils/resumeAnalyzer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>();

  const handleAnalyze = async (text: string, fileName?: string) => {
    setIsAnalyzing(true);
    setFileName(fileName);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = ResumeAnalyzer.analyzeResume(text);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setAnalysis(null);
    setFileName(undefined);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing Your Resume</h2>
            <p className="text-muted-foreground">
              Our AI is evaluating formatting, keywords, grammar, and readability...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (analysis) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <Button onClick={handleReset} variant="outline">
              ← Analyze Another Resume
            </Button>
          </div>
          <AnalysisResults analysis={analysis} fileName={fileName} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Resume{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Scoring
                </span>{' '}
                Tool
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get instant feedback on your resume with AI-powered analysis. 
                Improve your formatting, keywords, grammar, and readability to land more interviews.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="p-6 text-center hover:shadow-card transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instant Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get your resume score in seconds with detailed breakdowns
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-card transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Keyword Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Identify relevant keywords that match job descriptions
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-card transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Improvement Tips</h3>
                <p className="text-sm text-muted-foreground">
                  Actionable suggestions to enhance your resume's impact
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Upload Your Resume
          </h2>
          <p className="text-muted-foreground">
            Choose your preferred method to get started with the analysis
          </p>
        </div>

        <div className="space-y-8">
          <FileUpload onFileProcessed={handleAnalyze} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">or</span>
            </div>
          </div>
          
          <TextInput onTextSubmit={(text) => handleAnalyze(text, 'Pasted Text')} />
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">What We Analyze</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Formatting:</strong> Structure, sections, and layout</li>
              <li>• <strong>Keywords:</strong> Industry-relevant terms and skills</li>
              <li>• <strong>Grammar:</strong> Language quality and professionalism</li>
              <li>• <strong>Readability:</strong> Clarity and flow of content</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Privacy & Security</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Client-side only:</strong> Your data never leaves your browser</li>
              <li>• <strong>No storage:</strong> Documents are not saved or transmitted</li>
              <li>• <strong>Instant processing:</strong> Real-time analysis without uploads</li>
              <li>• <strong>Secure:</strong> Complete privacy and data protection</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
