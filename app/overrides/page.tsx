'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Loader2, CheckCircle, Plus, Copy,
  Settings, MonitorPlay, Eye, Save, Key, ChevronRight, ChevronDown, FileText
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  status: string;
  keyHash?: string;
}

interface Processor {
  id: string;
  slug: string;
  displayName: string;
  systemPrompt: string;
  description: string;
  type: 'PREBUILT' | 'RECIPE';
}

interface Override {
  id: string;
  processorId: string;
  apiKeyId: string;
  systemPrompt: string | null;
  temperature: number | null;
  processorConfig: string | null;  // JSON: { extraVariables: { key: val } }
}

export default function OverridesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground flex justify-center items-center"><Loader2 className="w-6 h-6 animate-spin mr-2"/> Đang tải cấu hình Admin...</div>}>
      <OverridesContent />
    </Suspense>
  );
}

function OverridesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [processors, setProcessors] = useState<Processor[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);
  
  // Selection State
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  // New Client Modal/State
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [createdRawKey, setCreatedRawKey] = useState<{ name: string; key: string } | null>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const res = await fetch('/api/internal/overrides');
      const data = await res.json();
      if (data.success) {
        setApiKeys(data.apiKeys);
        setProcessors(data.processors);
        setOverrides(data.overrides);
        
        // Auto-select first client if none selected
        if (!selectedClientId && data.apiKeys.length > 0) {
          const defaultId = searchParams?.get('client') || data.apiKeys[0].id;
          setSelectedClientId(defaultId);
        }
      }
    } catch (e) {
      console.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter overrides for current client
  const clientOverrides = useMemo(() => {
    return overrides.filter(o => o.apiKeyId === selectedClientId);
  }, [overrides, selectedClientId]);

  // Handle Client Creation
  const handleCreateClient = async () => {
    if (!newClientName) return;
    try {
      const res = await fetch('/api/internal/apikeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClientName }),
      });
      const data = await res.json();
      if (data.success) {
        setApiKeys([...apiKeys, data.apiKey]);
        setCreatedRawKey({ name: data.apiKey.name, key: data.rawKey });
        setShowAddClient(false);
        setNewClientName('');
        setSelectedClientId(data.apiKey.id);
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert('Error creating API Key');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground font-medium">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2 flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          Prompt Overrides
        </h1>
        <p className="text-muted-foreground text-base max-w-3xl">
          Tùy chỉnh và cấu hình Prompt riêng lẻ cho từng Client. Mỗi thay đổi sẽ lập tức áp dụng cho Client đó mà không chạm tới cấu hình chung (Global Prebuilt).
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* L E F T   S I D E B A R   ( C L I E N T S ) */}
        <div className="w-full md:w-80 shrink-0 space-y-4">
          <div className="modern-card overflow-hidden flex flex-col h-[70vh] min-h-[500px]">
            {/* Header Sidebar */}
            <div className="bg-muted p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2 text-foreground">
                <Key className="w-4 h-4 text-primary" />
                Clients ({apiKeys.length})
              </h2>
              <button 
                onClick={() => setShowAddClient(!showAddClient)}
                className="p-1.5 hover:bg-primary/10 text-primary rounded-md transition-colors shadow-sm bg-background border border-border"
                title="Thêm Client Mới"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* List Clients */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {apiKeys.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Chưa có Client nào. Vui lòng bấm dấu + để tạo mới.
                </div>
              ) : (
                apiKeys.map(key => {
                  const isSelected = key.id === selectedClientId;
                  return (
                    <button
                      key={key.id}
                      onClick={() => {
                        setSelectedClientId(key.id);
                        router.replace(`/overrides?client=${key.id}`, { scroll: false });
                        setCreatedRawKey(null); // Clear new key alert if they switch
                      }}
                      className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-all ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="font-semibold text-sm truncate">{key.name}</span>
                        <span className={`text-[10px] mt-0.5 truncate uppercase tracking-widest ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {key.id.split('-')[0]}••••
                        </span>
                      </div>
                      {isSelected && <ChevronRight className="w-4 h-4 shrink-0 opacity-70" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* R I G H T   C O N T E N T   ( P R O C E S S O R S ) */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Add Client Inline Form */}
          {showAddClient && (
            <div className="modern-card border-2 border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 animate-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-indigo-500" /> Cấp phát API Key mới
              </h3>
              <div className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1 w-full">
                  <label className="text-sm font-medium text-foreground mb-1 block">Tên Ứng dụng / Client</label>
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Ví dụ: App Kế toán Công ty, Client B..."
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateClient()}
                    className="input-field" 
                  />
                </div>
                <button 
                  onClick={handleCreateClient}
                  disabled={!newClientName.trim()}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
                >
                  Tạo Access Key
                </button>
                <button 
                  onClick={() => setShowAddClient(false)}
                  className="px-4 py-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-sm text-muted-foreground transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Success Notification for new API Key */}
          {createdRawKey && (
            <div className="modern-card border-green-500 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div className="space-y-3 w-full">
                  <div>
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-100">Đã tạo API Key thành công: {createdRawKey.name}</h3>
                    <p className="text-green-700 dark:text-green-400 text-sm mt-1">Hãy copy Header Key này và gửi cho Client. Mã này đã được mã hóa 1 chiều trên DB và sẽ KHÔNG BAO GIỜ hiển thị lại.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-white dark:bg-black border border-green-200 dark:border-green-900 text-green-800 dark:text-green-300 px-4 py-2.5 rounded-lg flex-1 overflow-x-auto text-sm">
                      x-api-key: {createdRawKey.key}
                    </code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(createdRawKey.key);
                        alert('Đã copy!');
                      }}
                      className="p-2.5 bg-green-200/50 hover:bg-green-300/50 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-lg transition-colors shrink-0"
                      title="Copy Header Key"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processors List */}
          {selectedClientId && apiKeys.length > 0 && (() => {
            const prebuiltProcessors = processors.filter(p => p.type === 'PREBUILT');
            const recipeProcessors   = processors.filter(p => p.type === 'RECIPE');
            return (
              <div className="space-y-8">
                {/* ── PREBUILT PROCESSORS ─────────────────────────────── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <MonitorPlay className="w-5 h-5 text-indigo-500" />
                      <h2 className="text-xl font-bold">
                        Prebuilt Processors
                        <span className="text-muted-foreground font-normal ml-2">
                          ({apiKeys.find(k => k.id === selectedClientId)?.name})
                        </span>
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {prebuiltProcessors.map(processor => {
                      const currentOverride = clientOverrides.find(o => o.processorId === processor.id);
                      return (
                        <ProcessorCard
                          key={processor.id}
                          processor={processor}
                          apiKeyId={selectedClientId}
                          initialOverride={currentOverride}
                          onUpdated={() => fetchData()}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* ── RECIPE ENDPOINTS ─────────────────────────────────── */}
                {recipeProcessors.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-3">
                        <MonitorPlay className="w-5 h-5 text-orange-500" />
                        <h2 className="text-xl font-bold">
                          Recipe Endpoints
                          <span className="text-xs font-normal ml-2 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-full border border-orange-200 dark:border-orange-800">
                            Client-level overrides
                          </span>
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ghi đè các Recipe Endpoint (việc phải nối thêm Business Rules hoặc inject variables cho từng client).
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {recipeProcessors.map(processor => {
                        const currentOverride = clientOverrides.find(o => o.processorId === processor.id);
                        return (
                          <ProcessorCard
                            key={processor.id}
                            processor={processor}
                            apiKeyId={selectedClientId}
                            initialOverride={currentOverride}
                            onUpdated={() => fetchData()}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          
          {!selectedClientId && apiKeys.length > 0 && (
            <div className="flex flex-col items-center justify-center p-12 modern-card border-dashed">
              <Key className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">Vui lòng chọn một Client ở menu bên trái để bắt đầu cấu hình.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Sub-Component cho từng Processor (để cô lập state khi edit) ───

function ProcessorCard({ 
  processor, 
  apiKeyId, 
  initialOverride,
  onUpdated 
}: { 
  processor: Processor, 
  apiKeyId: string, 
  initialOverride?: Override,
  onUpdated: () => void 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isActive, setIsActive] = useState(!!initialOverride); // toggle state
  const [systemPrompt, setSystemPrompt] = useState(initialOverride?.systemPrompt ?? processor.systemPrompt);
  const [saving, setSaving] = useState(false);

  // Sync state if client prop changes
  useEffect(() => {
    setIsActive(!!initialOverride);
    setSystemPrompt(initialOverride?.systemPrompt ?? processor.systemPrompt);
    setIsEditing(false);
  }, [initialOverride, processor, apiKeyId]);

  const handleToggle = async (checked: boolean) => {
    setIsActive(checked);
    // Nếu gạt tắt, lập tức lưu lên server (xóa override)
    if (!checked && initialOverride) {
      await saveOverride(false, systemPrompt);
    }
    // Nếu bật lên, thì switch editMode (không tự save liền trừ khi ấn nút save)
    if (checked) {
      setIsEditing(true);
    }
  };

  const saveOverride = async (activeState: boolean, currentPrompt: string) => {
    setSaving(true);
    try {
      await fetch('/api/internal/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKeyId,
          processorId: processor.id,
          isActive: activeState,
          systemPrompt: currentPrompt,
        })
      });
      onUpdated();
    } catch {
      alert("Lỗi khi lưu override");
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <div className={`modern-card flex flex-col border transition-colors ${isActive ? 'bg-indigo-50/10 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-900/50 ring-1 ring-indigo-500/20 shadow-md' : 'border-border'}`}>
      
      {/* Header Bar */}
      <div className="p-4 flex items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={`text-base font-bold ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-foreground'}`}>
              {processor.displayName}
            </h3>
            <span className="text-[11px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border">
              {processor.slug}
            </span>
            {isActive && <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 px-2 py-0.5 rounded-sm ring-1 ring-inset ring-green-600/20">Custom Active</span>}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-none leading-snug">{processor.description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-1 sm:mt-0">
          <label className="flex items-center cursor-pointer relative group">
            <input 
              type="checkbox" 
              className="peer sr-only" 
              checked={isActive} 
              onChange={e => handleToggle(e.target.checked)}
            />
            <div className={`
              h-6 w-11 rounded-full ring-0 transition-all duration-300 ease-in-out
              ${isActive ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
              after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all after:shadow-sm
              peer-checked:after:translate-x-full
              peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2
            `}></div>
          </label>
          
          {(isActive || isEditing) && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-lg transition-colors border ${isEditing ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' : 'bg-transparent border-transparent text-slate-400 hover:text-foreground hover:bg-muted'}`}
              title="Chỉnh sửa chi tiết"
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${isEditing ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body (Collapse) */}
      {(isActive || isEditing) && isEditing && (
        <div className="px-4 pb-4 border-t border-border bg-card/50 rounded-b-xl animate-in fade-in fill-mode-forwards">
          <div className="pt-4">
             <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" /> System Prompt (Override)
                </label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                       if (confirm('Tải lại Prompt gốc tự động xoá những thay đổi của bạn hiện tại. Bạn chắc chứ?')) {
                         setSystemPrompt(processor.systemPrompt);
                       }
                    }}
                    className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:underline px-2 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 py-1 rounded-md border border-amber-200 dark:border-amber-900"
                  >
                    <Eye className="w-3.5 h-3.5" /> Khôi phục Mặc định (Global)
                  </button>
                </div>
             </div>
             
             <textarea 
               value={systemPrompt}
               onChange={e => setSystemPrompt(e.target.value)}
               className="w-full bg-background border border-border rounded-lg p-3 font-mono text-xs sm:text-sm leading-relaxed min-h-[160px] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-colors shadow-inner outline-none"
               placeholder="Điền system prompt ghi đè vào đây..."
             />

             <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-border/50">
               <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => saveOverride(true, systemPrompt)}
                  disabled={saving}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 shadow-sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu Ghi đè
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
