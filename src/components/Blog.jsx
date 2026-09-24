import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Tag } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    title: 'How to Understand Your Salary Slip',
    excerpt: 'A comprehensive guide to understanding the various components of your salary slip, including basic pay, HRA, and deductions.',
    date: 'Sep 23, 2026',
    readTime: '5 min read',
    category: 'Finance',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Tax Saving Tips for Salaried Employees',
    excerpt: 'Maximize your take-home salary with these proven tax-saving strategies under Section 80C, 80D, and more.',
    date: 'Sep 18, 2026',
    readTime: '7 min read',
    category: 'Taxation',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'Why Automation is the Future of HR',
    excerpt: 'Discover how automated payroll systems and salary slip generators are saving businesses time and reducing errors.',
    date: 'Sep 10, 2026',
    readTime: '4 min read',
    category: 'HR Tech',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Blog() {
  return (
    <div className="blog-page">
      <header className="header">
        <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>
          <div className="header-logo-icon">
            <ArrowLeft size={20} color="#fff" />
          </div>
          <span className="header-logo-text">Back to Generator</span>
        </Link>
      </header>
      
      <main className="main-content">
        <div className="hero blog-hero">
          <h1>Latest Insights & Articles</h1>
          <p>Expert advice on payroll, taxation, and HR management to help you stay ahead.</p>
        </div>

        <div className="blog-grid">
          {POSTS.map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-image">
                <img src={post.image} alt={post.title} loading="lazy" />
                <span className="blog-category">
                  <Tag size={12} /> {post.category}
                </span>
              </div>
              <div className="blog-card-content">
                <div className="blog-meta">
                  <span><BookOpen size={14} /> {post.date}</span>
                  <span><Clock size={14} /> {post.readTime}</span>
                </div>
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <button className="btn btn-secondary blog-read-more">Read Article</button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
