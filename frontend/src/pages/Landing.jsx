import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    { icon: "📊", title: "Real-time Monitoring", desc: "Track emissions across multiple mine sites with accurate analytics." },
    { icon: "🌱", title: "Emission Analytics", desc: "Industry-standard emission factors for precise calculations." },
    { icon: "📈", title: "Detailed Reports", desc: "Generate comprehensive reports and visualizations." },
    { icon: "🎯", title: "Compliance Tracking", desc: "Stay compliant with environmental regulations effortlessly." }
  ];

  const faqs = [
    { q: "What is GreenMine?", a: "A carbon footprint monitoring platform for coal mining operations." },
    { q: "How accurate are calculations?", a: "We use industry-standard emission factors for highly accurate results." },
    { q: "Can I manage multiple mines?", a: "Yes, admins can monitor multiple sites from one dashboard." }
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Header */}
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold font-['Playfair_Display']">GreenMine</div>
          <div className="hidden md:flex gap-8 text-gray-700">
            <a href="#features" className="hover:text-emerald-600 transition">Features</a>
            <a href="#how" className="hover:text-emerald-600 transition">How it Works</a>
            <a href="#faq" className="hover:text-emerald-600 transition">FAQ</a>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="px-5 py-2 text-emerald-600 font-medium">Login</Link>
            <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition">
              Get Started
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 font-['Playfair_Display'] leading-tight">
            Carbon Footprint
            <span className="block bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Monitoring for Mines</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Track, analyze, and reduce your coal mine's carbon emissions with real-time analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition">
              Start Monitoring
            </Link>
            <a href="#features" className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-emerald-500 transition">
              Learn More
            </a>
          </div>
        </motion.div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-['Playfair_Display']">Powerful Features</h2>
            <p className="text-gray-600 text-lg">Monitor and reduce your mining operation's carbon footprint</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-gray-100 hover:border-emerald-200">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-['Playfair_Display']">How It Works</h2>
            <p className="text-gray-600 text-lg mb-16">Get started in four simple steps</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {["Register Your Mine", "Input Data", "Track Emissions", "Generate Reports"].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-emerald-200">
                <div className="text-5xl font-bold text-emerald-200 mb-3 font-['Playfair_Display']">0{i + 1}</div>
                <h3 className="text-lg font-semibold text-black">{step}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-50 to-teal-50">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-['Playfair_Display']">About GreenMine</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            GreenMine is a comprehensive carbon footprint monitoring solution for the coal mining industry. 
            We leverage industry-standard emission factors to provide accurate, real-time calculations of your 
            operation's environmental impact with intuitive analytics and detailed reporting.
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-['Playfair_Display']">FAQ</h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white rounded-xl border border-gray-200">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50">
                  <span className="font-semibold text-black">{faq.q}</span>
                  <span className="text-2xl text-emerald-600" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>+</span>
                </button>
                <motion.div initial={false} animate={{ height: openFaq === i ? "auto" : 0 }} className="overflow-hidden">
                  <div className="px-6 pb-5 text-gray-600">{faq.a}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold font-['Playfair_Display'] mb-4">GreenMine</h3>
            <p className="text-gray-400">Empowering coal mines with sustainable carbon monitoring.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-emerald-400 transition">Features</a></li>
              <li><a href="#how" className="hover:text-emerald-400 transition">How it Works</a></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">info@greenmine.com</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 GreenMine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;