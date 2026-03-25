import { useState, useRef, useCallback, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Eye,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Link,
  Quote,
  Minus,
  Clock,
  Tag,
  X,
  ImageIcon,
  FileText,
  Search,
  Upload,
} from 'lucide-react';
import { BlogPost, BlogPostInput, CATEGORIES, generateSlug, calcReadingTime } from '@/lib/blogService';

interface BlogPostFormProps {
  post?: BlogPost | null;
  onSave: (post: BlogPostInput) => void;
  onCancel: () => void;
}

type Tab = 'content' | 'seo' | 'preview';

const BlogPostForm = ({ post, onSave, onCancel }: BlogPostFormProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [tagInput, setTagInput] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState<BlogPostInput>({
    title: post?.title ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    image: post?.image ?? '',
    slug: post?.slug ?? '',
    author: post?.author ?? 'Cíntia Maise',
    category: post?.category ?? '',
    tags: post?.tags ?? [],
    status: post?.status ?? 'draft',
    metaDescription: post?.metaDescription ?? '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BlogPostInput, string>>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof BlogPostInput, value: string | string[]) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  // ── Image upload ─────────────────────────────────────────────────────────────
  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
          const MAX_W = 1200;
          const scale = img.width > MAX_W ? MAX_W / img.width : 1;
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
        img.src = ev.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const dataUrl = await compressImage(file);
    update('image', dataUrl);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleImageFile(file);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug && prev.slug !== generateSlug(prev.title) ? prev.slug : generateSlug(title),
    }));
  };

  // ── Rich text helpers ────────────────────────────────────────────────────────
  const wrapSelection = useCallback((before: string, after: string) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);
    const newValue =
      ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
    update('content', newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, []);

  const insertBlock = useCallback((prefix: string) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
    const newValue = ta.value.slice(0, lineStart) + prefix + ta.value.slice(lineStart);
    update('content', newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    }, 0);
  }, []);

  const toolbarActions = [
    { icon: <Bold size={15} />, label: 'Negrito', action: () => wrapSelection('<strong>', '</strong>') },
    { icon: <Italic size={15} />, label: 'Itálico', action: () => wrapSelection('<em>', '</em>') },
    { icon: <Heading2 size={15} />, label: 'Título H2', action: () => wrapSelection('<h2>', '</h2>') },
    { icon: <Heading3 size={15} />, label: 'Subtítulo H3', action: () => wrapSelection('<h3>', '</h3>') },
    { icon: <List size={15} />, label: 'Lista', action: () => wrapSelection('<ul>\n  <li>', '</li>\n</ul>') },
    { icon: <Quote size={15} />, label: 'Citação', action: () => wrapSelection('<blockquote>', '</blockquote>') },
    { icon: <Link size={15} />, label: 'Link', action: () => wrapSelection('<a href="URL">', '</a>') },
    { icon: <Minus size={15} />, label: 'Parágrafo', action: () => insertBlock('<p>') },
  ];

  // ── Tags ────────────────────────────────────────────────────────────────────
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !formData.tags.includes(t)) {
      update('tags', [...formData.tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) =>
    update('tags', formData.tags.filter(t => t !== tag));

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!formData.title.trim()) e.title = 'Título é obrigatório';
    if (!formData.excerpt.trim()) e.excerpt = 'Resumo é obrigatório';
    if (!formData.content.trim()) e.content = 'Conteúdo é obrigatório';
    if (!formData.category) e.category = 'Selecione uma categoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  const readingTime = calcReadingTime(formData.content);
  const wordCount = formData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const excerptCount = formData.excerpt.length;
  const metaCount = formData.metaDescription.length;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2 text-gray-600">
              <ArrowLeft size={16} />
              Voltar
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            <h1 className="font-merriweather font-bold text-gray-800 text-lg">
              {post ? 'Editar Artigo' : 'Novo Artigo'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Status toggle */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => update('status', 'draft')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  formData.status === 'draft'
                    ? 'bg-amber-50 text-amber-700 border-r border-amber-200'
                    : 'text-gray-500 hover:bg-gray-50 border-r border-gray-200'
                }`}
              >
                Rascunho
              </button>
              <button
                type="button"
                onClick={() => update('status', 'published')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  formData.status === 'published'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Publicar
              </button>
            </div>

            <Button
              onClick={handleSubmit}
              className="gap-2 bg-[#C3A039] hover:bg-[#a8892f] text-white"
            >
              <Save size={15} />
              Salvar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 border-t border-gray-100">
          {(['content', 'seo', 'preview'] as Tab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#C3A039] text-[#C3A039]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'content' && <FileText size={14} />}
              {tab === 'seo' && <Search size={14} />}
              {tab === 'preview' && <Eye size={14} />}
              {tab === 'content' ? 'Conteúdo' : tab === 'seo' ? 'SEO' : 'Preview'}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3 py-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock size={12} /> {readingTime} min leitura</span>
            <span>{wordCount} palavras</span>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-6">
        {/* ── TAB: CONTENT ── */}
        {activeTab === 'content' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Título do Artigo *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Ex: Como solicitar a revisão da sua aposentadoria"
                  className={`text-lg ${errors.title ? 'border-red-400' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}

                <div className="mt-3">
                  <Label htmlFor="slug" className="text-xs text-gray-500 mb-1 block">
                    URL do artigo
                  </Label>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-400">/blog/</span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={e => update('slug', e.target.value)}
                      className="h-7 text-sm py-0 flex-1 text-[#C3A039]"
                      placeholder="url-do-artigo"
                    />
                  </div>
                </div>
              </div>

              {/* Content editor */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                  {toolbarActions.map(({ icon, label, action }) => (
                    <button
                      key={label}
                      type="button"
                      title={label}
                      onClick={action}
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {icon}
                    </button>
                  ))}
                  <div className="ml-auto text-xs text-gray-400 pr-1">HTML</div>
                </div>

                <Textarea
                  ref={contentRef}
                  id="content"
                  value={formData.content}
                  onChange={e => update('content', e.target.value)}
                  placeholder={`<h2>Introdução</h2>\n<p>Escreva o conteúdo do artigo aqui...</p>\n\n<h2>Desenvolvimento</h2>\n<p>Continue o artigo...</p>`}
                  rows={22}
                  className={`font-mono text-sm rounded-none border-0 focus-visible:ring-0 resize-none ${
                    errors.content ? 'bg-red-50' : ''
                  }`}
                />
                {errors.content && (
                  <p className="text-red-500 text-xs px-4 pb-2">{errors.content}</p>
                )}
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between mb-2">
                  <Label htmlFor="excerpt" className="text-sm font-semibold text-gray-700">
                    Resumo / Chamada *
                  </Label>
                  <span className={`text-xs ${excerptCount > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                    {excerptCount}/160 caracteres
                  </span>
                </div>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={e => update('excerpt', e.target.value)}
                  placeholder="Escreva uma chamada que desperte a curiosidade do leitor e apareça nas listagens do blog..."
                  rows={3}
                  className={errors.excerpt ? 'border-red-400' : ''}
                />
                {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Aparece na listagem do blog e nas buscas. Ideal: até 160 caracteres.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Image */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ImageIcon size={15} /> Imagem de Capa
                </Label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) await handleImageFile(file);
                    e.target.value = '';
                  }}
                />

                {formData.image ? (
                  <div className="relative group">
                    <img
                      src={formData.image}
                      alt="Capa"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow hover:bg-gray-50 transition-colors"
                      >
                        <Upload size={12} /> Trocar
                      </button>
                      <button
                        type="button"
                        onClick={() => update('image', '')}
                        className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow hover:bg-red-600 transition-colors"
                      >
                        <X size={12} /> Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#C3A039] bg-[#C3A039]/5 text-[#C3A039]'
                        : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-[#C3A039]/50 hover:bg-[#C3A039]/5 hover:text-[#C3A039]/70'
                    }`}
                  >
                    <Upload size={22} />
                    <div className="text-center">
                      <p className="text-sm font-medium">Clique ou arraste uma imagem</p>
                      <p className="text-xs mt-0.5 opacity-70">JPG, PNG, WebP — máx. recomendado 5 MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Categoria *
                </Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => update('category', cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        formData.category === cat
                          ? 'bg-[#C3A039] text-white border-[#C3A039]'
                          : 'border-gray-200 text-gray-600 hover:border-[#C3A039] hover:text-[#C3A039]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-2">{errors.category}</p>
                )}
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Tag size={14} /> Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); addTag(); }
                    }}
                    placeholder="Ex: INSS, previdência..."
                    className="text-sm h-8"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={addTag} className="h-8 px-3">
                    +
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {formData.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X size={10} />
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Pressione Enter para adicionar. Clique na tag para remover.</p>
              </div>

              {/* Author */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <Label htmlFor="author" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Autor
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={e => update('author', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SEO ── */}
        {activeTab === 'seo' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-800 mb-1">Configurações de SEO</h2>
              <p className="text-sm text-gray-500 mb-6">
                Otimize como seu artigo aparece nos mecanismos de busca como o Google.
              </p>

              {/* Preview Google */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Prévia no Google</p>
                <p className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                  {formData.title || 'Título do artigo'}
                </p>
                <p className="text-green-700 text-xs truncate">
                  seusite.com.br/blog/{formData.slug || 'url-do-artigo'}
                </p>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {formData.metaDescription || formData.excerpt || 'Meta description do artigo aparecerá aqui...'}
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-sm font-medium text-gray-700">Meta Description</Label>
                    <span className={`text-xs ${metaCount > 160 ? 'text-red-500 font-medium' : metaCount > 130 ? 'text-amber-500' : 'text-gray-400'}`}>
                      {metaCount}/160
                    </span>
                  </div>
                  <Textarea
                    value={formData.metaDescription}
                    onChange={e => update('metaDescription', e.target.value)}
                    placeholder="Resumo para os mecanismos de busca. Se vazio, usará o resumo do artigo."
                    rows={3}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Ideal entre 120–160 caracteres para aparecer completo no Google.
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">URL do Artigo (Slug)</Label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400 whitespace-nowrap">/blog/</span>
                    <Input
                      value={formData.slug}
                      onChange={e => update('slug', e.target.value)}
                      className="text-sm text-[#C3A039]"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    URLs curtas e descritivas performam melhor no Google.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-800 mb-2">Dicas de SEO</p>
                  <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                    <li>Use palavras-chave relevantes no título e na meta description</li>
                    <li>O título ideal tem entre 50–60 caracteres ({formData.title.length} atuais)</li>
                    <li>Inclua a palavra-chave principal no primeiro parágrafo</li>
                    <li>Use subtítulos (H2, H3) para organizar o conteúdo</li>
                    <li>Adicione tags relevantes para facilitar a descoberta</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PREVIEW ── */}
        {activeTab === 'preview' && (
          <div className="max-w-4xl bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
              <Eye size={14} />
              Preview do artigo — como aparecerá para os leitores
            </div>
            <div className="p-8 lg:p-12">
              {formData.category && (
                <span className="inline-block bg-[#C3A039]/10 text-[#C3A039] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                  {formData.category}
                </span>
              )}
              <h1 className="font-merriweather text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {formData.title || <span className="text-gray-300">Título do artigo</span>}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                <span>Por {formData.author}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {readingTime} min de leitura
                </span>
                {formData.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex gap-1">
                      {formData.tags.slice(0, 3).map(t => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {formData.image && (
                <img
                  src={formData.image}
                  alt={formData.title}
                  className="w-full h-72 object-cover rounded-xl mb-8"
                />
              )}
              <div
                className="prose prose-slate max-w-none prose-lg
                  prose-headings:font-merriweather prose-headings:text-gray-800
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-ul:text-gray-700 prose-li:mb-2
                  prose-blockquote:border-l-[#C3A039] prose-blockquote:text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: formData.content || '<p class="text-gray-400">O conteúdo do artigo aparecerá aqui...</p>',
                }}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BlogPostForm;
