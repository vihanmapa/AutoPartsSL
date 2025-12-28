
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { DamageAnalysisResult } from '../types';
import { analyzeVehicleImage } from '../services/gemini';
import { Button } from '../components/ui/Button';
import { Camera, Upload, Search, AlertTriangle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

export const ImageAnalysis: React.FC = () => {
  const { setView, setSearchQuery, aiScanState, saveAIScan } = useApp();
  const { notify } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { image, result, isAnalyzing } = aiScanState;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveAIScan({
          image: reader.result as string,
          result: null,
          isAnalyzing: false
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    saveAIScan({ ...aiScanState, isAnalyzing: true });
    try {
      const analysis = await analyzeVehicleImage(image);
      saveAIScan({
        image,
        result: analysis,
        isAnalyzing: false
      });
      notify('success', "Image analysis complete!");
    } catch (error: any) {
      console.error("Analysis failed:", error);
      notify('error', error.message || "Failed to analyze image. Please try again.");
      saveAIScan({ ...aiScanState, isAnalyzing: false });
    }
  };

  const handleFindPart = (query: string) => {
    setSearchQuery(query);
    setView('marketplace');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
          <Camera className="h-8 w-8 text-secondary" />
          AI Damage Assessment
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Upload a photo of a damaged vehicle. Our AI will analyze the damage and help you find replacement parts instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Upload Area */}
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-xl h-[400px] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden bg-slate-50 relative ${image ? 'border-secondary' : 'border-slate-300 hover:border-slate-400'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <img src={image} alt="Uploaded vehicle" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-8">
                <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">Upload Photo</h3>
                <p className="text-sm text-slate-400">Click to browse or drag & drop</p>
                <p className="text-xs text-slate-400 mt-2">Supports JPG, PNG (Max 5MB)</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!image || isAnalyzing}
            className="w-full h-12 text-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Analyzing Damage...
              </>
            ) : (
              <>
                Analyze Image <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Right: Results Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
          {!result && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
              <Search className="h-12 w-12 mb-4 opacity-30" />
              <p>Upload an image and click "Analyze" to see the AI assessment here.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <div className="relative h-16 w-16 mb-4">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="font-medium text-slate-700">Identifying damaged parts...</p>
              <p className="text-sm">This typically takes 5-10 seconds.</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className={`p-4 rounded-lg flex items-start gap-3 ${result.damageDetected ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                {result.damageDetected ? (
                  <AlertTriangle className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-bold ${result.damageDetected ? 'text-orange-800' : 'text-green-800'}`}>
                    {result.damageDetected ? 'Damage Detected' : 'No Significant Damage Detected'}
                  </h3>
                  <p className={`text-sm mt-1 ${result.damageDetected ? 'text-orange-700' : 'text-green-700'}`}>
                    {result.overallAssessment}
                  </p>
                </div>
              </div>

              {result.identifiedParts.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">Suggested Replacements</h3>
                  <div className="space-y-3">
                    {result.identifiedParts.map((part, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4 hover:border-secondary transition-colors group bg-slate-50 hover:bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                              {part.partName}
                              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${part.confidenceLevel === 'High' ? 'bg-green-100 text-green-700 border-green-200' :
                                part.confidenceLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                  'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                {part.confidenceLevel} Confidence
                              </span>
                            </h4>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{part.damageDescription}</p>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full sm:w-auto"
                          onClick={() => handleFindPart(part.searchQuery)}
                        >
                          <Search className="h-3 w-3 mr-2" /> Find {part.partName}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
