import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Palette, ArrowUp, ArrowDown, Eye, EyeOff, 
  Edit3, FileText, Check, Plus, History, RotateCcw,
  Sparkles, Megaphone, ExternalLink, Trash2, Save, X,
  Layers, Sliders, ShieldCheck, HeartHandshake
} from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';
import { useToast } from '../../contexts/ToastContext';
import { HomepageSection, CMSPage, StoreSettings } from '../../lib/types';
import { formatDate } from '../../lib/utils';

export const AdminCMSPage: React.FC = () => {
  const { showToast } = useToast();
  const [sections, setSections] = useState<HomepageSection[]>(() => mockDb.getHomepageSections());
  const [pages, setPages] = useState<CMSPage[]>(() => mockDb.getCMSPages());
  const [settings, setSettings] = useState<StoreSettings>(() => mockDb.getStoreSettings());

  const [activeTab, setActiveTab] = useState<'homepage' | 'announcement' | 'pages'>('homepage');

  // Selected section to edit
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionSubtitle, setSectionSubtitle] = useState('');
  const [sectionConfig, setSectionConfig] = useState<Record<string, any>>({});

  // Pages tab states
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(pages[0] || null);
  const [pageTitle, setPageTitle] = useState(pages[0]?.title || '');
  const [pageSlug, setPageSlug] = useState(pages[0]?.slug || '');
  const [pageContent, setPageContent] = useState(pages[0]?.content_html || '');
  const [pageMetaTitle, setPageMetaTitle] = useState(pages[0]?.meta_title || '');
  const [pageMetaDesc, setPageMetaDesc] = useState(pages[0]?.meta_description || '');
  const [isCreatingNewPage, setIsCreatingNewPage] = useState(false);

  // Announcement state
  const [announcementText, setAnnouncementText] = useState(settings.announcement_text);
  const [announcementCode, setAnnouncementCode] = useState(settings.announcement_code || '');
  const [announcementActive, setAnnouncementActive] = useState(settings.announcement_active);
  const [announcementLink, setAnnouncementLink] = useState(settings.announcement_link || '');

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
    showToast('Section moved up!', 'success');
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
    showToast('Section moved down!', 'success');
  };

  // Toggle section active
  const handleToggleActive = (index: number) => {
    const copy = [...sections];
    copy[index].is_active = !copy[index].is_active;
    mockDb.updateHomepageSections(copy);
    setSections([...copy]);
    showToast(`Section ${copy[index].is_active ? 'Enabled' : 'Hidden'} on storefront`, 'info');
  };

  const handleOpenEditSection = (s: HomepageSection) => {
    setEditingSection(s);
    setSectionTitle(s.title);
    setSectionSubtitle(s.subtitle || '');
    setSectionConfig({ ...(s.config || {}) });
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    const copy = sections.map((s) => {
      if (s.id === editingSection.id) {
        return { 
          ...s, 
          title: sectionTitle, 
          subtitle: sectionSubtitle,
          config: sectionConfig 
        };
      }
      return s;
    });
    mockDb.updateHomepageSections(copy);
    setSections(copy);
    setEditingSection(null);
    showToast('Homepage section & configuration saved!', 'success');
  };

  // Announcement Save
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = mockDb.updateStoreSettings({
      announcement_text: announcementText,
      announcement_code: announcementCode,
      announcement_active: announcementActive,
      announcement_link: announcementLink,
    });
    setSettings(updated);
    showToast('Promotional announcement bar updated!', 'success');
  };

  // Page Selection
  const handleSelectPage = (p: CMSPage) => {
    setIsCreatingNewPage(false);
    setSelectedPage(p);
    setPageTitle(p.title);
    setPageSlug(p.slug);
    setPageContent(p.content_html);
    setPageMetaTitle(p.meta_title);
    setPageMetaDesc(p.meta_description);
  };

  // Start New Page
  const handleStartNewPage = () => {
    setIsCreatingNewPage(true);
    setSelectedPage(null);
    setPageTitle('');
    setPageSlug('');
    setPageContent('<h2>Heading</h2>\n<p>Write your detailed policy or care guide content here...</p>');
    setPageMetaTitle('');
    setPageMetaDesc('');
  };

  // Save Page (Edit or New)
  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle.trim() || !pageSlug.trim()) {
      showToast('Page title and slug are required', 'error');
      return;
    }

    const cleanSlug = pageSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (isCreatingNewPage) {
      const newPage: CMSPage = {
        id: 'page-' + Date.now(),
        slug: cleanSlug,
        title: pageTitle,
        content_html: pageContent,
        meta_title: pageMetaTitle || `${pageTitle} | Betta Aquatics`,
        meta_description: pageMetaDesc || `Official guide: ${pageTitle}`,
        is_published: true,
        updated_at: new Date().toISOString(),
        revisions: [{
          id: 'rev-' + Date.now(),
          page_id: 'page-' + Date.now(),
          title: pageTitle,
          content_html: pageContent,
          created_at: new Date().toISOString(),
          created_by: 'Super Admin',
        }]
      };
      mockDb.saveCMSPage(newPage);
      const updatedList = mockDb.getCMSPages();
      setPages(updatedList);
      setSelectedPage(newPage);
      setIsCreatingNewPage(false);
      showToast(`Custom page "${newPage.title}" created successfully!`, 'success');
    } else if (selectedPage) {
      const updated: CMSPage = {
        ...selectedPage,
        slug: cleanSlug,
        title: pageTitle,
        content_html: pageContent,
        meta_title: pageMetaTitle,
        meta_description: pageMetaDesc,
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
      const updatedList = mockDb.getCMSPages();
      setPages(updatedList);
      setSelectedPage(updated);
      showToast(`Page "${updated.title}" updated & revision logged!`, 'success');
    }
  };

  // Restore revision
  const handleRestoreRevision = (revTitle: string, revContent: string) => {
    setPageTitle(revTitle);
    setPageContent(revContent);
    showToast('Revision content loaded into editor. Click Save to publish.', 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            Content Management System
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white font-display">
            Visual Page Builder & Storefront CMS
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify layout order, promotional campaign banners, and live fish care pages with instant storefront synchronization.
          </p>
        </div>

        {/* Tab Switcher (Mobile-first responsive) */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('homepage')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'homepage'
                ? 'bg-amber-500 text-ocean-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Homepage Blocks ({sections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'announcement'
                ? 'bg-amber-500 text-ocean-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Announcement Bar</span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'pages'
                ? 'bg-amber-500 text-ocean-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Policy & Care Pages ({pages.length})</span>
          </button>
        </div>
      </div>

      {/* 1. HOMEPAGE BUILDER TAB */}
      {activeTab === 'homepage' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 rounded-3xl p-5 sm:p-6 border border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Storefront Content Blocks (Visual Ordering & Visibility)
                </h2>
                <p className="text-xs text-slate-400">
                  Drag/Move sequence controls the exact top-to-bottom rendering on the homepage.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                  {sections.filter(s => s.is_active).length} of {sections.length} active
                </span>
                <Link
                  to="/"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold"
                >
                  <span>Preview Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
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
                    <span className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-xs sm:text-sm">{section.title}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
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
                      className="min-h-[36px] min-w-[36px] p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sections.length - 1}
                      className="min-h-[36px] min-w-[36px] p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(index)}
                      className={`min-h-[36px] min-w-[36px] p-2 rounded-xl transition-colors flex items-center justify-center ${
                        section.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                      }`}
                      title={section.is_active ? 'Hide Section' : 'Show Section'}
                      aria-label={section.is_active ? 'Hide Section' : 'Show Section'}
                    >
                      {section.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit Section & Config */}
                    <button
                      onClick={() => handleOpenEditSection(section)}
                      className="min-h-[36px] px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
                      title="Configure Section"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>Configure</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PROMOTIONAL ANNOUNCEMENT BAR TAB */}
      {activeTab === 'announcement' && (
        <div className="bg-slate-800/80 rounded-3xl p-5 sm:p-6 border border-slate-700 shadow-sm max-w-2xl space-y-5">
          <div className="pb-3 border-b border-slate-700">
            <h2 className="text-base font-bold text-white font-display">
              Promotional Announcement Bar Editor
            </h2>
            <p className="text-xs text-slate-400">
              This message appears at the very top of all store pages to broadcast deals, free shipping offers, or dispatch notices.
            </p>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-2xl border border-slate-700">
              <div>
                <span className="font-bold text-white block">Display Announcement Bar</span>
                <span className="text-[11px] text-slate-400">Turn on or off across the entire website</span>
              </div>
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Announcement Message *</label>
              <input
                type="text"
                required
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. FLAT 10% OFF: Use code AQUA10 on your first live specimen order!"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Discount Coupon Code (Optional)</label>
                <input
                  type="text"
                  value={announcementCode}
                  onChange={(e) => setAnnouncementCode(e.target.value)}
                  placeholder="e.g. AQUA10"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono uppercase outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Click Destination URL (Optional)</label>
                <input
                  type="text"
                  value={announcementLink}
                  onChange={(e) => setAnnouncementLink(e.target.value)}
                  placeholder="e.g. /shop?category=betta-fish"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-ocean-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Publish Announcement Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. POLICY & CARE PAGES TAB */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Pages Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Custom Pages ({pages.length})</span>
              <button
                onClick={handleStartNewPage}
                className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Page</span>
              </button>
            </div>

            <div className="space-y-2">
              {pages.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectPage(p)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedPage?.id === p.id && !isCreatingNewPage
                      ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-slate-900/80 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <strong className="text-white block font-medium">{p.title}</strong>
                    <span className="text-slate-400 text-[11px] font-mono">/page/{p.slug}</span>
                  </div>
                  <Link
                    to={`/page/${p.slug}`}
                    target="_blank"
                    className="p-1.5 text-slate-400 hover:text-white"
                    title="View live page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right Page Editor */}
          <div className="lg:col-span-8 bg-slate-800/80 rounded-3xl p-5 sm:p-6 border border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {isCreatingNewPage ? 'Create New Custom Page' : `Editing Page: ${pageTitle}`}
                </h3>
                <p className="text-xs text-slate-400">
                  Full HTML and Markdown-friendly editor with SEO metadata configuration.
                </p>
              </div>
              {!isCreatingNewPage && selectedPage && (
                <span className="text-[11px] text-slate-400">
                  Last updated: {formatDate(selectedPage.updated_at)}
                </span>
              )}
            </div>

            <form onSubmit={handleSavePage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="e.g. Terms of Service & DOA Policy"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">URL Path Slug *</label>
                  <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                    <span className="text-slate-500 font-mono">/page/</span>
                    <input
                      type="text"
                      required
                      value={pageSlug}
                      onChange={(e) => setPageSlug(e.target.value)}
                      placeholder="live-arrival-policy"
                      className="w-full bg-transparent text-xs text-amber-400 font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">SEO Meta Title</label>
                  <input
                    type="text"
                    value={pageMetaTitle}
                    onChange={(e) => setPageMetaTitle(e.target.value)}
                    placeholder="Page Title | Betta Aquatics"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">SEO Meta Description</label>
                  <input
                    type="text"
                    value={pageMetaDesc}
                    onChange={(e) => setPageMetaDesc(e.target.value)}
                    placeholder="Short summary for Google search snippets"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">HTML / Rich Content *</label>
                <textarea
                  rows={12}
                  required
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-ocean-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreatingNewPage ? 'Create & Publish Page' : 'Save Page & Log Revision'}</span>
                </button>

                {!isCreatingNewPage && selectedPage && (
                  <Link
                    to={`/page/${selectedPage.slug}`}
                    target="_blank"
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Published Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </form>

            {/* Revision History */}
            {!isCreatingNewPage && selectedPage?.revisions && selectedPage.revisions.length > 0 && (
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <History className="w-4 h-4" />
                  <span>Revision History ({selectedPage.revisions.length})</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedPage.revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="text-white font-medium">{rev.title}</span>
                        <span className="text-[11px] text-slate-500 block">{formatDate(rev.created_at)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRestoreRevision(rev.title, rev.content_html)}
                        className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION CONFIGURATION MODAL */}
      {editingSection && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ocean-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  {editingSection.type}
                </span>
                <h3 className="text-base font-bold text-white mt-1">Configure Homepage Block</h3>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Section Display Title</label>
                <input
                  type="text"
                  required
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subtitle / Supporting Description</label>
                <input
                  type="text"
                  value={sectionSubtitle}
                  onChange={(e) => setSectionSubtitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Specific Config Fields based on section type */}
              {editingSection.type === 'hero' && (
                <div className="space-y-3 p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/80">
                  <div className="font-bold text-amber-400 text-xs">Hero Carousel Specifics:</div>
                  <div>
                    <label className="block text-slate-300 text-[11px] mb-1">Trust Badge Pill Text</label>
                    <input
                      type="text"
                      value={sectionConfig.badge || ''}
                      onChange={(e) => setSectionConfig({ ...sectionConfig, badge: e.target.value })}
                      placeholder="e.g. Certified Live Arrival Guarantee"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[11px] mb-1">Primary CTA Button Text</label>
                    <input
                      type="text"
                      value={sectionConfig.ctaPrimary || ''}
                      onChange={(e) => setSectionConfig({ ...sectionConfig, ctaPrimary: e.target.value })}
                      placeholder="e.g. Shop Bettas"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[11px] mb-1">Primary CTA Destination Link</label>
                    <input
                      type="text"
                      value={sectionConfig.ctaPrimaryLink || ''}
                      onChange={(e) => setSectionConfig({ ...sectionConfig, ctaPrimaryLink: e.target.value })}
                      placeholder="e.g. /shop?category=betta-fish"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {editingSection.type === 'breeder_story' && (
                <div className="space-y-3 p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/80">
                  <div className="font-bold text-amber-400 text-xs">Breeder Profile Specifics:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 text-[11px] mb-1">Breeder Name</label>
                      <input
                        type="text"
                        value={sectionConfig.breederName || ''}
                        onChange={(e) => setSectionConfig({ ...sectionConfig, breederName: e.target.value })}
                        placeholder="e.g. Anand R."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-[11px] mb-1">Experience Years</label>
                      <input
                        type="text"
                        value={sectionConfig.experienceYears || ''}
                        onChange={(e) => setSectionConfig({ ...sectionConfig, experienceYears: e.target.value })}
                        placeholder="e.g. 9+ Years"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[11px] mb-1">Breeder WhatsApp Number</label>
                    <input
                      type="text"
                      value={sectionConfig.whatsapp || ''}
                      onChange={(e) => setSectionConfig({ ...sectionConfig, whatsapp: e.target.value })}
                      placeholder="+91 98450 12345"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {editingSection.type === 'flash_deal' && (
                <div className="space-y-3 p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/80">
                  <div className="font-bold text-amber-400 text-xs">Flash Deal Specifics:</div>
                  <div>
                    <label className="block text-slate-300 text-[11px] mb-1">Banner Pill Text</label>
                    <input
                      type="text"
                      value={sectionConfig.bannerText || ''}
                      onChange={(e) => setSectionConfig({ ...sectionConfig, bannerText: e.target.value })}
                      placeholder="e.g. Limited Stock - 1 Piece Each"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-ocean-950 font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Save Section Settings
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
