import { useState, useEffect, useMemo } from 'react';
import { Search, Copy, Check, Package, Layers, CheckSquare, Square, Trash2, AlertCircle } from 'lucide-react';
import { type MatrixData, type Artifact } from './types';
import { SkeletonLoader } from './components/SkeletonLoader';
import { EmptyState } from './components/EmptyState';
import { TopBar } from './components/TopBar';

const DATA_URL = "https://vluoppbaehfmhkebyygv.supabase.co/storage/v1/object/sign/docs/Dependencies.json?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84OTUzOTBiNi0zZDUxLTQ4MGMtOWJjNC03NzE4ZmNhOWVkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb2NzL0RlcGVuZGVuY2llcy5qc29uIiwiaWF0IjoxNzY0NzkwMzQ2LCJleHAiOjE3OTYzMjYzNDZ9.u226ZXmC8peAJvpuGf6V98DPFWim3EYwPwZkvykv2qY";

function App() {
  const [data, setData] = useState<MatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const [previewMode, setPreviewMode] = useState<'toml' | 'gradle'>('toml');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dependency data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleCategory = (artifacts: Artifact[]) => {
    const newSelection = new Set(selectedIds);
    const allSelected = artifacts.every(a => newSelection.has(a.id));

    if (allSelected) {
      artifacts.forEach(a => newSelection.delete(a.id));
    } else {
      artifacts.forEach(a => newSelection.add(a.id));
    }
    setSelectedIds(newSelection);
  };

  // ... (rest of the file)

  // In the render loop:
  // onClick={() => toggleCategory(artifacts)}


  const clearAll = () => {
    setSelectedIds(new Set());
  };

  const filteredArtifacts = useMemo(() => {
    if (!data) return [];
    return data.artifacts.filter(art =>
      art.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const groupedArtifacts = useMemo(() => {
    if (!data) return {};
    const groups: Record<string, Artifact[]> = {};
    data.categories.forEach(cat => {
      groups[cat.id] = filteredArtifacts.filter(a => a.category === cat.id);
    });
    return groups;
  }, [data, filteredArtifacts]);

  const generatedOutput = useMemo(() => {
    if (!data || selectedIds.size === 0) return '';

    const selectedArtifacts = data.artifacts.filter(a => selectedIds.has(a.id));

    // Separate plugins and libraries
    const plugins = selectedArtifacts.filter(a => a.type === 'plugin');
    const libraries = selectedArtifacts.filter(a => a.type === 'library');

    if (previewMode === 'gradle') {
      // Gradle Kotlin DSL Output
      let output = '// build.gradle.kts\n\n';

      if (plugins.length > 0) {
        output += 'plugins {\n';
        plugins.forEach(p => {
          const accessor = p.id.replace(/-/g, '.');
          output += `    alias(libs.plugins.${accessor})\n`;
        });
        output += '}\n\n';
      }

      output += 'dependencies {\n';

      // Group by category for comments
      const artifactsByCategory: Record<string, Artifact[]> = {};
      libraries.forEach(lib => {
        if (!artifactsByCategory[lib.category]) {
          artifactsByCategory[lib.category] = [];
        }
        artifactsByCategory[lib.category].push(lib);
      });

      // Sort categories based on original order if possible, or just keys
      Object.keys(artifactsByCategory).forEach(catId => {
        const categoryName = data.categories.find(c => c.id === catId)?.name || catId;
        output += `    // ${categoryName}\n`;

        artifactsByCategory[catId].forEach(art => {
          const accessor = art.id.replace(/-/g, '.');
          if (art.bomRef) {
            // It's part of a BOM, usually we implement the library without version if using platform, 
            // BUT standard catalog usage often still defines the library version ref OR relies on the BOM.
            // If we assume the BOM is also selected and applied as platform:
            if (selectedIds.has(art.bomRef)) {
              output += `    implementation(libs.${accessor})\n`;
            } else {
              // BOM not selected, treat as normal? Or warn? 
              // Let's assume standard catalog usage: implementation(libs.xxx)
              output += `    implementation(libs.${accessor})\n`;
            }
          } else if (art.id.includes('bom')) {
            output += `    implementation(platform(libs.${accessor}))\n`;
          } else {
            output += `    implementation(libs.${accessor})\n`;
          }
        });
        output += '\n';
      });

      output += '}\n';
      return output;
    } else {
      // TOML Output
      const versions = new Map<string, string>();
      const libsEntries: string[] = [];
      const pluginEntries: string[] = [];

      // Process Plugins
      plugins.forEach(p => {
        const versionKey = p.id;
        if (!versions.has(versionKey)) {
          versions.set(versionKey, p.version);
        }
        pluginEntries.push(`${p.id} = { id = "${p.coordinates.group}", version.ref = "${versionKey}" }`);
      });

      // Process Libraries
      libraries.forEach(art => {
        const versionKey = art.id;

        // If it has a BOM ref, we might NOT need a version ref if we are strict about BOM usage,
        // BUT in Version Catalogs, you usually define the library with module and version.ref, 
        // OR module and no version if using BOM in the dependencies block (but catalog still needs version usually unless using strictly BOM-only catalog features which are rare).
        // Actually, standard practice: define version for everything in catalog. BOM usage in Gradle handles the resolution.
        // EXCEPT if the user wants to omit version in catalog for BOM managed deps? No, catalog needs versions to be valid usually.
        // Let's stick to: Always generate version ref, unless it's a "virtual" artifact from a BOM? 
        // The prompt says: "If an library has a bomRef, then the other libraries of that bom do not need version".
        // This likely implies: In the catalog, we define the library WITHOUT version? 
        // `alias = { group = "...", name = "..." }` (no version).

        if (art.bomRef && selectedIds.has(art.bomRef)) {
          // It belongs to a selected BOM. Omit version.ref.
          libsEntries.push(`${art.id} = { group = "${art.coordinates.group}", name = "${art.coordinates.artifact}" }`);
        } else {
          if (!versions.has(versionKey)) {
            versions.set(versionKey, art.version);
          }
          libsEntries.push(`${art.id} = { group = "${art.coordinates.group}", name = "${art.coordinates.artifact}", version.ref = "${versionKey}" }`);
        }
      });

      let output = '[versions]\n';
      versions.forEach((v, k) => {
        output += `${k} = "${v}"\n`;
      });

      output += '\n[libraries]\n';
      libsEntries.forEach(lib => {
        output += `${lib}\n`;
      });

      if (pluginEntries.length > 0) {
        output += '\n[plugins]\n';
        pluginEntries.forEach(p => {
          output += `${p}\n`;
        });
      }

      return output;
    }
  }, [data, selectedIds, previewMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = useMemo(() => {
    if (!generatedOutput) return '';

    // Helper to escape HTML
    const escape = (str: string) => str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (previewMode === 'toml') {
      return generatedOutput.split('\n').map(line => {
        const escapedLine = escape(line);

        // 1. Sections
        if (escapedLine.trim().startsWith('[')) {
          return escapedLine.replace(/\[(.*?)\]/, '<span class="text-white font-bold">[$1]</span>');
        }

        // 2. Key = Value
        const keyMatch = escapedLine.match(/^([\w\-\.]+)(\s*=\s*)/);
        if (keyMatch) {
          const key = keyMatch[1];
          const separator = keyMatch[2];
          const rest = escapedLine.substring(keyMatch[0].length);

          const highlightedKey = `<span class="text-[#A5B3CE]">${key}</span>`;
          const highlightedRest = rest.replace(/"(.*?)"/g, '<span class="text-[#C3E88D]">&quot;$1&quot;</span>');

          return highlightedKey + separator + highlightedRest;
        }

        return escapedLine;
      }).join('\n');
    } else {
      // Gradle Highlighting
      return generatedOutput.split('\n').map(line => {
        let processed = escape(line);

        if (processed.trim().startsWith('//')) {
          return `<span class="text-secondary/50">${processed}</span>`;
        }

        processed = processed
          .replace(/(plugins|dependencies)/g, '<span class="text-[#C792EA]">$1</span>')
          .replace(/(implementation|alias|platform)/g, '<span class="text-[#82AAFF]">$1</span>')
          .replace(/(libs\.[\w\.]+)/g, '<span class="text-[#C3E88D]">$1</span>');

        return processed;
      }).join('\n');
    }
  }, [generatedOutput, previewMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
        <p className="text-secondary text-center max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-white text-black rounded font-medium hover:bg-white/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background text-white flex flex-col overflow-hidden font-sans">
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Selector */}
        <div className="w-1/2 flex flex-col border-r border-white/10">
          {/* Search Bar & Actions */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-white/10 p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
              <input
                type="text"
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white pl-10 pr-4 py-2 outline-none placeholder-secondary/50 rounded border border-white/5 focus:border-white/20 transition-colors"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={clearAll}
                disabled={selectedIds.size === 0}
                className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${selectedIds.size === 0 ? 'text-secondary/30 cursor-not-allowed' : 'text-red-400 hover:bg-red-500/10'}`}
              >
                <Trash2 size={12} />
                Deselect All
              </button>
            </div>
          </div>

          {/* Artifact List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
            {data.categories.map(category => {
              const artifacts = groupedArtifacts[category.id];
              if (!artifacts || artifacts.length === 0) return null;

              const allSelected = artifacts.every(a => selectedIds.has(a.id));

              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                      <Layers size={12} />
                      {category.name}
                    </h3>
                    <button
                      onClick={() => toggleCategory(artifacts)}
                      className="text-secondary hover:text-white transition-colors"
                      title={allSelected ? "Deselect All" : "Select All"}
                    >
                      {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {artifacts.map(artifact => {
                      const isSelected = selectedIds.has(artifact.id);
                      return (
                        <div
                          key={artifact.id}
                          onClick={() => toggleSelection(artifact.id)}
                          className={`
                            group flex items-center justify-between p-3 rounded cursor-pointer transition-all duration-200 border
                            ${isSelected
                              ? 'bg-white text-black border-white'
                              : 'bg-surface text-secondary border-transparent hover:border-white/20 hover:text-white'
                            }
                          `}
                        >
                          <div className="flex flex-col">
                            <span className={`font-medium ${isSelected ? 'text-black' : 'text-white'}`}>
                              {artifact.name}
                            </span>
                            <span className={`text-xs font-mono mt-0.5 ${isSelected ? 'text-black/60' : 'text-secondary/60'}`}>
                              {artifact.coordinates.group}:{artifact.coordinates.artifact}
                            </span>
                          </div>
                          {isSelected && <Check size={16} className="text-black" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="w-1/2 flex flex-col bg-[#0A0A0A] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-background shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-medium text-white flex items-center gap-2">
                <Package size={16} />
                Preview
              </h2>
              {/* Toggle */}
              <div className="flex bg-surface rounded p-0.5 border border-white/5">
                <button
                  onClick={() => setPreviewMode('toml')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${previewMode === 'toml' ? 'bg-white/10 text-white' : 'text-secondary hover:text-white'}`}
                >
                  TOML
                </button>
                <button
                  onClick={() => setPreviewMode('gradle')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${previewMode === 'gradle' ? 'bg-white/10 text-white' : 'text-secondary hover:text-white'}`}
                >
                  Gradle
                </button>
              </div>
            </div>
            <button
              onClick={handleCopy}
              disabled={selectedIds.size === 0}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors
                ${selectedIds.size === 0
                  ? 'text-secondary/30 cursor-not-allowed'
                  : 'text-white hover:bg-white/10 active:bg-white/20'
                }
              `}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex-1 p-6 overflow-auto font-mono text-sm leading-relaxed text-secondary/80">
            {selectedIds.size > 0 ? (
              <pre className="whitespace-pre-wrap">
                <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
              </pre>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
