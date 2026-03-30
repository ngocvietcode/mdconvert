'use client';

// app/fact-check/page.tsx
// Fact-check: Đối chiếu tài liệu với dữ liệu tham chiếu (Reference Data) và quy tắc kiểm tra (Business Rules)

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, AlertCircle, X, AlignLeft, ShieldCheck } from 'lucide-react';

const PROMPT_EXAMPLES = [
  'Kiểm tra xem số tiền thanh toán trong hoá đơn có khớp chính xác với PO không.',
  'Xác minh các điều khoản trong hợp đồng này có vi phạm chính sách chuẩn không.',
  'Kiểm tra ngày giao hàng có nằm trong khoảng 30 ngày kể từ ngày xuất hoá đơn không.',
  'Đối chiếu thông tin CMND trong biên bản với hồ sơ khách hàng xem có sai lệch gì không.',
  'Đảm bảo rằng tài liệu báo cáo tài chính đính kèm có số liệu thống nhất với dữ liệu hệ thống.',
];

export default function FactCheckPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputMode, setInputMode]   = useState<'file' | 'text'>('file');
  const [files, setFiles]           = useState<File[]>([]);
  const [inputText, setInputText]   = useState('');
  
  const [referenceText, setReferenceText] = useState('');
  const [userPrompt, setPrompt]           = useState('');
  
  const [dragging, setDragging]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  function validateAndAddFiles(newFiles: File[]) {
    const valid: File[] = [];
    let errorMsg = '';

    for (const f of newFiles) {
      const ext = f.name.split('.').pop()?.toLowerCase();
      if (!ext || !['docx', 'pdf', 'txt', 'md'].includes(ext)) {
        errorMsg = 'Hỗ trợ file .docx, .pdf, .txt, .md.';
        continue;
      }
      if (f.size > 20 * 1024 * 1024) {
        errorMsg = `File ${f.name} vượt quá 20MB.`;
        continue;
      }
      valid.push(f);
    }
    
    if (errorMsg) setError(errorMsg);
    else setError('');

    setFiles(prev => {
      const combined = [...prev, ...valid];
      const unique = combined.filter((f, i, a) => a.findIndex(x => x.name === f.name) === i);
      if (unique.length > 1) {
        setError('Hiện tại chỉ hỗ trợ kiểm tra 1 file mỗi lần.');
        return unique.slice(0, 1);
      }
      return unique;
    });
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length <= 1) setError('');
  }

  // Submit through pipeline API
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inputMode === 'file' && files.length === 0) { setError('Vui lòng chọn 1 tài liệu cần đối chiếu.'); return; }
    if (inputMode === 'text' && !inputText.trim()) { setError('Vui lòng nhập nội dung văn bản.'); return; }
    if (!referenceText.trim()) { setError('Vui lòng cung cấp Dữ liệu tham chiếu (Reference Data).'); return; }
    if (!userPrompt.trim()) { setError('Vui lòng thiết lập Quy tắc Kiểm tra (Prompt).'); return; }

    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();

      // Sử dụng prebuilt-fact-check pipeline
      const pipelineConfig = [
        { 
          processor: 'prebuilt-fact-check', 
          variables: { 
            reference_text: referenceText.trim(),
            check_prompt: userPrompt.trim()
          } 
        },
      ];

      if (inputMode === 'file') {
        fd.append('file', files[0]);
      } else {
        // Text input 
        const blob = new Blob([inputText.trim()], { type: 'text/plain' });
        const textFile = new File([blob], 'input.txt', { type: 'text/plain' });
        fd.append('file', textFile);
      }

      fd.append('pipeline', JSON.stringify(pipelineConfig));
      fd.append('output_format', 'json');

      const res = await fetch('/api/documents/process', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail ?? data.title ?? 'Lỗi server khi tạo task.');
        setSubmitting(false);
        return;
      }

      const opId = data.name.replace('operations/', '');
      router.push(`/operations/${opId}`);
    } catch {
      setError('Lỗi kết nối server.');
      setSubmitting(false);
    }
  }

  return (
    <main className="py-16">
      <div className="text-center mb-12 max-w-2xl mx-auto px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 text-sm font-bold text-emerald-600 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          Kiểm chứng Dữ liệu (Fact Check)
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
          Đối chiếu & Xác minh
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed font-medium">
          Tự động đánh giá nội dung tài liệu với cơ sở dữ liệu hệ thống (JSON/Text) bằng các bộ quy tắc nghiệp vụ nghiêm ngặt.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 px-4 modern-card p-6 md:p-10 relative z-10 transition-colors">

        {/* 1. Dữ liệu cần kiểm tra */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-bold text-foreground">
              1. Tài liệu cần kiểm chứng
            </label>
            <div className="flex bg-muted p-1 rounded-xl w-fit border border-border">
              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  inputMode === 'file' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  inputMode === 'text' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" /> Dán Text
              </button>
            </div>
          </div>
          
          {inputMode === 'file' ? (
            <div
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`dropzone ${dragging ? 'border-primary bg-primary/10' : ''} p-8 text-center`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.pdf,.txt,.md"
                className="hidden"
                onChange={e => {
                  if (e.target.files) validateAndAddFiles(Array.from(e.target.files));
                }}
              />
              <Upload className="w-10 h-10 mx-auto mb-3 text-primary opacity-80" />
              <p className="font-bold text-foreground mb-1">Kéo thả file vào đây</p>
              <p className="text-xs font-medium text-muted-foreground">PDF, DOCX, TXT. Chỉ kiểm tra 1 file duy nhất.</p>
            </div>
          ) : (
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              rows={5}
              placeholder="Dán nội dung văn bản gốc cần kiểm tra vào đây..."
              className="input-field font-mono text-sm"
            />
          )}

          {/* File list */}
          {inputMode === 'file' && files.length > 0 && (
             <div className="mt-3 grid gap-2">
               {files.map((f, i) => (
                 <div key={i} className="flex items-center justify-between bg-card border border-border rounded-xl p-3 shadow-sm group">
                   <div className="flex items-center gap-3 overflow-hidden">
                     <div className="shrink-0 p-1.5 rounded-md bg-muted border border-border/50">
                       <FileText className="w-5 h-5 text-primary" />
                     </div>
                     <div className="min-w-0">
                       <p className="font-bold text-sm text-foreground truncate">{f.name}</p>
                       <p className="text-[11px] font-semibold text-muted-foreground">{(f.size / 1024 / 1024).toFixed(1)} MB</p>
                     </div>
                   </div>
                   <button
                     type="button"
                     onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                     className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
               ))}
             </div>
          )}
        </div>

        {/* 2. Dữ liệu tham chiếu */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-foreground">
            2. Dữ liệu đối chiếu (Reference Data)
          </label>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded border border-border">
            Hệ thống sẽ dựa vào dữ liệu dưới đây để kiểm tra tính chính xác của tài liệu trên. Có thể sử dụng JSON (như Hồ sơ khách hàng, Đơn mua hàng PO) hoặc văn bản tham chiếu (như Quy chế công ty).
          </div>
          <textarea
            value={referenceText}
            onChange={e => setReferenceText(e.target.value)}
            rows={5}
            placeholder='Ví dụ: { "po_number": "PO-123", "total_amount": 5000000, "currency": "VND" }...'
            className="input-field font-mono text-sm"
          />
        </div>

        {/* 3. Business Rules */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-foreground">
            3. Quy tắc Kiểm chứng (Business Rules)
          </label>
          <textarea
            value={userPrompt}
            onChange={e => setPrompt(e.target.value)}
            rows={4}
            placeholder="Ví dụ: Kiểm tra đảm bảo Tổng tiền (Total Amount) trong hoá đơn khớp chính xác với Dữ liệu đối chiếu..."
            className="input-field"
          />
          <div className="mt-2">
            <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">Mẫu phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              {PROMPT_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(ex)}
                  className="text-[11px] px-2.5 py-1 bg-muted text-foreground font-medium rounded-full hover:bg-primary/20 hover:text-primary transition-colors border border-border"
                >
                  {ex.length > 50 ? ex.slice(0, 48) + '…' : ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting || (inputMode === 'file' && files.length === 0) || (inputMode === 'text' && !inputText.trim()) || !referenceText.trim() || !userPrompt.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white modern-button text-lg py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {submitting ? 'Đang xác minh & Kiểm chứng...' : 'Thực hiện Fact check'}
          </button>
        </div>
      </form>
    </main>
  );
}
