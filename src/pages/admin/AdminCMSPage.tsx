import React, { useState } from 'react';
import { 
  Palette, ArrowUp, ArrowDown, Eye, EyeOff, 
  Edit3, FileText, Check, Plus, History, RotateCcw 
} from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';
import { useToast } from '../../contexts/ToastContext';
import { HomepageSection, CMSPage } from '../../lib/types';
import { formatDate } from '../../lib/utils';

export const AdminCMSPage: React.FC = () => {
  const { showToast } = useToast();
  const [sections, setSections] = useState<HomepageSection[]>(() => mockDb.getHomepageSections());
  const [pages, setPages] = useState<CMSPage[]>(() => mockDb.getCMSPages());

  const [activeTab, setActiveTab] = useState<'homepage' | 'pages'>('homepage');

  // Selected section to edit
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionSubtitle, setSectionSubtitle] = useState('');

  // Selected page to edit
  const [selectedPage, setSelectedPage] = useState<CMSPage>(pages[0]);
  const [pageTitle, setPageTitle] = useState(pages[0]?.title || '');
  const [pageContent, setPageContent] = useState(pages[0]?.content_html || '');

  // Move section UP
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...sections];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    copy.forEach((s, idx) => { s.display_order = idx + 1; });
    mockDb.updateHomepageSections(copy);
    setSections([...copy]);
    showToast('Section reordered successfully!', 'success');
  };

  // Move section DOWN
  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const copy = [...sections];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    copy.forEach((s, idx) => { s.display_order = idx + 1; });
    mockDb.updateHomepageSections(copy);
    setSections([...copy]);
    showToast('Section reordered successfully!', 'success');
  };

  // Toggle section active
  const handleToggleActive = (index: number) => {
    const copy = [...sections];
    copy[index].is_active = !copy[index].is_active;
    mockDb.updateHomepageSections(copy);
    setSections([...copy]);
    showToast(`Section ${copy[index].is_active ? 'Enabled' : 'Hidden'}`, 'info');
  };

  const handleOpenEditSection = (s: HomepageSection) => {
    setEditingSection(s);
    setSectionTitle(s.title);
    setSectionSubtitle(s.subtitle || '');
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    const copy = sections.map((s) => {
      if (s.id === editingSection.id) {
        return { ...s, title: sectionTitle, subtitle: sectionSubtitle };
      }
      return s;
    });
    mockDb.updateHomepageSections(copy);
    setSections(copy);
    setEditingSection(null);
    showToast('Homepage section updated!', 'success');
  };

  const handleSelectPage = (p: CMSPage) => {
    setSelectedPage(p);
    setPageTitle(p.title);
    setPageContent(p.content_html);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CMSPage = {
      ...selectedPage,
      title: pageTitle,
      content_html: pageContent,
      revisions: [
        ...(selectedPage.revisions || []),
        {
          id: 'rev-' + Date.now(),
          page_id: selectedPage.id,
          title: pageTitle,
          content_html: pageContent,
          created_at: new Date().toISOString(),
          created_by: 'Super Admin',
        }
      ]
    };
    mockDb.saveCMSPage(updated);
    setPages(mockDb.getCMSPages());
    setSelectedPage(updated);
    showToast(`Page "${updated.title}" saved & revision logged!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            Content Management System
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Visual Page Builder & Content Editor
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify storefront sections, announcement campaigns, and care guides without redeploying code.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('homepage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'homepage'
                ? 'bg-amber-500 text-ocean-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Homepage Section Ordering
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pages'
                ? 'bg-amber-500 text-ocean-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Custom Policy & Care Pages
          </button>
        </div>
      </div>

      {/* HOMEPAGE BUILDER TAB */}
      {activeTab === 'homepage' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Homepage Content Blocks (Drag / Move Sequence)
              </h2>
              <span className="text-xs text-slate-400">
                {sections.filter(s => s.is_active).length} of {sections.length} active
              </span>
            </div>

            <div className="space-y-3">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    section.is_active
                      ? 'bg-slate-900 border-slate-700'
                      : 'bg-slate-900/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs sm:text-sm">{section.title}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {section.type}
                        </span>
                      </div>
                      {section.subtitle && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sections.length - 1}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(index)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        section.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}
                      title={section.is_active ? 'Hide Section' : 'Show Section'}
                    >
                      {section.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit Section */}
                    <button
                      onClick={() => handleOpenEditSection(section)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400"
                      title="Edit Titles"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Section Dialog */}
          {editingSection && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/80" onClick={() => setEditingSection(null)} />
              <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full z-10 space-y-4">
                <h3 className="font-bold text-white text-base">Edit Section Header</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle</label>
                  <textarea
                    rows={2}
                    value={sectionSubtitle}
                    onChange={(e) => setSectionSubtitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-4 py-2 border border-slate-700 rounded-xl text-xs text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSection}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-ocean-950 font-bold text-xs rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUSTOM PAGES TAB */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pages List Left */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Informational Pages
              </h3>
              <div className="space-y-1.5">
                {pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPage(p)}
                    className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-between ${
                      selectedPage?.id === p.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">{p.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">/{p.slug}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Page Editor Right */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSavePage} className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <h3 className="font-bold text-white text-base">Editing: {selectedPage.title}</h3>
                <span className="text-slate-400 text-[11px]">
                  Slug: <strong className="font-mono text-aqua-400">/page/{selectedPage.slug}</strong>
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Page Headline Title</label>
                <input
                  type="text"
                  required
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Page HTML / Rich Content</label>
                <textarea
                  rows={14}
                  required
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-mono text-xs text-slate-200 leading-relaxed outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedPage.revisions?.length || 1} revision points stored</span>
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-ocean-950 font-bold text-xs rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Page & Deploy Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
