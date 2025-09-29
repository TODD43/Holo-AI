import { useState, useRef } from "react";
import { Upload, FileText, Image, Video, Music, Archive, Search, Brain, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  content?: string;
}

const HolographicAI = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (type.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (type.startsWith('audio/')) return <Music className="w-6 h-6" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    
    setIsProcessing(true);
    setProgress(0);

    uploadedFiles.forEach((file, index) => {
      const fileData: FileData = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
      };

      // Simulate file processing
      setTimeout(() => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fileData.preview = e.target?.result as string;
            setFiles(prev => [...prev, fileData]);
          };
          reader.readAsDataURL(file);
        } else {
          setFiles(prev => [...prev, fileData]);
        }
        
        setProgress(((index + 1) / uploadedFiles.length) * 100);
        
        if (index === uploadedFiles.length - 1) {
          setIsProcessing(false);
          toast({
            title: "Files Processed",
            description: `Successfully added ${uploadedFiles.length} file(s) to your collection`,
          });
        }
      }, (index + 1) * 500);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    
    toast({
      title: "AI Analysis",
      description: `Searching for "${query}" across your documents...`,
    });
    
    // Simulate AI processing
    setTimeout(() => {
      toast({
        title: "Search Complete",
        description: "Found relevant content in your files!",
      });
    }, 2000);
  };

  return (
    <>
      {/* Holographic Assistant Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          className="relative h-16 w-16 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 p-0 shadow-lg animate-hologram-glow hover:animate-glitch"
          style={{
            background: 'var(--gradient-hologram)',
            boxShadow: 'var(--shadow-hologram)',
          }}
        >
          <Brain className="h-8 w-8 text-white animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-green-400/20 animate-hologram-float"></div>
        </Button>
      </div>

      {/* Holographic Interface */}
      {isVisible && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative">
            {/* Scan line effect */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line"></div>
            </div>
            
            {/* Main holographic panel */}
            <Card 
              className="relative w-[800px] h-[600px] bg-black/80 border-2 border-cyan-400/50 shadow-2xl animate-hologram-float backdrop-blur-md"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(128,0,255,0.1))',
                boxShadow: '0 0 50px rgba(0,255,255,0.3), inset 0 0 50px rgba(128,0,255,0.2)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-400/30">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
                  <h2 className="text-xl font-bold text-cyan-400">ARIA - AI Document Assistant</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-cyan-400 hover:bg-cyan-400/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6 h-[calc(100%-80px)] overflow-y-auto">
                {/* AI Search */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-400">Ask ARIA Anything</h3>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="What would you like to know about your documents?"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-black/50 border-purple-400/50 text-cyan-100 placeholder:text-cyan-400/60"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button
                      onClick={handleSearch}
                      className="bg-purple-500/80 hover:bg-purple-600/80 text-white"
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* File Upload Zone */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-green-400">Upload Documents</h3>
                  <div
                    className="border-2 border-dashed border-green-400/50 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 transition-colors bg-green-400/5 hover:bg-green-400/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-green-200">Drag & drop files here or click to browse</p>
                    <p className="text-green-400/60 text-sm mt-2">Supports PDFs, images, documents, and more</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.rar"
                  />
                </div>

                {/* Processing indicator */}
                {isProcessing && (
                  <div className="space-y-2">
                    <p className="text-cyan-400 text-sm">Processing files...</p>
                    <Progress value={progress} className="bg-black/50" />
                  </div>
                )}

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-cyan-400">Your Documents</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-black/30 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors"
                        >
                          <div className="text-cyan-400">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-cyan-100 font-medium truncate">{file.name}</p>
                            <p className="text-cyan-400/60 text-sm">{formatFileSize(file.size)}</p>
                          </div>
                          {file.preview && (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-10 h-10 rounded object-cover border border-cyan-400/30"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Suggestions */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-400">AI Suggestions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Summarize all documents",
                      "Find key insights",
                      "Extract important dates",
                      "Create document index"
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left justify-start h-auto p-3 bg-purple-500/10 border-purple-400/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50"
                        onClick={() => setQuery(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default HolographicAI;