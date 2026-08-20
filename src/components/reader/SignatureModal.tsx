"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, PenTool, Type, Image as ImageIcon, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature,
}) => {
  const [tab, setTab] = useState<"draw" | "type" | "upload">("draw");
  const [typedName, setTypedName] = useState("");
  const [selectedFont, setSelectedFont] = useState("cursive");
  const [penColor, setPenColor] = useState("#8b5cf6");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Setup canvas
  useEffect(() => {
    if (isOpen && tab === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [isOpen, tab, penColor]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (tab === "draw") {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        onSaveSignature(dataUrl);
        onClose();
      }
    } else if (tab === "type") {
      if (!typedName.trim()) return;
      // Render text to canvas and extract PNG
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = 500;
      offscreenCanvas.height = 160;
      const ctx = offscreenCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 500, 160);
        ctx.font = `italic 42px ${selectedFont === "cursive" ? "Brush Script MT, cursive" : selectedFont === "serif" ? "Georgia, serif" : "Segoe Script, cursive"}`;
        ctx.fillStyle = penColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(typedName, 250, 80);
        onSaveSignature(offscreenCanvas.toDataURL("image/png"));
        onClose();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSaveSignature(event.target.result as string);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <PenTool className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-zinc-100">Adobe e-Signature Studio</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-zinc-950/50 p-1">
          <button
            onClick={() => setTab("draw")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition ${
              tab === "draw"
                ? "bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Draw Signature</span>
          </button>
          <button
            onClick={() => setTab("type")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition ${
              tab === "type"
                ? "bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Type Signature</span>
          </button>
          <button
            onClick={() => setTab("upload")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition ${
              tab === "upload"
                ? "bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 flex-1 flex flex-col items-center justify-center">
          {tab === "draw" && (
            <div className="w-full space-y-3">
              <div className="relative w-full h-44 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={176}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full"
                />
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="absolute bottom-2 right-2 px-2.5 py-1 text-[11px] bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-md border border-white/10 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Color picker */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Ink Color:</span>
                <div className="flex items-center space-x-2">
                  {["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#ef4444", "#fafafa"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setPenColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        penColor === color ? "scale-110 border-white" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "type" && (
            <div className="w-full space-y-4">
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Type your full name..."
                className="w-full px-4 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-sm"
              />

              {/* Font Style Selection Preview */}
              <div className="space-y-2">
                {[
                  { id: "cursive", name: "Modern Brush", fontStyle: "Brush Script MT, cursive" },
                  { id: "script", name: "Elegant Script", fontStyle: "Segoe Script, cursive" },
                  { id: "serif", name: "Executive Serif", fontStyle: "Georgia, serif" },
                ].map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFont(f.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      selectedFont === f.id
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <span
                      className="text-lg text-zinc-200"
                      style={{ fontFamily: f.fontStyle, color: penColor }}
                    >
                      {typedName || "Saikat Sharma"}
                    </span>
                    <span className="text-[10px] uppercase text-zinc-500 font-semibold">
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "upload" && (
            <div className="w-full text-center py-6 border-2 border-dashed border-white/10 rounded-xl p-4">
              <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                <ImageIcon className="w-8 h-8 text-violet-400" />
                <span className="text-xs font-semibold text-zinc-300">Upload signature PNG / JPG</span>
                <span className="text-[10px] text-zinc-500">Transparent PNG recommended</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-white/10 bg-zinc-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 flex items-center space-x-1.5 transition"
          >
            <Check className="w-4 h-4" />
            <span>Apply Signature</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
