import { useState, useMemo } from 'react';
import {
  Search, Tag, TrendingUp, Clock, Eye, ArrowRight, BookOpen,
  Cpu, BarChart2, Layers, Package, Terminal, Star, ChevronRight,
  Rss, Filter, X, Calendar, User, Hash, Zap, Database, Shield
} from 'lucide-react';

// ─── Blog Data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All Articles', icon: BookOpen, color: '#10B981' },
  { id: 'analytics', label: 'Analytics', icon: BarChart2, color: '#6366F1' },
  { id: 'architecture', label: 'Architecture', icon: Layers, color: '#F59E0B' },
  { id: 'inventory', label: 'Inventory', icon: Package, color: '#EC4899' },
  { id: 'kds', label: 'KDS', icon: Terminal, color: '#8B5CF6' },
  { id: 'engineering', label: 'Engineering', icon: Cpu, color: '#14B8A6' },
  { id: 'security', label: 'Security', icon: Shield, color: '#EF4444' },
  { id: 'database', label: 'Database', icon: Database, color: '#F97316' },
];

const ARTICLES = [
  {
    id: 'a1',
    slug: 'real-time-analytics-architecture',
    title: 'Building Real-Time Analytics for Restaurant POS Systems',
    excerpt: 'How we architected a sub-100ms analytics pipeline using event streaming, ClickHouse, and React dashboards — serving 10M+ daily events across 500+ outlets.',
    content: '',
    category: 'analytics',
    tags: ['ClickHouse', 'Kafka', 'React', 'Real-time', 'POS'],
    author: { name: 'Vineet Gupta', avatar: 'VG' },
    publishedAt: '2026-09-20',
    readTime: '12 min',
    views: '8.2k',
    featured: true,
    coverGradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)',
    icon: BarChart2,
  },
  {
    id: 'a2',
    slug: 'microservices-kitchen-display',
    title: 'KDS Microservices: Zero-Downtime Order Routing Architecture',
    excerpt: 'Deep dive into our Kitchen Display System — how we handle concurrent order streams, dynamic routing rules, and guaranteed delivery using NATS JetStream.',
    content: '',
    category: 'kds',
    tags: ['NATS', 'Microservices', 'Go', 'WebSocket', 'KDS'],
    author: { name: 'Vineet Gupta', avatar: 'VG' },
    publishedAt: '2026-09-15',
    readTime: '15 min',
    views: '6.1k',
    featured: true,
    coverGradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    icon: Terminal,
  },
  {
    id: 'a3',
    slug: 'inventory-forecasting-ml',
    title: 'Smart Inventory Forecasting with ML — From 40% Waste to 8%',
    excerpt: 'We replaced gut-feel ordering with an ML model trained on 2 years of sales data, weather patterns, and local events. Here\'s the full technical story.',
    content: '',
    category: 'inventory',
    tags: ['Machine Learning', 'Python', 'Forecasting', 'Inventory', 'FastAPI'],
    author: { name: 'Vineet Gupta', avatar: 'VG' },
    publishedAt: '2026-09-10',
    readTime: '18 min',
    views: '11.4k',
    featured: true,
    coverGradient: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
    icon: Package,
  },
  {
    id: 'a4',
    slug: 'event-driven-pos-architecture',
    title: 'Event-Driven POS: Why We Ditched REST for CQRS + Event Sourcing',
    excerpt: 'REST worked fine at 50 orders/day. At 5,000, it fell apart. This is our journey migrating to CQRS + Event Sourcing — the wins, the pain, and the lessons.',
    content: '',
    category: 'architecture',
    tags: ['CQRS', 'Event Sourcing', 'DDD', 'Node.js', 'PostgreSQL'],
    author: { name: 'Vineet Gupta', avatar: 'VG' },
    publishedAt: '2026-09-05',
    readTime: '20 min',
    views: '14.7k',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
    icon: Layers,
  },
  {
    id: 'a5',
    slug: 'multi-tenant-saas-database',
    title: 'Multi-Tenant SaaS Database Design: Row-Level vs Schema-Level Isolation',
    excerpt: 'We tested both patterns at scale. Row-level isolation won for our use case — but the decision isn\'t simple. Full benchmark data and schema design inside.',
    content: '',
    category: 'database',
    tags: ['PostgreSQL', 'Multi-tenant', 'SaaS', 'RLS', 'Performance'],
    author: { name: 'Vineet Gupta', avatar: 'VG' },
    publishedAt: '2026-08-28',
    readTime: '14 min',
    views: '9.3k',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
    icon: Database,
  },
  {
    id: 'a6',
    slug: 'securing-payment-flows',
    title: 'PCI-DSS Compliant Payment Flows: What We Actually Had to Change',
    excerpt: 'Achieving PCI-DSS compliance wasn\'t just a checkbox exercise. We had to rethink our entire payment data flow, tokenization strategy, and logging pipeline.',
    content: '',
    category: 'security',
    tags: ['PCI-DSS', 'Security', 'Tokenization', 'Payments', 'Compliance'],
    author: { name: 'Vineet Gupta', avatar: 'VG' },
    publishedAt: '2026-08-20',
    readTime: '16 min',
    views: '7.8k',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #EF4444 0%, #8B5CF6 100%)',
    icon: Shield,
  },
  {
    id: 'a7',
    slug: 'react-performance-dashboard',
    title: 'React Dashboard Performance: From 4s Load to 340ms with These Patterns',
    excerpt: 'Our analytics dashboard was painfully slow. Here\'s every optimization we made — virtualization, suspense, memo strategies, and WebWorker offloading.',
    content: '',
    category: 'engineering',
    tags: ['React', 'Performance', 'Virtualization', 'Web Workers', 'Optimization'],
    author: { name: 'Vineet Gupta', avatar: 'VG' },
    publishedAt: '2026-08-15',
    readTime: '11 min',
    views: '13.2k',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #14B8A6 0%, #6366F1 100%)',
    icon: Cpu,
  },
  {
    id: 'a8',
    slug: 'analytics-aggregation-patterns',
    title: 'Aggregation Patterns for Restaurant Analytics: Pre-compute vs On-demand',
    excerpt: 'When should you pre-aggregate vs compute on-the-fly? We benchmarked both approaches across hourly, daily, and monthly report frequencies.',
    content: '',
    category: 'analytics',
    tags: ['ClickHouse', 'Aggregation', 'Analytics', 'Performance', 'Materialized Views'],
    author: { name: 'Vineet Gupta', avatar: 'VG' },
    publishedAt: '2026-08-10',
    readTime: '13 min',
    views: '5.9k',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
    icon: BarChart2,
  },
];

const ALL_TAGS = [...new Set(ARTICLES.flatMap(a => a.tags))];

// ─── Utility ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getCategoryMeta(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
}

// ─── Components ───────────────────────────────────────────────────────────────

function CategoryChip({ cat, active, onClick }) {
  const Icon = cat.icon;
  return (
    <button
      className={`blog-cat-chip ${active ? 'active' : ''}`}
      style={active ? { '--chip-color': cat.color, borderColor: cat.color, background: `${cat.color}18`, color: cat.color } : { '--chip-color': cat.color }}
      onClick={onClick}
    >
      <Icon size={13} />
      {cat.label}
    </button>
  );
}

function TagPill({ tag, active, onClick }) {
  return (
    <button className={`blog-tag-pill ${active ? 'active' : ''}`} onClick={onClick}>
      <Hash size={11} />
      {tag}
    </button>
  );
}

function AuthorAvatar({ initials, size = 32 }) {
  return (
    <div className="blog-avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

function ReadingTime({ mins }) {
  return (
    <span className="blog-meta-item">
      <Clock size={12} />
      {mins} read
    </span>
  );
}

function ViewCount({ count }) {
  return (
    <span className="blog-meta-item">
      <Eye size={12} />
      {count} views
    </span>
  );
}

// ─── Featured Card ─────────────────────────────────────────────────────────────
function FeaturedCard({ article, onClick }) {
  const cat = getCategoryMeta(article.category);
  const Icon = article.icon;
  return (
    <article className="blog-featured-card" onClick={() => onClick(article)}>
      <div className="blog-featured-cover" style={{ background: article.coverGradient }}>
        <div className="blog-featured-cover-icon">
          <Icon size={36} color="rgba(255,255,255,0.9)" />
        </div>
        <div className="blog-featured-badge">
          <Star size={11} fill="currentColor" /> Featured
        </div>
      </div>
      <div className="blog-featured-body">
        <div className="blog-featured-cat" style={{ color: cat.color }}>
          <cat.icon size={13} />
          {cat.label}
        </div>
        <h3 className="blog-featured-title">{article.title}</h3>
        <p className="blog-featured-excerpt">{article.excerpt}</p>
        <div className="blog-featured-footer">
          <div className="blog-featured-author">
            <AuthorAvatar initials={article.author.avatar} size={28} />
            <span>{article.author.name}</span>
            <span className="blog-dot">·</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <div className="blog-featured-meta">
            <ReadingTime mins={article.readTime} />
            <ViewCount count={article.views} />
          </div>
        </div>
        <div className="blog-read-more">
          Read Article <ArrowRight size={14} />
        </div>
      </div>
    </article>
  );
}

// ─── Article Card ──────────────────────────────────────────────────────────────
function ArticleCard({ article, onClick }) {
  const cat = getCategoryMeta(article.category);
  const Icon = article.icon;
  return (
    <article className="blog-article-card" onClick={() => onClick(article)}>
      <div className="blog-article-thumb" style={{ background: article.coverGradient }}>
        <Icon size={24} color="rgba(255,255,255,0.85)" />
      </div>
      <div className="blog-article-body">
        <div className="blog-article-cat" style={{ color: cat.color }}>
          <cat.icon size={12} /> {cat.label}
        </div>
        <h3 className="blog-article-title">{article.title}</h3>
        <p className="blog-article-excerpt">{article.excerpt}</p>
        <div className="blog-article-tags">
          {article.tags.slice(0, 3).map(t => (
            <span key={t} className="blog-article-tag">{t}</span>
          ))}
        </div>
        <div className="blog-article-footer">
          <div className="blog-article-author">
            <AuthorAvatar initials={article.author.avatar} size={24} />
            <span>{article.author.name}</span>
            <span className="blog-dot">·</span>
            <Calendar size={11} />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <div className="blog-article-meta">
            <ReadingTime mins={article.readTime} />
            <ViewCount count={article.views} />
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ categories, activeCategory, onCategory, allTags, activeTag, onTag }) {
  return (
    <aside className="blog-sidebar">
      {/* Product Info */}
      <div className="blog-sidebar-card blog-product-card">
        <div className="blog-product-logo">
          <Zap size={20} color="#10B981" />
        </div>
        <h4>SalarySlip Pro</h4>
        <p>Free, professional salary slip generator trusted by HR teams across India.</p>
        <div className="blog-product-stats">
          <div>
            <strong>50k+</strong>
            <span>Slips Generated</span>
          </div>
          <div>
            <strong>2k+</strong>
            <span>Companies</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Free</span>
          </div>
        </div>
        <a href="/" className="blog-product-cta">
          Try Free Tool <ArrowRight size={14} />
        </a>
      </div>

      {/* Categories */}
      <div className="blog-sidebar-card">
        <div className="blog-sidebar-head">
          <Filter size={14} />
          Topics
        </div>
        <div className="blog-sidebar-cats">
          {categories.map(cat => {
            const Icon = cat.icon;
            const count = cat.id === 'all' ? ARTICLES.length : ARTICLES.filter(a => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                className={`blog-sidebar-cat ${activeCategory === cat.id ? 'active' : ''}`}
                style={activeCategory === cat.id ? { color: cat.color, background: `${cat.color}12`, borderLeft: `3px solid ${cat.color}` } : {}}
                onClick={() => onCategory(cat.id)}
              >
                <Icon size={14} style={{ color: activeCategory === cat.id ? cat.color : '#94A3B8' }} />
                <span>{cat.label}</span>
                <span className="blog-sidebar-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="blog-sidebar-card">
        <div className="blog-sidebar-head">
          <Tag size={14} />
          Popular Tags
        </div>
        <div className="blog-sidebar-tags">
          {allTags.slice(0, 16).map(tag => (
            <button
              key={tag}
              className={`blog-sidebar-tag ${activeTag === tag ? 'active' : ''}`}
              onClick={() => onTag(tag === activeTag ? null : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="blog-sidebar-card blog-newsletter">
        <div className="blog-newsletter-icon">
          <Rss size={18} color="#fff" />
        </div>
        <h4>Stay Updated</h4>
        <p>Get new engineering articles delivered to your inbox.</p>
        <input type="email" placeholder="your@email.com" className="blog-newsletter-input" />
        <button className="blog-newsletter-btn">Subscribe</button>
      </div>
    </aside>
  );
}

// ─── Article Detail Modal ──────────────────────────────────────────────────────
function ArticleModal({ article, onClose }) {
  if (!article) return null;
  const cat = getCategoryMeta(article.category);
  const Icon = article.icon;

  return (
    <div className="blog-modal-overlay" onClick={onClose}>
      <div className="blog-modal" onClick={e => e.stopPropagation()}>
        <button className="blog-modal-close" onClick={onClose}><X size={18} /></button>
        <div className="blog-modal-cover" style={{ background: article.coverGradient }}>
          <Icon size={48} color="rgba(255,255,255,0.85)" />
          <div className="blog-modal-cover-overlay" />
        </div>
        <div className="blog-modal-body">
          <div className="blog-modal-cat" style={{ color: cat.color }}>
            <cat.icon size={13} /> {cat.label}
          </div>
          <h2 className="blog-modal-title">{article.title}</h2>
          <div className="blog-modal-meta">
            <AuthorAvatar initials={article.author.avatar} size={36} />
            <div>
              <strong>{article.author.name}</strong>
              <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                <span className="blog-meta-item"><Calendar size={12} />{formatDate(article.publishedAt)}</span>
                <ReadingTime mins={article.readTime} />
                <ViewCount count={article.views} />
              </div>
            </div>
          </div>
          <div className="blog-modal-tags">
            {article.tags.map(t => <span key={t} className="blog-article-tag">{t}</span>)}
          </div>
          <div className="blog-modal-content">
            <p className="blog-modal-lead">{article.excerpt}</p>
            <div className="blog-modal-placeholder">
              <div className="blog-modal-placeholder-inner">
                <BookOpen size={32} color="#10B981" />
                <h4>Full Article Coming Soon</h4>
                <p>This is a preview. The complete article with code samples, diagrams, and benchmarks is being finalized.</p>
                <div className="blog-modal-toc">
                  <div className="blog-toc-title">What you'll learn:</div>
                  {['System design decisions & tradeoffs', 'Step-by-step implementation guide', 'Real benchmarks & performance data', 'Code samples & architecture diagrams', 'Lessons learned & best practices'].map((item, i) => (
                    <div key={i} className="blog-toc-item">
                      <ChevronRight size={14} color="#10B981" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Blog Page ────────────────────────────────────────────────────────────
export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filtered = useMemo(() => {
    let list = ARTICLES;
    if (activeCategory !== 'all') list = list.filter(a => a.category === activeCategory);
    if (activeTag) list = list.filter(a => a.tags.includes(activeTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, activeCategory, activeTag]);

  const featured = ARTICLES.filter(a => a.featured);
  const showFeatured = activeCategory === 'all' && !search && !activeTag;

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setActiveTag(null);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('all');
    setActiveTag(null);
  };

  const hasFilters = activeCategory !== 'all' || activeTag || search.trim();

  return (
    <div className="blog-page">
      {/* ── Hero ── */}
      <div className="blog-hero">
        <div className="blog-hero-bg" />
        <div className="blog-hero-content">
          <div className="blog-hero-badge">
            <Rss size={13} />
            Engineering Blog
          </div>
          <h1 className="blog-hero-title">
            Product Engineering<br />
            <span className="blog-hero-accent">Stories & Deep Dives</span>
          </h1>
          <p className="blog-hero-sub">
            Tech articles, architecture deep dives, and product engineering stories from the team building SalarySlip Pro.
          </p>

          {/* Search */}
          <div className="blog-search-wrap">
            <Search size={18} className="blog-search-icon" />
            <input
              id="blog-search"
              type="text"
              className="blog-search"
              placeholder="Search articles, topics, tags…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="blog-search-clear" onClick={() => setSearch('')}>
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="blog-hero-cats">
            {CATEGORIES.map(cat => (
              <CategoryChip
                key={cat.id}
                cat={cat}
                active={activeCategory === cat.id}
                onClick={() => handleCategoryChange(cat.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="blog-body">
        {/* ── Featured Section ── */}
        {showFeatured && (
          <section className="blog-featured-section">
            <div className="blog-section-head">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span>Featured Articles</span>
            </div>
            <div className="blog-featured-grid">
              {featured.map(a => (
                <FeaturedCard key={a.id} article={a} onClick={setSelectedArticle} />
              ))}
            </div>
          </section>
        )}

        {/* ── Main Layout ── */}
        <div className="blog-main-layout">
          {/* Articles Column */}
          <div className="blog-articles-col">
            <div className="blog-articles-head">
              <div className="blog-articles-title-row">
                {hasFilters ? (
                  <>
                    <TrendingUp size={16} color="#10B981" />
                    <span>{filtered.length} Result{filtered.length !== 1 ? 's' : ''}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} color="#10B981" />
                    <span>All Articles</span>
                  </>
                )}
                {hasFilters && (
                  <button className="blog-clear-filters" onClick={clearFilters}>
                    <X size={12} /> Clear filters
                  </button>
                )}
              </div>
              {/* Active Tag */}
              {activeTag && (
                <div className="blog-active-tag">
                  <Hash size={12} /> {activeTag}
                  <button onClick={() => setActiveTag(null)}><X size={11} /></button>
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="blog-empty">
                <Search size={40} color="#CBD5E1" />
                <h3>No articles found</h3>
                <p>Try different keywords or <button onClick={clearFilters}>clear all filters</button></p>
              </div>
            ) : (
              <div className="blog-articles-list">
                {filtered.map(a => (
                  <ArticleCard key={a.id} article={a} onClick={setSelectedArticle} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategory={handleCategoryChange}
            allTags={ALL_TAGS}
            activeTag={activeTag}
            onTag={setActiveTag}
          />
        </div>
      </div>

      {/* ── Article Modal ── */}
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}
