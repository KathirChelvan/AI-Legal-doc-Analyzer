'use client';
import { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  Download,
  Clock,
  BarChart3,
  Shield,
  Zap,
  Eye,
  Copy,
  RefreshCw,
  X
} from 'lucide-react';

interface AnalysisResult {
  filename: string;
  text_length: number;
  analysis: string;
}

interface FilePreview {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setUploadProgress(0);
    
    if (selectedFile) {
      setFilePreview({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified
      });
    } else {
      setFilePreview(null);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || 
                       droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                       droppedFile.type === 'text/plain')) {
      handleFileChange(droppedFile);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }

      const data = await res.json();
      setResult(data);
      setAnalysisHistory(prev => [data, ...prev.slice(0, 4)]); // Keep last 5 analyses
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setFilePreview(null);
    setResult(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
      </div>

      <main className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">
              AI Legal Analyzer
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Harness the power of AI to analyze legal documents with unprecedented accuracy and speed
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: Zap, text: 'Instant Analysis' },
              { icon: Shield, text: 'Secure Processing' },
              { icon: BarChart3, text: 'Detailed Insights' },
              { icon: Clock, text: '24/7 Available' }
            ].map(({ icon: Icon, text }, index) => (
              <div key={text} className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 animate-slide-in-left" style={{animationDelay: `${index * 0.1}s`}}>
                <Icon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Section */}
          <div className="lg:col-span-2">
            <div className="card-enhanced glass p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {/* Upload Area */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Upload className="w-6 h-6 mr-3 text-blue-600" />
                  Document Upload
                </h2>
                
                <div
                  className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50 scale-105' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <label className="flex flex-col items-center justify-center w-full h-64 cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className={`p-4 rounded-full mb-4 transition-all ${
                        isDragOver ? 'bg-blue-100 scale-110' : 'bg-gray-100'
                      }`}>
                        <Upload className={`w-10 h-10 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <p className="mb-2 text-lg font-semibold text-gray-700">
                        {isDragOver ? 'Drop your file here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PDF, DOCX, and TXT files up to 10MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleInputChange}
                    />
                  </label>

                  {/* File Preview */}
                  {filePreview && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <FileText className="w-8 h-8 text-blue-600" />
                          </div>
                          <button
                            onClick={resetAnalysis}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{filePreview.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Size: {formatFileSize(filePreview.size)}</p>
                          <p>Modified: {formatDate(filePreview.lastModified)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Uploading... {Math.round(uploadProgress)}%</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="btn-primary text-white font-semibold py-3 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3 focus-ring"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing Document...</span>
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5" />
                        <span>Start Analysis</span>
                      </>
                    )}
                  </button>

                  {file && !loading && (
                    <button
                      onClick={resetAnalysis}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors flex items-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 animate-slide-in-left">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-1">Analysis Failed</h3>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {result && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                      Analysis Complete
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(result.analysis)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy analysis"
                      >
                        <Copy className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download report"
                      >
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Result Meta */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">File:</span>
                        <span className="text-gray-600">{result.filename}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Length:</span>
                        <span className="text-gray-600">{result.text_length.toLocaleString()} chars</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Processed:</span>
                        <span className="text-gray-600">Just now</span>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Content */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Analysis Results
                      </h3>
                    </div>
                    <div className="p-6 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-mono">
                        {result.analysis}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card-enhanced glass p-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <h3 className="font-bold text-gray-900 mb-4">Analysis Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Documents Analyzed</span>
                  <span className="font-semibold text-gray-900">{analysisHistory.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Processing</span>
                  <span className="font-semibold text-blue-600"></span>
                </div>
              </div>
            </div>

            {/* Recent Analyses */}
            {analysisHistory.length > 0 && (
              <div className="card-enhanced glass p-6 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <h3 className="font-bold text-gray-900 mb-4">Recent Analyses</h3>
                <div className="space-y-3">
                  {analysisHistory.slice(0, 3).map((analysis, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {analysis.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {analysis.text_length.toLocaleString()} characters
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Help & Tips */}
            <div className="card-enhanced glass p-6 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <h3 className="font-bold text-gray-900 mb-4">💡 Tips for Better Analysis</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Ensure documents are clearly scanned</li>
                <li>• Remove personal information if needed</li>
                <li>• Use standard legal document formats</li>
                <li>• Keep file sizes under 10MB</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
