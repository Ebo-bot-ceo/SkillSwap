import { useState, useEffect, useRef } from "react";

const SEED_USERS = [
  { id: 1, name: "Ama Owusu", location: "Accra, Ghana", avatar: "AO", color: "#E8A87C",
    teaches: ["Graphic Design", "Canva", "Branding"], learns: ["Python", "Web Development"],
    bio: "Freelance designer with 4 years experience. Love sharing creative skills.", sessions: 12, rating: 4.9 },
  { id: 2, name: "Kwame Asante", location: "Kumasi, Ghana", avatar: "KA", color: "#85C1E9",
    teaches: ["Python", "Data Analysis", "Excel"], learns: ["Guitar", "French"],
    bio: "Data analyst by day, aspiring musician by night. Happy to teach coding basics.", sessions: 8, rating: 4.7 },
  { id: 3, name: "Efua Mensah", location: "Tema, Ghana", avatar: "EM", color: "#A9DFBF",
    teaches: ["French", "Spanish", "English Writing"], learns: ["Photography", "Video Editing"],
    bio: "Polyglot and language tutor. I believe communication opens every door.", sessions: 21, rating: 5.0 },
  { id: 4, name: "Kofi Boateng", location: "Accra, Ghana", avatar: "KB", color: "#F1948A",
    teaches: ["Photography", "Lightroom", "Storytelling"], learns: ["Business Strategy", "Marketing"],
    bio: "Visual storyteller and content creator. Let's swap skills and grow together.", sessions: 5, rating: 4.8 },
  { id: 5, name: "Abena Kyei", location: "Takoradi, Ghana", avatar: "AK", color: "#C39BD3",
    teaches: ["Baking", "Meal Prep", "Nutrition"], learns: ["Social Media", "Canva"],
    bio: "Home baker turned small business owner. Food is my love language.", sessions: 14, rating: 4.9 },
  { id: 6, name: "Yaw Darko", location: "Accra, Ghana", avatar: "YD", color: "#F9E79F",
    teaches: ["Guitar", "Music Theory", "Afrobeats Production"], learns: ["Python", "App Development"],
    bio: "Music teacher and producer. 10 years playing, always learning something new.", sessions: 18, rating: 4.6 },
];

const SEED_MESSAGES = {
  1: [
    { from: "them", text: "Hey! I saw you want to learn Python. I'd love to swap — I need Canva help badly 😅", time: "10:22 AM" },
    { from: "me", text: "That's perfect! I've been using Canva for 3 years. Let's set something up.", time: "10:45 AM" },
    { from: "them", text: "Amazing! How about a 1hr session this weekend?", time: "10:46 AM" },
  ],
  3: [
    { from: "them", text: "Bonjour! I heard you're looking to learn French 🇫🇷", time: "Yesterday" },
    { from: "me", text: "Yes! And I saw you need help with Photography — I can definitely help there.", time: "Yesterday" },
  ],
};

export default function SkillSwap() {
  const [screen, setScreen] = useState("home");
  const [myProfile, setMyProfile] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [form, setForm] = useState({ name: "", location: "", bio: "", teaches: [], learns: [], teachInput: "", learnInput: "" });
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([1, 3]);
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [toast, setToast] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, messages]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addTag = (field, inputField, val) => {
    if (!val.trim()) return;
    if (form[field].includes(val.trim())) return;
    setForm(f => ({ ...f, [field]: [...f[field], val.trim()], [inputField]: "" }));
  };
  const removeTag = (field, idx) => setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));

  const getMatches = () => {
    if (!myProfile) return SEED_USERS.slice(0, 3);
    return SEED_USERS.filter(u => {
      const overlap1 = myProfile.teaches.some(t => u.learns.some(l => l.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(l.toLowerCase())));
      const overlap2 = myProfile.learns.some(l => u.teaches.some(t => t.toLowerCase().includes(l.toLowerCase()) || l.toLowerCase().includes(t.toLowerCase())));
      return overlap1 || overlap2;
    });
  };

  const sendRequest = (userId) => {
    setSentRequests(r => [...r, userId]);
    showToast("Swap request sent! 🎉");
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(m => ({
      ...m,
      [activeChatId]: [...(m[activeChatId] || []), { from: "me", text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]
    }));
    setChatInput("");
  };

  const goTo = (s) => { setScreen(s); setMobileNav(false); };

  const filtered = SEED_USERS.filter(u => {
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.teaches.some(s => s.toLowerCase().includes(q)) || u.learns.some(s => s.toLowerCase().includes(q)) || u.location.toLowerCase().includes(q);
  });

  // ─── STYLES ───
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0D0F14; --surface: #13161E; --border: #1E2230; --border2: #2A2F40;
      --text: #F0EEE8; --muted: #888; --faint: #555;
      --accent: #C8F560; --accent-dark: #0D0F14; --blue: #85C1E9;
      --radius: 16px; --radius-sm: 10px; --radius-pill: 100px;
    }
    body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; -webkit-font-smoothing: antialiased; }
    button { font-family: inherit; cursor: pointer; transition: all 0.18s; }
    input, textarea { font-family: inherit; }
    input:focus, textarea:focus { outline: none; }

    /* NAV */
    .nav { display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 64px; border-bottom: 1px solid var(--border); background: rgba(13,15,20,0.95); backdrop-filter: blur(16px); position: sticky; top: 0; z-index: 100; }
    .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
    .logo em { font-style: normal; color: var(--accent); }
    .nav-links { display: flex; gap: 4px; align-items: center; }
    .nav-links button { background: none; border: none; color: var(--muted); font-size: 14px; padding: 7px 14px; border-radius: var(--radius-pill); font-weight: 500; }
    .nav-links button:hover { color: var(--text); background: var(--surface); }
    .nav-links button.active { color: var(--text); background: var(--border); }
    .nav-links button.cta { background: var(--accent); color: var(--accent-dark); font-weight: 700; }
    .nav-links button.cta:hover { background: #d4f77a; }
    .hamburger { display: none; background: none; border: none; color: var(--text); padding: 8px; }
    @media (max-width: 600px) {
      .nav-links { display: none; }
      .hamburger { display: flex; flex-direction: column; gap: 5px; align-items: center; justify-content: center; }
      .ham-line { width: 22px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.2s; }
    }

    /* MOBILE DRAWER */
    .drawer-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; }
    .drawer-overlay.open { display: block; }
    .drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 260px; background: var(--surface); border-left: 1px solid var(--border); z-index: 201; padding: 24px; transform: translateX(100%); transition: transform 0.3s ease; }
    .drawer.open { transform: translateX(0); }
    .drawer-links { display: flex; flex-direction: column; gap: 4px; margin-top: 48px; }
    .drawer-links button { background: none; border: none; color: var(--muted); font-size: 16px; padding: 12px 16px; border-radius: var(--radius-sm); text-align: left; font-weight: 500; }
    .drawer-links button:hover, .drawer-links button.active { color: var(--text); background: var(--border); }
    .drawer-links button.cta { background: var(--accent); color: var(--accent-dark); margin-top: 12px; font-weight: 700; }
    .close-drawer { position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--muted); font-size: 22px; }

    /* LAYOUT */
    .page { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }
    .page-narrow { max-width: 640px; margin: 0 auto; padding: 40px 24px 80px; }

    /* HOME */
    .hero { text-align: center; padding: 72px 24px 56px; max-width: 780px; margin: 0 auto; }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-pill); padding: 6px 16px; font-size: 13px; color: var(--muted); margin-bottom: 32px; }
    .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
    .hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(38px, 8vw, 76px); font-weight: 800; line-height: 1.0; letter-spacing: -2px; margin-bottom: 20px; }
    .hero h1 em { font-style: normal; color: var(--accent); }
    .hero p { font-size: 17px; color: var(--muted); line-height: 1.7; max-width: 520px; margin: 0 auto 40px; }
    .btn-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn-primary { background: var(--accent); color: var(--accent-dark); border: none; padding: 13px 28px; border-radius: var(--radius-pill); font-weight: 700; font-size: 15px; }
    .btn-primary:hover { background: #d4f77a; transform: translateY(-1px); }
    .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--text); padding: 13px 28px; border-radius: var(--radius-pill); font-weight: 500; font-size: 15px; }
    .btn-ghost:hover { border-color: #555; background: var(--surface); }
    .btn-sm { padding: 8px 16px; font-size: 13px; border-radius: var(--radius-pill); border: none; font-weight: 600; }
    .btn-sm.primary { background: var(--accent); color: var(--accent-dark); }
    .btn-sm.primary:hover { background: #d4f77a; }
    .btn-sm.outline { background: none; border: 1px solid var(--border2); color: var(--text); }
    .btn-sm.outline:hover { border-color: #555; }
    .btn-sm.disabled { background: var(--border); color: var(--faint); cursor: default; }
    .btn-full { width: 100%; padding: 14px; border-radius: var(--radius-pill); font-size: 15px; font-weight: 700; border: none; }
    .btn-full.primary { background: var(--accent); color: var(--accent-dark); }
    .btn-full.primary:hover { background: #d4f77a; }

    .stats { display: flex; justify-content: center; gap: 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .stat { flex: 1; text-align: center; padding: 32px 16px; border-right: 1px solid var(--border); }
    .stat:last-child { border-right: none; }
    .stat-n { font-family: 'Syne', sans-serif; font-size: clamp(24px, 5vw, 36px); font-weight: 800; color: var(--accent); }
    .stat-l { font-size: 12px; color: var(--muted); margin-top: 4px; }
    @media (max-width: 480px) { .stat { padding: 20px 8px; } .stat-n { font-size: 22px; } .stat-l { font-size: 11px; } }

    /* SECTION */
    .section-hd { margin-bottom: 24px; }
    .section-hd h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }
    .section-hd p { color: var(--muted); font-size: 14px; margin-top: 4px; }
    .divider { height: 1px; background: var(--border); margin: 48px 0; }

    /* CARDS GRID */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    @media (max-width: 480px) { .grid { grid-template-columns: 1fr; } }

    /* USER CARD */
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px; position: relative; overflow: hidden; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
    .card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
    .card-top-bar { height: 3px; border-radius: 20px 20px 0 0; position: absolute; top: 0; left: 0; right: 0; }
    .card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .av { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #0D0F14; flex-shrink: 0; }
    .av-lg { width: 64px; height: 64px; border-radius: 16px; font-size: 20px; }
    .card-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; line-height: 1.2; }
    .card-loc { font-size: 12px; color: var(--faint); margin-top: 2px; }
    .card-bio { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .skills-block { margin-bottom: 10px; }
    .skills-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--faint); font-weight: 700; margin-bottom: 5px; }
    .tags { display: flex; flex-wrap: wrap; gap: 5px; }
    .tag { font-size: 12px; padding: 3px 9px; border-radius: var(--radius-pill); font-weight: 500; }
    .tag.teach { background: #1a2e1a; color: var(--accent); border: 1px solid #2a4a2a; }
    .tag.learn { background: #1a1f2e; color: var(--blue); border: 1px solid #1a2540; }
    .tag.neutral { background: var(--border); color: var(--muted); }
    .card-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border); gap: 8px; }
    .rating-txt { font-size: 12px; color: var(--muted); white-space: nowrap; }
    .rating-txt strong { color: var(--accent); }
    .match-pip { position: absolute; top: 14px; right: 14px; background: var(--accent); color: var(--accent-dark); font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: var(--radius-pill); text-transform: uppercase; letter-spacing: 0.5px; }
    .connected-pip { position: absolute; top: 14px; right: 14px; background: #1a3a1a; color: var(--accent); border: 1px solid #2a5a2a; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: var(--radius-pill); }

    /* SEARCH */
    .search-wrap { margin-bottom: 20px; }
    .search-input { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-pill); padding: 11px 20px; color: var(--text); font-size: 14px; transition: border-color 0.2s; }
    .search-input:focus { border-color: var(--accent); }
    .search-input::placeholder { color: var(--faint); }

    /* PROFILE DETAIL */
    .prof-hero { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; margin-bottom: 16px; }
    .prof-top { display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap; }
    .prof-name { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; margin-bottom: 4px; }
    .prof-meta { font-size: 13px; color: var(--muted); margin-bottom: 10px; }
    .prof-bio { font-size: 14px; color: #bbb; line-height: 1.7; }
    .info-box { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 12px; }
    .info-box-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--faint); margin-bottom: 12px; }

    /* FORM */
    .form-group { margin-bottom: 18px; }
    .form-label { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px; display: block; }
    .form-input { width: 100%; background: #0D0F14; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 11px 14px; color: var(--text); font-size: 14px; transition: border-color 0.2s; }
    .form-input:focus { border-color: var(--accent); }
    .form-input::placeholder { color: var(--faint); }
    .form-textarea { resize: none; height: 80px; }
    .tag-row { display: flex; gap: 8px; }
    .add-tag-btn { background: var(--accent); color: var(--accent-dark); border: none; border-radius: var(--radius-sm); padding: 0 16px; font-size: 20px; font-weight: 700; flex-shrink: 0; }
    .add-tag-btn:hover { background: #d4f77a; }
    .tag-rm { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 4px 8px 4px 10px; border-radius: var(--radius-pill); cursor: pointer; user-select: none; }
    .tag-rm .x { opacity: 0.6; font-size: 14px; line-height: 1; }
    .step-bar { display: flex; gap: 6px; margin-bottom: 28px; }
    .step-seg { flex: 1; height: 3px; border-radius: 3px; background: var(--border); transition: background 0.3s; }
    .step-seg.done { background: var(--accent); }
    .back-btn { background: none; border: 1px solid var(--border); color: var(--muted); border-radius: var(--radius-pill); padding: 11px 20px; font-size: 14px; }
    .back-btn:hover { border-color: var(--border2); color: var(--text); }

    /* MESSAGES */
    .msg-layout { display: flex; height: calc(100vh - 120px); gap: 0; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
    .msg-sidebar { width: 260px; flex-shrink: 0; border-right: 1px solid var(--border); overflow-y: auto; }
    .msg-sidebar-hd { padding: 18px 16px 12px; border-bottom: 1px solid var(--border); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
    .msg-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--border); }
    .msg-item:hover { background: var(--border); }
    .msg-item.active { background: #1a2e1a; }
    .msg-item-info { flex: 1; min-width: 0; }
    .msg-item-name { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .msg-item-preview { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
    .chat-area { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .chat-hd { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
    .chat-hd-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; }
    .chat-hd-sub { font-size: 12px; color: var(--muted); }
    .chat-msgs { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .msg-bubble { max-width: 72%; padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; }
    .msg-bubble.them { background: var(--border); color: var(--text); border-bottom-left-radius: 4px; align-self: flex-start; }
    .msg-bubble.me { background: var(--accent); color: var(--accent-dark); border-bottom-right-radius: 4px; align-self: flex-end; }
    .msg-time { font-size: 10px; color: var(--faint); margin-top: 3px; }
    .msg-time.right { text-align: right; }
    .chat-input-row { padding: 14px 16px; border-top: 1px solid var(--border); display: flex; gap: 8px; }
    .chat-input { flex: 1; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-pill); padding: 10px 16px; color: var(--text); font-size: 14px; }
    .chat-input:focus { border-color: var(--accent); }
    .send-btn { background: var(--accent); color: var(--accent-dark); border: none; border-radius: var(--radius-pill); padding: 10px 18px; font-weight: 700; font-size: 14px; }
    .send-btn:hover { background: #d4f77a; }
    .chat-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--faint); font-size: 14px; text-align: center; padding: 32px; }
    @media (max-width: 600px) {
      .msg-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); }
      .msg-layout { flex-direction: column; height: auto; }
      .chat-area { display: none; }
      .chat-area.mobile-open { display: flex; height: calc(100vh - 200px); }
      .msg-sidebar.mobile-hide { display: none; }
    }

    /* SUCCESS */
    .success-wrap { text-align: center; padding: 60px 24px; }
    .success-icon { width: 72px; height: 72px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; }

    /* TOAST */
    .toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); padding: 11px 22px; border-radius: var(--radius-pill); font-weight: 600; font-size: 14px; z-index: 999; white-space: nowrap; animation: toastIn 0.3s ease; }
    .toast.success { background: var(--accent); color: var(--accent-dark); }
    .toast.error { background: #F1948A; color: #0D0F14; }
    @keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(12px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

    /* EMPTY */
    .empty { text-align: center; padding: 64px 24px; color: var(--faint); }
    .empty-icon { font-size: 40px; margin-bottom: 14px; }
    .empty p { font-size: 14px; line-height: 1.6; }
  `;

  // ── USER CARD ──
  const UserCard = ({ user, isMatch }) => {
    const isConnected = connections.includes(user.id);
    const isPending = sentRequests.includes(user.id);
    return (
      <div className="card" style={{ cursor: "pointer" }}>
        <div className="card-top-bar" style={{ background: user.color }}></div>
        {isMatch && !isConnected && <div className="match-pip">Match</div>}
        {isConnected && <div className="connected-pip">✓ Connected</div>}
        <div className="card-head" onClick={() => { setSelectedUser(user); setScreen("view"); }}>
          <div className="av" style={{ background: user.color }}>{user.avatar}</div>
          <div>
            <div className="card-name">{user.name}</div>
            <div className="card-loc">📍 {user.location}</div>
          </div>
        </div>
        <div className="card-bio" onClick={() => { setSelectedUser(user); setScreen("view"); }}>{user.bio}</div>
        <div className="skills-block">
          <div className="skills-lbl">Teaches</div>
          <div className="tags">{user.teaches.map(s => <span key={s} className="tag teach">{s}</span>)}</div>
        </div>
        <div className="skills-block" style={{ marginTop: 8 }}>
          <div className="skills-lbl">Wants to learn</div>
          <div className="tags">{user.learns.map(s => <span key={s} className="tag learn">{s}</span>)}</div>
        </div>
        <div className="card-foot">
          <div className="rating-txt">
            {user.rating ? <><strong>★ {user.rating}</strong> · {user.sessions} sessions</> : "New member"}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {isConnected && (
              <button className="btn-sm outline" onClick={() => { setActiveChatId(user.id); setScreen("messages"); }}>Message</button>
            )}
            {!isConnected && (
              isPending
                ? <button className="btn-sm disabled" disabled>Pending…</button>
                : <button className="btn-sm primary" onClick={() => sendRequest(user.id)}>Connect</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── SCREENS ──
  const HomeScreen = () => (
    <div>
      <div className="hero">
        <div className="badge"><span className="badge-dot"></span>No money. Pure skill.</div>
        <h1>Swap skills,<br /><em>grow together.</em></h1>
        <p>Connect with people who teach what you want to learn — and want to learn what you teach. Free, forever.</p>
        <div className="btn-row">
          <button className="btn-primary" onClick={() => myProfile ? goTo("matches") : goTo("join")}>
            {myProfile ? "See My Matches" : "Join Free"}
          </button>
          <button className="btn-ghost" onClick={() => goTo("browse")}>Browse Skills</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-n">340+</div><div className="stat-l">Members</div></div>
        <div className="stat"><div className="stat-n">1,200+</div><div className="stat-l">Sessions</div></div>
        <div className="stat"><div className="stat-n">80+</div><div className="stat-l">Skills</div></div>
        <div className="stat"><div className="stat-n">4.9★</div><div className="stat-l">Avg Rating</div></div>
      </div>

      <div className="page">
        <div className="section-hd"><h2>Meet some members</h2><p>Real people swapping real skills</p></div>
        <div className="grid">
          {SEED_USERS.slice(0, 3).map(u => <UserCard key={u.id} user={u} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button className="btn-ghost" onClick={() => goTo("browse")}>View all members →</button>
        </div>
      </div>
    </div>
  );

  const BrowseScreen = () => (
    <div className="page">
      <div className="section-hd"><h2>Browse Members</h2><p>Find your next skill swap partner</p></div>
      <div className="search-wrap">
        <input className="search-input" placeholder="🔍  Search by name, skill, or location…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0
        ? <div className="empty"><div className="empty-icon">🔍</div><p>No members match "{search}".<br />Try a different keyword.</p></div>
        : <div className="grid">{filtered.map(u => <UserCard key={u.id} user={u} />)}</div>
      }
    </div>
  );

  const MatchesScreen = () => {
    const matches = getMatches();
    return (
      <div className="page">
        <div className="section-hd">
          <h2>Your Matches ✦</h2>
          <p>{myProfile ? "People whose skills align with yours" : "Create a profile to see personalised matches"}</p>
        </div>
        {!myProfile ? (
          <div className="empty">
            <div className="empty-icon">🤝</div>
            <p style={{ marginBottom: 20 }}>Set up your profile so we can find your best skill swap partners.</p>
            <button className="btn-primary" onClick={() => goTo("join")}>Create Profile</button>
          </div>
        ) : matches.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">💭</div>
            <p>No matches yet — try adding more skills to your profile.</p>
          </div>
        ) : (
          <div className="grid">{matches.map(u => <UserCard key={u.id} user={u} isMatch />)}</div>
        )}
      </div>
    );
  };

  const ViewScreen = () => {
    const u = selectedUser;
    if (!u) return null;
    const isConnected = connections.includes(u.id);
    const isPending = sentRequests.includes(u.id);
    return (
      <div className="page-narrow">
        <button className="back-btn" style={{ marginBottom: 20 }} onClick={() => setScreen("browse")}>← Back</button>
        <div className="prof-hero">
          <div className="prof-top">
            <div className="av av-lg" style={{ background: u.color }}>{u.avatar}</div>
            <div style={{ flex: 1 }}>
              <div className="prof-name">{u.name}</div>
              <div className="prof-meta">📍 {u.location} {u.rating && <span style={{ marginLeft: 12, color: "var(--accent)" }}>★ {u.rating} · {u.sessions} sessions</span>}</div>
              <div className="prof-bio">{u.bio}</div>
            </div>
          </div>
        </div>

        <div className="info-box">
          <div className="info-box-title">🎓 Teaches</div>
          <div className="tags">{u.teaches.map(s => <span key={s} className="tag teach" style={{ fontSize: 13, padding: "5px 12px" }}>{s}</span>)}</div>
        </div>
        <div className="info-box">
          <div className="info-box-title">🌱 Wants to learn</div>
          <div className="tags">{u.learns.map(s => <span key={s} className="tag learn" style={{ fontSize: 13, padding: "5px 12px" }}>{s}</span>)}</div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {isConnected
            ? <button className="btn-full primary" onClick={() => { setActiveChatId(u.id); setScreen("messages"); }}>Open Chat →</button>
            : isPending
              ? <button className="btn-full primary" style={{ background: "var(--border)", color: "var(--faint)", cursor: "default" }} disabled>Request Pending…</button>
              : <button className="btn-full primary" onClick={() => sendRequest(u.id)}>Send Swap Request</button>
          }
        </div>
      </div>
    );
  };

  const MessagesScreen = () => {
    const activeUser = SEED_USERS.find(u => u.id === activeChatId);
    const chatMsgs = messages[activeChatId] || [];
    const connectedUsers = SEED_USERS.filter(u => connections.includes(u.id));

    return (
      <div style={{ padding: "20px 24px 0", maxWidth: 900, margin: "0 auto" }}>
        <div className="section-hd"><h2>Messages</h2><p>Chat with your connections</p></div>
        {connectedUsers.length === 0 ? (
          <div className="empty"><div className="empty-icon">💬</div><p>No connections yet.<br />Connect with members to start chatting.</p><button className="btn-primary" style={{ marginTop: 16 }} onClick={() => goTo("browse")}>Browse Members</button></div>
        ) : (
          <div className="msg-layout">
            <div className={`msg-sidebar ${activeChatId ? "mobile-hide" : ""}`}>
              <div className="msg-sidebar-hd">Conversations</div>
              {connectedUsers.map(u => (
                <div key={u.id} className={`msg-item ${activeChatId === u.id ? "active" : ""}`} onClick={() => setActiveChatId(u.id)}>
                  <div className="av" style={{ background: u.color }}>{u.avatar}</div>
                  <div className="msg-item-info">
                    <div className="msg-item-name">{u.name}</div>
                    <div className="msg-item-preview">{(messages[u.id] || []).slice(-1)[0]?.text || "No messages yet"}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`chat-area ${activeChatId ? "mobile-open" : ""}`}>
              {!activeChatId ? (
                <div className="chat-empty">Select a conversation to start chatting</div>
              ) : (
                <>
                  <div className="chat-hd">
                    <button style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, display: "none" }} className="mobile-back" onClick={() => setActiveChatId(null)}>←</button>
                    <div className="av" style={{ background: activeUser?.color }}>{activeUser?.avatar}</div>
                    <div>
                      <div className="chat-hd-name">{activeUser?.name}</div>
                      <div className="chat-hd-sub">{activeUser?.location}</div>
                    </div>
                  </div>
                  <div className="chat-msgs">
                    {chatMsgs.length === 0 && <div style={{ textAlign: "center", color: "var(--faint)", fontSize: 13, marginTop: 24 }}>Start the conversation!</div>}
                    {chatMsgs.map((m, i) => (
                      <div key={i}>
                        <div className={`msg-bubble ${m.from}`}>{m.text}</div>
                        <div className={`msg-time ${m.from === "me" ? "right" : ""}`}>{m.time}</div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="chat-input-row">
                    <input className="chat-input" placeholder="Type a message…" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
                    <button className="send-btn" onClick={sendMessage}>Send</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const JoinScreen = () => {
    const submit = () => {
      if (!form.name.trim()) { showToast("Please enter your name", "error"); return; }
      if (form.teaches.length === 0) { showToast("Add at least one skill you teach", "error"); return; }
      if (form.learns.length === 0) { showToast("Add at least one skill you want to learn", "error"); return; }
      setMyProfile({ ...form });
      showToast("Welcome to SkillSwap! 🎉");
      goTo("matches");
    };
    return (
      <div className="page-narrow">
        <h2 style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create your profile</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Tell the community what you offer and what you want to learn</p>
        <div className="step-bar">{[1,2,3].map(s => <div key={s} className={`step-seg ${formStep >= s ? "done" : ""}`}></div>)}</div>

        {formStep === 1 && <>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="e.g. Kwame Mensah" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" placeholder="e.g. Accra, Ghana" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Short Bio</label>
            <textarea className="form-input form-textarea" placeholder="Tell people a little about yourself…" value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} />
          </div>
          <button className="btn-full primary" onClick={() => { if (form.name.trim()) setFormStep(2); else showToast("Please enter your name", "error"); }}>Next →</button>
        </>}

        {formStep === 2 && <>
          <div className="form-group">
            <label className="form-label">Skills I can teach *</label>
            <div className="tag-row">
              <input className="form-input" placeholder="e.g. Python, Canva, Guitar…" value={form.teachInput}
                onChange={e => setForm(f => ({...f, teachInput: e.target.value}))}
                onKeyDown={e => e.key === "Enter" && addTag("teaches", "teachInput", form.teachInput)} />
              <button className="add-tag-btn" onClick={() => addTag("teaches", "teachInput", form.teachInput)}>+</button>
            </div>
            <div className="tags" style={{ marginTop: 10 }}>
              {form.teaches.map((s,i) => <span key={i} className="tag teach tag-rm" onClick={() => removeTag("teaches", i)}>{s} <span className="x">×</span></span>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="back-btn" style={{ flex: 1 }} onClick={() => setFormStep(1)}>← Back</button>
            <button className="btn-full primary" style={{ flex: 2 }} onClick={() => { if (form.teaches.length > 0) setFormStep(3); else showToast("Add at least one skill you teach", "error"); }}>Next →</button>
          </div>
        </>}

        {formStep === 3 && <>
          <div className="form-group">
            <label className="form-label">Skills I want to learn *</label>
            <div className="tag-row">
              <input className="form-input" placeholder="e.g. French, Photography, Excel…" value={form.learnInput}
                onChange={e => setForm(f => ({...f, learnInput: e.target.value}))}
                onKeyDown={e => e.key === "Enter" && addTag("learns", "learnInput", form.learnInput)} />
              <button className="add-tag-btn" onClick={() => addTag("learns", "learnInput", form.learnInput)}>+</button>
            </div>
            <div className="tags" style={{ marginTop: 10 }}>
              {form.learns.map((s,i) => <span key={i} className="tag learn tag-rm" onClick={() => removeTag("learns", i)}>{s} <span className="x">×</span></span>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="back-btn" style={{ flex: 1 }} onClick={() => setFormStep(2)}>← Back</button>
            <button className="btn-full primary" style={{ flex: 2 }} onClick={submit}>Join SkillSwap ✦</button>
          </div>
        </>}
      </div>
    );
  };

  const renderScreen = () => {
    switch(screen) {
      case "home": return <HomeScreen />;
      case "browse": return <BrowseScreen />;
      case "matches": return <MatchesScreen />;
      case "view": return <ViewScreen />;
      case "messages": return <MessagesScreen />;
      case "join": return <JoinScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <>
      <style>{css}</style>
      <nav className="nav">
        <div className="logo">Skill<em>Swap</em></div>
        <div className="nav-links">
          {[["home","Home"],["browse","Browse"],["matches","Matches"],["messages","Messages"]].map(([s,l]) => (
            <button key={s} className={screen === s ? "active" : ""} onClick={() => goTo(s)}>{l}</button>
          ))}
          {myProfile
            ? <button className="cta" onClick={() => goTo("matches")}>👤 {myProfile.name.split(" ")[0]}</button>
            : <button className="cta" onClick={() => goTo("join")}>Join Free</button>
          }
        </div>
        <button className="hamburger" onClick={() => setMobileNav(true)}>
          <div className="ham-line"></div><div className="ham-line"></div><div className="ham-line"></div>
        </button>
      </nav>

      <div className={`drawer-overlay ${mobileNav ? "open" : ""}`} onClick={() => setMobileNav(false)} />
      <div className={`drawer ${mobileNav ? "open" : ""}`}>
        <button className="close-drawer" onClick={() => setMobileNav(false)}>×</button>
        <div className="drawer-links">
          {[["home","🏠 Home"],["browse","🔍 Browse"],["matches","✦ Matches"],["messages","💬 Messages"]].map(([s,l]) => (
            <button key={s} className={screen === s ? "active" : ""} onClick={() => goTo(s)}>{l}</button>
          ))}
          {myProfile
            ? <button onClick={() => goTo("matches")}>👤 {myProfile.name}</button>
            : <button className="cta" onClick={() => goTo("join")}>Join Free</button>
          }
        </div>
      </div>

      {renderScreen()}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
