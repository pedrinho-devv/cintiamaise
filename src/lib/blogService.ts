// ═══════════════════════════════════════════════════════════════
//  Blog Service — Cíntia Maise Advocacia
//  Persistência via Supabase (PostgreSQL na nuvem)
// ═══════════════════════════════════════════════════════════════

import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  updatedAt?: string;
  slug: string;
  author: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft';
  readingTime: number;
  metaDescription: string;
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'date' | 'readingTime'>;

export const CATEGORIES = [
  'Aposentadoria',
  'Auxílio-Doença',
  'BPC/LOAS',
  'Pensão por Morte',
  'Revisão de Benefícios',
  'Direitos do Trabalhador',
  'INSS',
  'Previdência Social',
  'Outros',
];

// ── Mappers ──────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image ?? '',
    date: row.date,
    updatedAt: row.updated_at,
    slug: row.slug,
    author: row.author,
    category: row.category ?? '',
    tags: row.tags ?? [],
    status: row.status,
    readingTime: row.reading_time,
    metaDescription: row.meta_description ?? '',
  };
}

function toRow(post: Partial<BlogPost> & { id: string; date: string; readingTime: number }) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image ?? '',
    date: post.date,
    updated_at: post.updatedAt ?? null,
    slug: post.slug,
    author: post.author,
    category: post.category ?? '',
    tags: post.tags ?? [],
    status: post.status,
    reading_time: post.readingTime,
    meta_description: post.metaDescription ?? '',
  };
}

// ── Utilitários ─────────────────────────────────────────────────

export function calcReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ── CRUD ─────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data ?? []).map(toPost);
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data ?? []).map(toPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return toPost(data);
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const post: BlogPost = {
    ...input,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    readingTime: calcReadingTime(input.content),
  };
  const { error } = await supabase.from('blog_posts').insert(toRow(post));
  if (error) console.error(error);
  return post;
}

export async function updatePost(id: string, input: BlogPostInput): Promise<BlogPost | null> {
  const existing = await getPostBySlug(input.slug);
  const date = existing?.date ?? new Date().toISOString().split('T')[0];
  const updated: BlogPost = {
    ...input,
    id,
    date,
    updatedAt: new Date().toISOString().split('T')[0],
    readingTime: calcReadingTime(input.content),
  };
  const { error } = await supabase
    .from('blog_posts')
    .update(toRow(updated))
    .eq('id', id);
  if (error) { console.error(error); return null; }
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}

export async function clearAllPosts(): Promise<void> {
  await supabase.from('blog_posts').delete().neq('id', '');
}

// ── Stats ────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const posts = await getAllPosts();
  const now = new Date();
  const thisMonth = posts.filter(p => {
    const [y, m] = p.date.split('-').map(Number);
    return m === now.getMonth() + 1 && y === now.getFullYear();
  });
  return {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    thisMonth: thisMonth.length,
    lastPost: posts[0]?.date ?? null,
  };
}

// ── Seed ────────────────────────────────────────────────────────

export async function seedInitialPosts(): Promise<void> {
  const { count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });
  if (count && count > 0) return;
  const rows = SEED_POSTS.map(toRow);
  const { error } = await supabase.from('blog_posts').insert(rows);
  if (error) console.error('Seed error:', error);
}

export async function isSeeded(): Promise<boolean> {
  const { count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });
  return (count ?? 0) > 0;
}

export const SEED_POSTS: BlogPost[] = [
  {
    id: 'seed-1',
    title: 'Como Se Aposentar Como Autônomo: Guia Completo 2024',
    excerpt:
      'Descubra os passos essenciais para garantir sua aposentadoria como trabalhador autônomo, incluindo contribuições obrigatórias e documentação necessária.',
    content: `<h2>Introdução</h2>
<p>A aposentadoria para trabalhadores autônomos é um tema que gera muitas dúvidas. Diferente dos trabalhadores com carteira assinada, os autônomos precisam se planejar de forma mais estruturada para garantir uma aposentadoria digna.</p>

<h2>Quem é considerado trabalhador autônomo?</h2>
<p>São considerados trabalhadores autônomos aqueles que exercem atividade profissional sem vínculo empregatício, prestando serviços por conta própria. Exemplos incluem:</p>
<ul>
  <li>Profissionais liberais (médicos, advogados, engenheiros)</li>
  <li>Consultores independentes</li>
  <li>Prestadores de serviços diversos</li>
  <li>Comerciantes individuais</li>
</ul>

<h2>Como contribuir para o INSS</h2>
<p>O trabalhador autônomo deve se inscrever na Previdência Social como <strong>contribuinte individual</strong>.</p>

<h2>Conclusão</h2>
<p>A aposentadoria do trabalhador autônomo exige planejamento e disciplina. Em caso de dúvidas, procure sempre orientação especializada.</p>`,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    date: '2024-03-10',
    slug: 'como-se-aposentar-como-autonomo',
    author: 'Cíntia Maise',
    category: 'Aposentadoria',
    tags: ['autônomo', 'INSS', 'planejamento', 'aposentadoria'],
    status: 'published',
    readingTime: 5,
    metaDescription: 'Guia completo sobre como se aposentar sendo autônomo: contribuições, documentação e dicas essenciais.',
  },
  {
    id: 'seed-2',
    title: 'Revisão de Aposentadoria: Quando Vale a Pena Solicitar?',
    excerpt:
      'Entenda quando é possível solicitar a revisão do seu benefício e como isso pode aumentar significativamente o valor da sua aposentadoria.',
    content: `<h2>O que é a revisão de aposentadoria?</h2>
<p>A revisão de aposentadoria é um direito do segurado que pode resultar em aumento significativo no valor do benefício.</p>

<h2>Quando solicitar a revisão?</h2>
<ul>
  <li>Erros no período de carência contabilizado</li>
  <li>Contribuições não computadas pelo INSS</li>
  <li>Tempo especial não reconhecido</li>
</ul>

<h2>Prazo para solicitar</h2>
<p>O prazo decadencial para revisão é de <strong>10 anos</strong> a contar da data de concessão do benefício.</p>`,
    image: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&w=1200&q=80',
    date: '2024-03-05',
    slug: 'revisao-aposentadoria-quando-vale-pena',
    author: 'Cíntia Maise',
    category: 'Revisão de Benefícios',
    tags: ['revisão', 'aposentadoria', 'INSS', 'benefício'],
    status: 'published',
    readingTime: 4,
    metaDescription: 'Saiba quando vale a pena solicitar a revisão da sua aposentadoria e como aumentar o valor do seu benefício.',
  },
  {
    id: 'seed-3',
    title: 'Auxílio-Doença Negado: O Que Fazer e Como Recorrer',
    excerpt:
      'Seu auxílio-doença foi negado pelo INSS? Saiba quais são os próximos passos e como recorrer da decisão de forma eficiente.',
    content: `<h2>Por que o INSS nega o auxílio-doença?</h2>
<ul>
  <li><strong>Carência insuficiente:</strong> menos de 12 contribuições mensais</li>
  <li><strong>Perícia desfavorável:</strong> médico perito não reconhece a incapacidade</li>
  <li><strong>Documentação incompleta:</strong> laudos e atestados inadequados</li>
</ul>

<h2>Como recorrer da negativa</h2>
<p>Você tem <strong>30 dias</strong> após a notificação para entrar com recurso no próprio INSS.</p>`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    date: '2024-02-20',
    slug: 'auxilio-doenca-negado-como-recorrer',
    author: 'Cíntia Maise',
    category: 'Auxílio-Doença',
    tags: ['auxílio-doença', 'recurso', 'INSS', 'negativa'],
    status: 'published',
    readingTime: 5,
    metaDescription: 'O que fazer quando o auxílio-doença é negado pelo INSS: veja como recorrer e garantir seu direito ao benefício.',
  },
  {
    id: 'seed-4',
    title: 'BPC/LOAS: Quem Tem Direito e Como Solicitar',
    excerpt:
      'O Benefício de Prestação Continuada (BPC) garante um salário mínimo mensal a pessoas com deficiência e idosos em situação de vulnerabilidade.',
    content: `<h2>O que é o BPC/LOAS?</h2>
<p>O BPC garante o pagamento de <strong>um salário mínimo por mês</strong> para pessoas com deficiência e idosos com 65 anos ou mais.</p>

<h2>Requisitos</h2>
<ul>
  <li>Renda familiar per capita inferior a 1/4 do salário mínimo</li>
  <li>Não receber nenhum outro benefício previdenciário</li>
</ul>

<h2>Como solicitar</h2>
<p>O pedido pode ser feito pelo <strong>Meu INSS</strong> ou por telefone no <strong>135</strong>.</p>`,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
    date: '2024-02-10',
    slug: 'bpc-loas-quem-tem-direito-como-solicitar',
    author: 'Cíntia Maise',
    category: 'BPC/LOAS',
    tags: ['BPC', 'LOAS', 'deficiência', 'idoso', 'assistência social'],
    status: 'published',
    readingTime: 5,
    metaDescription: 'Saiba tudo sobre o BPC/LOAS: quem tem direito, requisitos, como solicitar e o que fazer se for negado.',
  },
];
