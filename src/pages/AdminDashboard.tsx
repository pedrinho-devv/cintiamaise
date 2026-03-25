import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Eye,
  Search,
  FileText,
  CheckCircle2,
  PenLine,
  TrendingUp,
  Clock,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BlogPostForm from '@/components/BlogPostForm';
import {
  BlogPost,
  BlogPostInput,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getDashboardStats,
  seedInitialPosts,
  clearAllPosts,
} from '@/lib/blogService';

type Filter = 'all' | 'published' | 'draft';

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin/login');
      return;
    }
    loadPosts();
  }, [navigate]);

  const loadPosts = async () => setPosts(await getAllPosts());

  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, thisMonth: 0, lastPost: null as string | null });

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (filter !== 'all') result = result.filter(p => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, filter, search]);

  const handleSavePost = async (postData: BlogPostInput) => {
    if (editingPost) {
      await updatePost(editingPost.id, postData);
      toast({ title: 'Artigo atualizado!', description: 'As alterações foram salvas com sucesso.' });
    } else {
      await createPost(postData);
      toast({ title: 'Artigo publicado!', description: 'O novo artigo está disponível no site.' });
    }
    await loadPosts();
    setShowForm(false);
    setEditingPost(null);
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    await loadPosts();
    setShowDeleteId(null);
    toast({ title: 'Artigo excluído', description: 'O artigo foi removido permanentemente.' });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  const handleSeed = async () => {
    await clearAllPosts();
    await seedInitialPosts();
    await loadPosts();
    toast({ title: 'Artigos importados!', description: '4 artigos de exemplo foram adicionados ao blog.' });
  };

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (showForm) {
    return (
      <BlogPostForm
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sidebar + Layout ───────────────────────────────────── */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-[#0f1623] flex flex-col fixed left-0 top-0 z-30">
          <div className="px-5 py-6 border-b border-white/10">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Admin</p>
            <p className="text-white font-merriweather font-bold text-base leading-tight">
              Cíntia Maise
            </p>
            <p className="text-[#C3A039] text-xs mt-0.5">Advogada Previdenciarista</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            <SidebarItem icon={<FileText size={16} />} label="Artigos" active />
          </nav>

          <div className="px-3 py-4 border-t border-white/10 space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors"
            >
              <Eye size={15} />
              Ver Site
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors"
            >
              <FileText size={15} />
              Ver Blog
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors"
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="ml-56 flex-1 min-h-screen">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h1 className="font-semibold text-gray-900">Gerenciar Artigos</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {stats.total} artigo{stats.total !== 1 ? 's' : ''} no total
              </p>
            </div>
            <Button
              onClick={() => { setEditingPost(null); setShowForm(true); }}
              className="gap-2 bg-[#C3A039] hover:bg-[#a8892f] text-white shadow-sm"
            >
              <Plus size={16} />
              Novo Artigo
            </Button>
          </header>

          <div className="px-6 py-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<FileText size={18} className="text-blue-500" />}
                bg="bg-blue-50"
                label="Total de Artigos"
                value={stats.total}
              />
              <StatCard
                icon={<CheckCircle2 size={18} className="text-green-500" />}
                bg="bg-green-50"
                label="Publicados"
                value={stats.published}
              />
              <StatCard
                icon={<PenLine size={18} className="text-amber-500" />}
                bg="bg-amber-50"
                label="Rascunhos"
                value={stats.drafts}
              />
              <StatCard
                icon={<TrendingUp size={18} className="text-purple-500" />}
                bg="bg-purple-50"
                label="Este Mês"
                value={stats.thisMonth}
              />
            </div>

            {/* Filters + search */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                  {(['all', 'published', 'draft'] as Filter[]).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 font-medium transition-colors border-r border-gray-200 last:border-0 ${
                        filter === f
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {f === 'all' ? 'Todos' : f === 'published' ? 'Publicados' : 'Rascunhos'}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar artigos..."
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Table */}
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <FileText size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">
                    {search ? 'Nenhum artigo encontrado para essa busca' : 'Nenhum artigo ainda'}
                  </p>
                  {!search && (
                    <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                      <Button
                        onClick={() => { setEditingPost(null); setShowForm(true); }}
                        className="bg-[#C3A039] hover:bg-[#a8892f] text-white"
                      >
                        Criar primeiro artigo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSeed}
                        className="border-[#C3A039] text-[#C3A039] hover:bg-[#C3A039]/10"
                      >
                        Importar artigos de exemplo
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                        <th className="text-left px-5 py-3 font-medium">Artigo</th>
                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Categoria</th>
                        <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                          <Calendar size={12} className="inline mr-1" />Data
                        </th>
                        <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                          <Clock size={12} className="inline mr-1" />Leitura
                        </th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                        <th className="text-right px-5 py-3 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.map(post => (
                        <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-5 py-4">
                            <div className="font-medium text-gray-900 leading-snug line-clamp-1 max-w-xs">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">
                              {post.excerpt}
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            {post.category ? (
                              <span className="text-xs bg-[#C3A039]/10 text-[#8a6e20] px-2 py-0.5 rounded-full font-medium">
                                {post.category}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-gray-500 hidden lg:table-cell whitespace-nowrap">
                            {formatDate(post.date)}
                          </td>
                          <td className="px-4 py-4 text-gray-500 hidden lg:table-cell">
                            {post.readingTime} min
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={post.status} />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => navigate(`/blog/${post.slug}`)}
                                title="Ver artigo"
                              >
                                <Eye size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-[#C3A039] hover:bg-amber-50"
                                onClick={() => { setEditingPost(post); setShowForm(true); }}
                                title="Editar"
                              >
                                <Edit size={14} />
                              </Button>
                              {showDeleteId === post.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    className="text-xs text-red-600 font-medium px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                                    onClick={() => handleDelete(post.id)}
                                  >
                                    Confirmar
                                  </button>
                                  <button
                                    className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100"
                                    onClick={() => setShowDeleteId(null)}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => setShowDeleteId(post.id)}
                                  title="Excluir"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const SidebarItem = ({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-[#C3A039]/20 text-[#C3A039]'
        : 'text-white/60 hover:text-white hover:bg-white/10'
    }`}
  >
    {icon}
    {label}
  </div>
);

const StatCard = ({
  icon,
  bg,
  label,
  value,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: number;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className={`${bg} w-9 h-9 rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

const StatusBadge = ({ status }: { status: 'published' | 'draft' }) =>
  status === 'published' ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      Publicado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
      Rascunho
    </span>
  );

export default AdminDashboard;
