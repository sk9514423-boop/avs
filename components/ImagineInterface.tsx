import React, { useState } from 'react';
import { Sparkles, Download, Loader2, AlertCircle } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { GeneratedImage } from '../types';

export const ImagineInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const base64Images = await generateImage(prompt);
      
      if (base64Images.length === 0) {
        throw new Error("No images returned from the model.");
      }

      const newImages = base64Images.map(url => ({
        url,
        prompt,
        timestamp: Date.now()
      }));

      setHistory(prev => [...newImages, ...prev]);
      setPrompt(''); // Clear input on success
    } catch (err: any) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full bg-slate-900 overflow-y-auto p-6 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Imagine Studio
          </h2>
          <p className="text-slate-400">
            Turn your text into visuals with Gemini 2.5 Flash Image.
          </p>
        </div>

        {/* Input Area */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleGenerate} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 animate-pulse-slow"></div>
            <div className="relative flex items-center bg-slate-800 rounded-2xl p-2 border border-slate-700 shadow-xl focus-within:border-purple-500 transition-colors">
              <div className="p-3 text-purple-400">
                <Sparkles size={24} />
              </div>
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with flying cars, neon lights, digital art..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 text-lg"
              />
              <button 
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {history.map((item, idx) => (
            <div key={item.timestamp + idx} className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-purple-900/20 hover:border-purple-500/50 transition-all duration-300">
              <div className="aspect-square relative overflow-hidden bg-slate-900">
                 <img src={item.url} alt={item.prompt} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-4 relative">
                <p className="text-sm text-slate-300 line-clamp-2 mb-3" title={item.prompt}>
                  "{item.prompt}"
                </p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Gemini 2.5 Image</span>
                  <a 
                    href={item.url} 
                    download={`gemini-${item.timestamp}.png`}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    title="Download Image"
                  >
                    <Download size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
          
          {history.length === 0 && !isGenerating && (
            <div className="col-span-full text-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
              <Sparkles className="mx-auto mb-4 opacity-50" size={48} />
              <p className="text-lg">Your generated masterpieces will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};