import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Users, Zap, Github, Code2, Calendar, Trophy, Shield, Globe, MessageSquare, ChevronRight, BookOpen, ShoppingCart, Linkedin, Youtube, Instagram, Play, Clock } from 'lucide-react';
import { BLOGS, PROJECTS, EVENTS, PARTNERS, BOOKS, VIDEOS } from '../constants';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-gold/20 text-gold text-xs font-bold mb-6">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            OPEN SOURCE ECOSYSTEM
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            Build. Break. Rebuild. <br />
            <span className="text-gradient-gold">Learn.</span>
          </h1>
          <p className="text-lg text-white/60 max-w-lg mb-10 leading-relaxed">
            RootSprout is a free, open-source platform that helps students and developers build low-level systems from scratch to understand the internals of high-level production systems.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/projects" className="bg-gold text-black-deep px-8 py-4 rounded-full font-bold flex items-center gap-2 glow-gold hover:glow-gold-strong transition-all group">
              Explore Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/community" className="glass px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
              Join Community
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 glass rounded-3xl p-8 border-gold/20 glow-gold">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-xs font-mono text-white/40">rootsprout --version 2.0.0</div>
            </div>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex gap-4">
                <span className="text-gold">$</span>
                <span className="text-white/80">npm install @rootsprout/core</span>
              </div>
              <div className="text-white/40 pl-8">... installing dependencies</div>
              <div className="text-green-400 pl-8">✓ Success: Core engine initialized</div>
              <div className="flex gap-4">
                <span className="text-gold">$</span>
                <span className="text-white/80">rootsprout start --community</span>
              </div>
              <div className="text-gold/80 pl-8 animate-pulse">🚀 Launching ecosystem hub...</div>
            </div>
          </div>
          
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 glass p-4 rounded-2xl border-gold/30 z-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                <Star className="text-gold w-5 h-5 fill-gold" />
              </div>
              <div>
                <div className="text-xs text-white/40">Total Stars</div>
                <div className="text-lg font-bold">100+</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -left-10 glass p-4 rounded-2xl border-gold/30 z-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                <Users className="text-gold w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-white/40">Members</div>
                <div className="text-lg font-bold">500+</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const formatStars = (stars?: number) => {
    if (stars === undefined) return '—';
    if (stars < 1000) return `${stars}`;
    return `${(stars / 1000).toFixed(1)}k`;
  };

  return (
    <>
      <Hero />
      <section id="books" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Rootsprout <span className="text-gold">Originals</span></h2>
              <p className="text-white/60">Exclusive books and publications from our community.</p>
            </div>
            <Link to="/books" className="hidden md:flex items-center gap-2 text-gold font-bold hover:gap-3 transition-all">
              Explore Originals <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {BOOKS.slice(0, 3).map((book) => (
              <motion.div 
                key={book.id}
                whileHover={{ y: -10 }}
                className="group glass rounded-2xl overflow-hidden border-white/5 hover:border-gold/30 transition-all"
              >
                <div className="aspect-[2/3] overflow-hidden relative">
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex items-center gap-1 bg-black-deep/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-gold">
                      <Star className="w-3 h-3 fill-gold" /> {book.rating}
                    </div>
                    <div className="text-white font-bold">{book.price}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{book.title}</h3>
                  <p className="text-xs text-white/40 mb-4">By {book.author}</p>
                  <a
                    href={book.buyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-sm hover:bg-gold hover:text-black-deep hover:border-gold transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Get Copy
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="blogs" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Latest <span className="text-gold">Insights</span></h2>
              <p className="text-white/60">Stay updated with the latest trends in open source.</p>
            </div>
            <Link to="/blogs" className="hidden md:flex items-center gap-2 text-gold font-bold hover:gap-3 transition-all">
              View all blogs <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {BLOGS.slice(0, 3).map((blog) => (
              <motion.div 
                key={blog.id}
                whileHover={{ y: -10 }}
                className="group glass rounded-2xl overflow-hidden border-white/5 hover:border-gold/30 transition-all"
              >
                <a href={blog.link} target="_blank" rel="noreferrer" className="block">
                  <div className="aspect-video overflow-hidden relative">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {blog.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-black-deep/60 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                </a>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                    <span>{blog.author}</span>
                    <span>•</span>
                    <span>{blog.readTime} read</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>
                  <a href={blog.link} target="_blank" rel="noreferrer">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-gold transition-colors">{blog.title}</h3>
                  </a>
                  <a href={blog.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-white/60 group-hover:text-white transition-colors">
                    Read More <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link to="/blogs" className="px-6 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-gold hover:text-black-deep hover:border-gold transition-all">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      <section id="videos" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Latest <span className="text-gold">Videos</span></h2>
              <p className="text-white/60">Short sessions focused on building real systems from scratch.</p>
            </div>
            <Link to="/videos" className="hidden md:flex items-center gap-2 text-gold font-bold hover:gap-3 transition-all">
              View all videos <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {VIDEOS.slice(0, 3).map((video) => (
              <motion.a
                key={video.id}
                href={video.link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -10 }}
                className="group glass rounded-2xl overflow-hidden border-white/5 hover:border-gold/30 transition-all"
              >
                <div className="aspect-video relative bg-black-soft/80 flex items-center justify-center overflow-hidden">
                  {video.image && (
                    <img
                      src={video.image}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-grid opacity-10" />
                  <div className="w-14 h-14 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 text-gold" />
                  </div>
                  <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black-deep/70 text-xs text-white/70 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-gold font-bold uppercase tracking-widest mb-2">{video.date}</div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">{video.title}</h3>
                  <p className="text-sm text-white/50 line-clamp-2">{video.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
          <div className="mt-10 flex justify-center md:hidden">
            <Link to="/videos" className="px-6 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-gold hover:text-black-deep hover:border-gold transition-all">
              View All Videos
            </Link>
          </div>
        </div>
      </section>

      <section id="projects" className="py-24 bg-black-soft/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured <span className="text-gold">Projects</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto">Discover high-impact open source projects maintained by the Rootsprout community.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PROJECTS.slice(0, 3).map((project) => (
              <div key={project.id} className="glass p-6 rounded-2xl border-white/5 hover:border-gold/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Github className="w-16 h-16" /></div>
                {project.image && (
                  <div className="aspect-[4/3] mb-4 rounded-xl overflow-hidden border border-white/10">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-gold/10 transition-colors"><Code2 className="text-gold w-6 h-6" /></div>
                  {project.trending && <span className="px-2 py-1 bg-gold/10 text-gold text-[10px] font-bold rounded-full border border-gold/20">TRENDING</span>}
                </div>
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-sm text-white/50 mb-6 line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/40 mb-6">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gold" />{project.language}</div>
                  <div className="flex items-center gap-1"><Star className="w-3 h-3" />{formatStars(project.stars)}</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{project.contributors ?? '—'}</div>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl border border-white/10 font-bold text-sm hover:bg-gold hover:text-black-deep hover:border-gold transition-all text-center block"
                >
                  Contribute Now
                </a>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link to="/projects" className="px-6 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-gold hover:text-black-deep hover:border-gold transition-all">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      <section id="events" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6"><span className="text-gold">Events</span></h2>
              <p className="text-white/60 mb-8">Join our global community in person or virtually. Learn, network, and build together.</p>
              <div className="space-y-6">
                {EVENTS.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex gap-6 group cursor-pointer">
                    <div className="flex-shrink-0 w-16 h-16 glass rounded-2xl flex flex-col items-center justify-center border-gold/20 group-hover:bg-gold group-hover:text-black-deep transition-all"><Calendar className="w-6 h-6 mb-1" /></div>
                    <div>
                      <div className="text-gold text-xs font-bold uppercase tracking-widest mb-1">{event.type}</div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-gold transition-colors">{event.title}</h3>
                      <div className="text-sm text-white/40">{event.date} • {event.location}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/events" className="px-6 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-gold hover:text-black-deep hover:border-gold transition-all inline-block">
                  View All Events
                </Link>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-square glass rounded-3xl overflow-hidden border-gold/20 p-2">
                <img src={EVENTS[0]?.image} alt="Event" className="w-full h-full object-cover rounded-2xl opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10">
                  <div className="glass p-6 rounded-2xl border-white/10">
                    <h4 className="text-xl font-bold mb-2">{EVENTS[0]?.title}</h4>
                    <p className="text-sm text-white/60 mb-4">{EVENTS[0]?.date} • {EVENTS[0]?.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="partners" className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-white/30 uppercase tracking-[0.3em] mb-12">Our Community Partnerships</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-40 hover:opacity-100 transition-opacity">
            {PARTNERS.map((partner) => (
              <div key={partner.id} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer">
                <img src={partner.logo} alt={partner.name} className="h-16 max-w-[160px] object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass rounded-[40px] p-8 md:p-12 border-gold/10 relative overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Join the <span className="text-gradient-gold">Rootsprout</span> <br className="hidden lg:block" />Revolution.</h2>
                <p className="text-lg text-white/60 mb-10">Whether you're a seasoned maintainer or just starting your coding journey, there's a place for you in our growing ecosystem.</p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <a
                    href="https://github.com/RootSprout"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gold text-black-deep px-8 py-4 rounded-full font-bold flex items-center gap-2 glow-gold"
                  >
                    Join Github <Github className="w-5 h-5" />
                  </a>
                  <button className="glass px-8 py-4 rounded-full font-bold">Contribute Now</button>
                </div>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/60 justify-center lg:justify-start">
                  <a href="https://github.com/RootSprout" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Github className="w-4 h-4 text-gold" /> github.com/RootSprout
                  </a>
                  <a href="https://www.linkedin.com/company/root-sprout" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4 text-gold" /> LinkedIn
                  </a>
                  <a href="https://www.youtube.com/@meerthika" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Youtube className="w-4 h-4 text-gold" /> youtube.com/@meerthika
                  </a>
                  <a href="https://www.instagram.com/rootsprouthub/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Instagram className="w-4 h-4 text-gold" /> instagram.com/rootsprouthub
                  </a>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/10">
                      <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center mb-4"><Shield className="text-gold w-5 h-5" /></div>
                      <div className="font-bold mb-1">Open Source First</div>
                      <div className="text-xs text-white/40">Build in the open, learn in public, and grow together.</div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-12">
                    <div className="glass p-6 rounded-3xl border-white/10">
                      <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center mb-4"><Zap className="text-gold w-5 h-5" /></div>
                      <div className="font-bold mb-1">Build From Scratch</div>
                      <div className="text-xs text-white/40">Learn fundamentals by rebuilding real systems end to end.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sponsorship" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass border border-white/10 rounded-3xl p-10 md:p-14 grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div>
              <div className="text-xs text-gold font-bold uppercase tracking-widest mb-3">Sponsorship</div>
              <h2 className="text-4xl font-bold mb-4">Support the next wave of builders</h2>
              <p className="text-white/60 mb-6">
                Support Rootsprout and help power real-world systems education, community events, and open-source learning.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/sponsorship"
                  className="px-6 py-3 rounded-full bg-gold text-black-deep text-sm font-bold hover:glow-gold-strong transition-all"
                >
                  Become a Sponsor
                </Link>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScxFDu-jxxNVz4DlDkYhsJIh9BA1-8tmJdz1JIsBPIui1OKwg/viewform?usp=publish-editor"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-gold hover:text-black-deep hover:border-gold transition-all"
                >
                  Open the Form
                </a>
              </div>
            </div>
            <div className="glass border border-white/10 rounded-2xl overflow-hidden bg-black-soft/60">
              <div className="p-6">
                <div className="text-sm text-white/60">Sponsorship</div>
                <div className="text-xl font-bold mt-2">Support Rootsprout</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
