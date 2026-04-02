import os
import re

file_path = "app/profiles/page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the start and end markers
start_marker = '<div className="space-y-2 mb-3">'
end_marker = 'Endpoint này xử lý Local hoặc qua các Local Processors nội bộ, không có External API Pipeline nào.\n                    </p>\n                  )}'

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker) + len(end_marker)
    
    # We will replace the whole chunk from start_idx to end_idx with our new combined block.
    
    new_chunk = """<div className="space-y-4 mb-4">
                    {(connectionsOverride || endpoint.connections || []).map((slug: string, idx: number, arr: string[]) => {
                      const cData = allConnectors.find((c: any) => c.slug === slug);
                      if (!cData) return null;
                      
                      const connId = cData.id;
                      const overrideValue = extOverridesState[connId];
                      const isOverridden = overrideValue !== null && overrideValue !== undefined;
                      
                      return (
                        <div key={`${connId}-${idx}`} className="flex flex-col">
                          {idx > 0 && (
                             <div className="flex justify-center -mt-2 mb-2">
                                <div className="w-px h-6 bg-border"></div>
                             </div>
                          )}
                          
                          <div className={`bg-background rounded-xl border ${connectionsOverride ? 'border-teal-300 dark:border-teal-800' : 'border-border opacity-90'} shadow-sm overflow-hidden`}>
                            <div className="bg-muted/50 px-4 py-3 border-b border-border flex flex-col xl:flex-row justify-between xl:items-center gap-3">
                              <div className="flex items-center gap-2 text-sm font-medium flex-wrap">
                                <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 cursor-grab" />
                                <span className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold shrink-0">
                                  {idx + 1}
                                </span>
                                <PlugZap className="w-4 h-4 text-violet-500 shrink-0" />
                                <span className="font-bold">{cData.name}</span>
                                <span className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground">{cData.slug}</span>
                                {isOverridden && (
                                   <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 px-2 py-0.5 rounded-sm ml-2">
                                     Custom Override
                                   </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => moveConnection(idx, -1)}
                                  disabled={idx === 0}
                                  className="p-1.5 rounded-lg border border-transparent hover:border-border hover:bg-muted disabled:opacity-30 text-muted-foreground transition-colors"
                                  title="Di chuyển lên"
                                >▲</button>
                                <button
                                  onClick={() => moveConnection(idx, 1)}
                                  disabled={idx === arr.length - 1}
                                  className="p-1.5 rounded-lg border border-transparent hover:border-border hover:bg-muted disabled:opacity-30 text-muted-foreground transition-colors"
                                  title="Di chuyển xuống"
                                >▼</button>
                                
                                <div className="w-px h-4 bg-border mx-1 hidden sm:block"></div>
                                
                                <button 
                                   onClick={() => {
                                     setExtOverridesState(prev => ({
                                       ...prev,
                                       [connId]: isOverridden ? null : cData.defaultPrompt
                                     }));
                                   }}
                                   className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shrink-0 ${
                                     isOverridden 
                                       ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/70' 
                                       : 'bg-background border border-border text-foreground hover:bg-muted font-medium'
                                   }`}
                                >
                                   {isOverridden ? 'Bỏ Custom Prompt' : 'Tùy chỉnh Prompt'}
                                </button>
                                
                                <button
                                  onClick={() => removeConnection(idx)}
                                  className="p-1.5 ml-1 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                                  title="Xoá Connector Này"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              {isOverridden ? (
                                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                  <label className="text-xs font-bold flex items-center gap-1 text-violet-600 dark:text-violet-400">
                                    Prompt Override Content <span className="font-normal text-muted-foreground mr-1">— Mapping output:</span> <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{`{{input_content}}`}</code>
                                  </label>
                                  <textarea
                                    value={overrideValue ?? ''}
                                    onChange={(e) => setExtOverridesState(prev => ({ ...prev, [connId]: e.target.value }))}
                                    className="w-full text-sm font-mono p-3 rounded-lg border border-violet-200 dark:border-violet-900 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 bg-violet-50/10 dark:bg-violet-950/20 outline-none leading-relaxed shadow-inner min-h-[140px]"
                                    placeholder="Nhập prompt override cho bước này..."
                                  />
                                  <div className="bg-muted p-3 mt-3 rounded-lg border border-border">
                                    <details>
                                      <summary className="text-xs font-semibold text-muted-foreground cursor-pointer outline-none w-fit hover:underline">Xem Default Prompt gốc (Tham khảo)</summary>
                                      <pre className="mt-3 text-[10px] text-muted-foreground whitespace-pre-wrap font-mono p-3 bg-background border border-border rounded opacity-70">
                                        {cData.defaultPrompt}
                                      </pre>
                                    </details>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Default Prompt (Quy định tại System)</label>
                                  <pre className="text-xs text-muted-foreground font-mono bg-muted/30 p-3 rounded-lg border whitespace-pre-wrap overflow-x-auto max-h-[150px] overflow-y-auto outline-none cursor-text">
                                    {cData.defaultPrompt}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {((connectionsOverride || endpoint.connections || []).length === 0) && (
                      <p className="text-sm text-muted-foreground p-6 text-center border rounded-xl bg-background border-dashed">
                        Endpoint này xử lý nội bộ, không có Workflow Connector Pipeline nào.
                      </p>
                    )}
                  </div>
                  
                  {/* Add connector dropdown */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <details className="group relative">
                      <summary className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-teal-700 bg-teal-100/50 hover:bg-teal-200/50 dark:text-teal-300 dark:bg-teal-900/30 dark:hover:bg-teal-800/40 rounded-lg cursor-pointer transition-colors list-none border border-teal-200/50 dark:border-teal-800/50">
                        <Plus className="w-4 h-4" /> Thêm Connector Để Chain
                      </summary>
                      <div className="absolute left-0 mt-2 z-10 w-72 max-h-60 overflow-y-auto bg-card border border-border rounded-xl shadow-lg p-2">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2 px-2">Chọn System Connector</p>
                        {allConnectors.map(conn => (
                          <button
                            key={conn.slug}
                            onClick={(e) => {
                              e.preventDefault();
                              addConnection(conn.slug);
                              e.currentTarget.closest('details')?.removeAttribute('open');
                            }}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                          >
                            <PlugZap className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                            <div className="flex flex-col truncate">
                              <span className="text-sm font-medium text-foreground truncate">{conn.name}</span>
                              <span className="font-mono text-[10px] text-muted-foreground truncate">{conn.slug}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </details>
                  </div></div>"""

    new_content = content[:start_idx] + new_chunk + content[end_idx:]
    
    # We still need to replace the next enclosing '</div>' if it was part of the original structure 
    # But actually, the script logic will just drop it. Wait, the original had two `<div className="space-y-x` blocks inside a div.
    # Let's just output it and see.
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Merged UI successfully.")
else:
    print("Could not find markers.")
