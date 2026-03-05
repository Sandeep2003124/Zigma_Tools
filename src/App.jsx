import React, { useState, useMemo } from 'react';

const BASE_URL = 'https://ai-directory-production-dswei.ondigitalocean.app/';

const tools = [
  { name: "ChatGPT", type: "Conversational AI", url: "https://chat.openai.com", iconBg: "from-indigo-600 to-indigo-400", icon: "GPT" },
  { name: "Grok", type: "Reasoning AI", url: "https://x.ai", iconBg: "from-cyan-500 to-cyan-400", icon: "XAI" },
  { name: "Midjourney", type: "Image Generation", url: "https://midjourney.com", iconBg: "from-fuchsia-600 to-pink-500", icon: "MJ" },
  { name: "Resume Intelligence Advisor", type: "ATS Optimization", url: null, iconBg: "from-emerald-500 to-teal-400", icon: "RIA" },
  { name: "OpenAI Whisper", type: "Voice → Text", url: null, iconBg: "from-blue-600 to-cyan-500", icon: "WSP" },
  { name: "LanguageTool", type: "Grammar & Style", url: null, iconBg: "from-purple-600 to-violet-500", icon: "LT" },
  { name: "Spleeter", type: "Audio Separator", url: null, iconBg: "from-rose-500 to-pink-600", icon: "SPL" },
  { name: "AI Image Editor", type: "Local Generative Edit", url: null, iconBg: "from-amber-500 to-yellow-400", icon: "IMG" },
  { name: "Invoice Extractor", type: "OCR Data", url: null, iconBg: "from-orange-600 to-amber-500", icon: "INV" },
  { name: "AI Code Reviewer", type: "Static Analysis", url: null, iconBg: "from-indigo-500 to-blue-600", icon: "CR" },
  { name: "Face Blur", type: "Privacy Tool", url: null, iconBg: "from-gray-600 to-slate-500", icon: "FB" },
  { name: "QR Generator", type: "All Formats", url: null, iconBg: "from-green-500 to-emerald-400", icon: "QR" },
  { name: "Background Remover", type: "Offline AI", url: null, iconBg: "from-pink-500 to-rose-400", icon: "BR" },
  { name: "Image Similarity", type: "Match Engine", url: null, iconBg: "from-amber-600 to-yellow-500", icon: "IS" },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Advanced: Debounced filtering with useMemo for performance
  const filteredTools = useMemo(() => 
    tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tool.type.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="text-center mb-14 animate-fade-in">
        <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent mb-4">
          Ultimate AI Tools Control Hub
        </h2>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
          Productivity • Creativity • Automation • Privacy-first AI utilities
        </p>
        {/* Advanced: Search bar */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search tools by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-all duration-300"
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {filteredTools.map((tool, index) =>
          tool.url ? (
            <a
              key={index}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tool-card group"
            >
              <div className={`tool-icon bg-gradient-to-br ${tool.iconBg}`}>{tool.icon}</div>
              <div className="tool-name">{tool.name}</div>
              <div className="tool-type">{tool.type}</div>
            </a>
          ) : (
            <div key={index} className="tool-card group opacity-70 cursor-not-allowed">
              <div className={`tool-icon bg-gradient-to-br ${tool.iconBg}`}>{tool.icon}</div>
              <div className="tool-name">{tool.name}</div>
              <div className="tool-type">{tool.type}</div>
              <div className="text-accent text-xs mt-3 font-medium px-2 text-center">
                Coming soon
              </div>
            </div>
          )
        )}
        {filteredTools.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-8">No tools match your search. Try another term.</p>
        )}
      </div>
    </section>
  );
};

const About = () => (
  <section className="max-w-5xl mx-auto px-6 py-16">
    <div className="glass-box text-lg leading-relaxed text-center animate-fade-in">
      Zigma Neutral is a next-generation AI platform that unifies powerful tools into one privacy-first, enterprise-grade interface. Built for creators, developers, and teams who demand speed, security, and innovation.
    </div>
  </section>
);

const Contact = () => {
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    // Advanced: Real-time validation
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newData.email);
    const isValid = emailValid && newData.subject.trim().length > 0 && newData.message.trim().length > 10;
    // Set validity state if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!emailValid || formData.subject.trim().length === 0 || formData.message.trim().length < 10) {
      setStatus('Please provide a valid email, subject, and message (min 10 chars).');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setStatus(data.success ? 'Thank you! Your message has been sent.' : 'Failed: ' + data.message);
      setShowToast(true);
    } catch (err) {
      setStatus('Network error. Please try again.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <form className="glass-box space-y-6 animate-fade-in" onSubmit={handleSubmit}>
        <input
          className="input-field"
          name="email"
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="input-field"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          className="input-field min-h-[160px]"
          name="message"
          placeholder="Your message (min 10 characters)..."
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 shadow-glow-lg flex items-center justify-center ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-accent hover:shadow-glow-lg hover:scale-105'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            'Send Message →'
          )}
        </button>
      </form>

      {/* Advanced: Toast notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-glow-lg max-w-sm w-full transition-all duration-300 ${
          status.includes('Thank') ? 'bg-green-600/90 backdrop-blur-xl' : 'bg-red-600/90 backdrop-blur-xl'
        }`}>
          {status}
          <button onClick={() => setShowToast(false)} className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100">×</button>
        </div>
      )}
    </section>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const showPage = (id) => {
    setCurrentPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Base URL badge */}
      <div className="fixed top-3 right-3 z-50 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-sm animate-pulse-glow">
        <span className="text-primary font-semibold">Base URL:</span>{' '}
        <code className="text-accent text-xs break-all">{BASE_URL}</code>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
            Zigma Neutral
          </h1>
          <div className="flex gap-6 font-medium">
            <button onClick={() => showPage('home')} className="hover:text-accent transition-all duration-300 hover:scale-105">Home</button>
            <button onClick={() => showPage('about')} className="hover:text-accent transition-all duration-300 hover:scale-105">About</button>
            <button onClick={() => showPage('contact')} className="hover:text-accent transition-all duration-300 hover:scale-105">Contact</button>
          </div>
        </div>
      </nav>

      {/* Pages */}
      {currentPage === 'home' && <Home />}
      {currentPage === 'about' && <About />}
      {currentPage === 'contact' && <Contact />}

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-10 text-center text-gray-500 text-sm">
        © 2025 – 2026 Zigma Neutral • Built with ❤️ for AI innovators
      </footer>
    </>
  );
}

export default App;
