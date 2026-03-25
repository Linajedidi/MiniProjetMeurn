import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Star, ArrowRight, Phone, MapPin, Mail,
  ChevronDown, Menu, X, Briefcase, Users, Building2, Clock, Lock
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const [offers, setOffers]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("Toutes");
  const [displayCount, setDisplayCount] = useState(6);
  const [searchQuery, setSearchQuery]   = useState("");
  const [isMenuOpen, setIsMenuOpen]     = useState(false);

  // ── Modal prévisualisation
  const [previewOffer, setPreviewOffer] = useState(null);
  const [countdown, setCountdown]       = useState(5);

  // ── Formulaire contact
  const [nom, setNom]         = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  // ── Fetch offres
  useEffect(() => {
    async function fetchData() {
      try {
        const res  = await fetch("http://localhost:3001/api/offres/public");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setOffers(Array.isArray(data) ? data : []);
        const domaines = [...new Set(
          (Array.isArray(data) ? data : []).map(o => o.domaine).filter(Boolean)
        )];
        setCategories(domaines);
      } catch {
        setOffers([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ── Countdown + redirect quand modal ouvert
  useEffect(() => {
    if (!previewOffer) return;
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [previewOffer, navigate]);

  const openPreview = (e, offer) => {
    e.stopPropagation();
    setPreviewOffer(offer);
  };

  const closePreview = () => {
    setPreviewOffer(null);
  };

  // ── Filtrage
  const filteredOffers = offers.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery ||
      (o.titre||"").toLowerCase().includes(q) ||
      (o.entreprise?.username||"").toLowerCase().includes(q);
    const matchCat = selectedCat === "Toutes" || o.domaine === selectedCat;
    return matchSearch && matchCat;
  });

  // ── Contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true); setSuccess(false); setError("");
    const token = localStorage.getItem("token");
    const endpoint = token
      ? "http://localhost:3001/api/contact/auth"
      : "http://localhost:3001/api/contact";
    const body = token ? { message } : { nom, email, message };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (res.ok) {
        setSuccess(true); setNom(""); setEmail(""); setMessage("");
      } else {
        setError(result.message || "Erreur lors de l'envoi");
      }
    } catch { setError("Erreur lors de l'envoi"); }
    finally { setSending(false); }
  };

  const typeColors = {
    CDI:       { bg:"#dcfce7", color:"#166534" },
    CDD:       { bg:"#fff7ed", color:"#9a3412" },
    Stage:     { bg:"#eff6ff", color:"#1e40af" },
    Freelance: { bg:"#faf5ff", color:"#6b21a8" },
  };
  const getTypeStyle = (t) => typeColors[t] || { bg:"#f1f5f9", color:"#475569" };
  const initials = n => (n||"").trim().split(" ").map(w=>w[0]||"").join("").toUpperCase().slice(0,2)||"J";

  // Pourcentage progression countdown
  const progressPct = ((5 - countdown) / 5) * 100;

  return (
    <div style={{ background:"#F7F6F2", minHeight:"100vh", fontFamily:"'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes marquee{to{transform:translateX(-50%)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes modalIn{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes overlayIn{from{opacity:0}to{opacity:1}}
        @keyframes progressBar{from{width:0%}to{width:100%}}
        .fade-up{animation:fadeUp .65s ease both;}
        .d1{animation-delay:.12s}.d2{animation-delay:.24s}.d3{animation-delay:.36s}.d4{animation-delay:.48s}
        .ticker-track{display:flex;width:max-content;animation:marquee 28s linear infinite;}
        .loader{width:40px;height:40px;border:3px solid #e2e0d8;border-top-color:#2563eb;border-radius:50%;animation:spin .75s linear infinite;margin:80px auto;}
        .card-hover{transition:transform .3s ease,box-shadow .3s ease;cursor:pointer;}
        .card-hover:hover{transform:translateY(-6px);box-shadow:0 20px 48px rgba(15,15,26,.12);}
        .cat-btn{display:flex;align-items:center;gap:10px;padding:10px 20px;border-radius:20px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:14px;transition:all .25s ease;box-shadow:0 2px 8px rgba(0,0,0,.06);}
        .cat-btn:hover{transform:scale(1.04);}
        .btn-primary{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;border:none;padding:15px 36px;border-radius:14px;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;gap:10px;transition:all .25s ease;box-shadow:0 4px 20px rgba(37,99,235,.35);}
        .btn-primary:hover{transform:scale(1.05);box-shadow:0 8px 28px rgba(37,99,235,.45);}
        .btn-secondary{background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;border:none;padding:15px 36px;border-radius:14px;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;gap:10px;transition:all .25s ease;box-shadow:0 4px 20px rgba(245,158,11,.35);}
        .btn-secondary:hover{transform:scale(1.05);}
        .input-style{width:100%;padding:14px 18px;border-radius:14px;border:2px solid #e2e0d8;background:#fff;font-family:'Inter',sans-serif;font-size:15px;color:#0f0f1a;outline:none;transition:border-color .2s;}
        .input-style:focus{border-color:#2563eb;}
        .input-style::placeholder{color:#9ca3af;}
        a{text-decoration:none;}
        .modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(15,15,26,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:overlayIn .25s ease;}
        .modal-box{background:#fff;border-radius:28px;width:100%;max-width:600px;max-height:88vh;overflow-y:auto;box-shadow:0 32px 80px rgba(15,15,26,.25);animation:modalIn .35s cubic-bezier(.34,1.56,.64,1) both;}
        .modal-box::-webkit-scrollbar{width:6px;}
        .modal-box::-webkit-scrollbar-track{background:#f1f5f9;border-radius:10px;}
        .modal-box::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px;}
        .progress-bar{height:4px;background:linear-gradient(90deg,#2563eb,#7c3aed);border-radius:0 0 4px 4px;transition:width 1s linear;}
        .blur-text{filter:blur(4px);user-select:none;pointer-events:none;}
        .login-cta-btn{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;border:none;padding:13px 32px;border-radius:14px;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;gap:10px;transition:all .25s ease;box-shadow:0 4px 20px rgba(37,99,235,.35);}
        .login-cta-btn:hover{transform:scale(1.04);box-shadow:0 8px 28px rgba(37,99,235,.5);}
      `}</style>

      {/* ══════════════════════════════════════════════
          MODAL PRÉVISUALISATION OFFRE
      ══════════════════════════════════════════════ */}
      {previewOffer && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>

            {/* Barre de progression */}
            <div style={{height:4,background:"#f1f5f9",borderRadius:"28px 28px 0 0",overflow:"hidden"}}>
              <div className="progress-bar" style={{width:`${progressPct}%`}}/>
            </div>

            {/* Header modal */}
            <div style={{padding:"24px 28px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:"#4338ca",flexShrink:0}}>
                  {initials(previewOffer.entreprise?.username)}
                </div>
                <div>
                  <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#0f0f1a",margin:0,letterSpacing:"-.02em"}}>
                    {previewOffer.titre || "Poste non renseigné"}
                  </h3>
                  <p style={{fontSize:13,color:"#2563eb",fontWeight:600,margin:"3px 0 0"}}>
                    {previewOffer.entreprise?.username || "Entreprise"}
                  </p>
                </div>
              </div>
              <button onClick={closePreview} style={{background:"#f1f5f9",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                <X size={18} color="#64748b"/>
              </button>
            </div>

            {/* Badges infos */}
            <div style={{padding:"16px 28px 0",display:"flex",flexWrap:"wrap",gap:8}}>
              {previewOffer.type && (
                <span style={{...getTypeStyle(previewOffer.type),padding:"4px 14px",borderRadius:100,fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif",letterSpacing:".04em",textTransform:"uppercase"}}>
                  {previewOffer.type}
                </span>
              )}
              {previewOffer.lieu && (
                <span style={{display:"flex",alignItems:"center",gap:5,background:"#f1f5f9",padding:"4px 12px",borderRadius:100,fontSize:12,color:"#475569",fontWeight:600}}>
                  <MapPin size={12}/>{previewOffer.lieu}
                </span>
              )}
              {previewOffer.domaine && (
                <span style={{display:"flex",alignItems:"center",gap:5,background:"#f1f5f9",padding:"4px 12px",borderRadius:100,fontSize:12,color:"#475569",fontWeight:600}}>
                  <Briefcase size={12}/>{previewOffer.domaine}
                </span>
              )}
              {previewOffer.salaire && (
                <span style={{display:"flex",alignItems:"center",gap:5,background:"#f0fdf4",padding:"4px 12px",borderRadius:100,fontSize:12,color:"#166534",fontWeight:600}}>
                  <Star size={12} fill="#166534"/>{previewOffer.salaire}
                </span>
              )}
            </div>

            {/* Description — partiellement floutée */}
            <div style={{padding:"20px 28px 0",position:"relative"}}>
              <h4 style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#94a3b8",marginBottom:10}}>
                Description du poste
              </h4>

              {/* Texte visible (premiers ~200 chars) */}
              <p style={{fontSize:14,color:"#334155",lineHeight:1.8,margin:0}}>
                {(previewOffer.description || "Aucune description disponible.").slice(0, 220)}
                {(previewOffer.description || "").length > 220 && "..."}
              </p>

              {/* Zone floutée */}
              {(previewOffer.description || "").length > 220 && (
                <div style={{position:"relative",marginTop:8}}>
                  <p className="blur-text" style={{fontSize:14,color:"#334155",lineHeight:1.8,margin:0}}>
                    {(previewOffer.description || "").slice(220, 500)}
                  </p>
                  {/* Overlay dégradé + icône cadenas */}
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(255,255,255,0) 0%,rgba(255,255,255,.95) 60%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",paddingBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(37,99,235,.1)",padding:"6px 14px",borderRadius:100}}>
                      <Lock size={13} color="#2563eb"/>
                      <span style={{fontSize:12,fontWeight:600,color:"#2563eb"}}>Connectez-vous pour lire la suite</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Séparateur */}
            <div style={{margin:"20px 28px 0",height:1,background:"#f1f5f9"}}/>

            {/* Footer modal — countdown + CTA */}
            <div style={{padding:"20px 28px 28px"}}>
              {/* Compte à rebours */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"12px 16px",background:"#fffbeb",borderRadius:14,border:"1px solid #fde68a"}}>
                <div style={{width:36,height:36,borderRadius:10,background:"#fbbf24",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Clock size={18} color="#fff"/>
                </div>
                <div>
                  <p style={{margin:0,fontSize:13,fontWeight:700,color:"#92400e",fontFamily:"'Syne',sans-serif"}}>
                    Redirection automatique dans <span style={{fontSize:20,color:"#d97706"}}>{countdown}</span>s
                  </p>
                  <p style={{margin:"2px 0 0",fontSize:12,color:"#b45309"}}>
                    Connectez-vous pour postuler et accéder à toutes les offres
                  </p>
                </div>
              </div>

              {/* Boutons */}
              <div style={{display:"flex",gap:10}}>
                <button className="login-cta-btn" style={{flex:1,justifyContent:"center"}} onClick={()=>navigate("/login")}>
                  <Lock size={16}/>
                  Se connecter maintenant
                  <ArrowRight size={16}/>
                </button>
                <button onClick={closePreview}
                  style={{padding:"13px 20px",borderRadius:14,border:"2px solid #e2e0d8",background:"transparent",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",color:"#64748b",transition:"all .2s",whiteSpace:"nowrap"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="#94a3b8"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e0d8"}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── NAVBAR ──────────────────────────────────────────────── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        background:"rgba(247,246,242,.95)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid #e2e0d8",height:64,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 40px",
      }}>
        <a href="#accueil" style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"linear-gradient(135deg,#2563eb,#7c3aed)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Briefcase size={18} color="#fff"/>
          </div>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#0f0f1a",letterSpacing:"-.03em"}}>
            Job<span style={{color:"#2563eb"}}>Board</span>
          </span>
        </a>

        <ul style={{display:"flex",gap:36,listStyle:"none",padding:0}} className="hide-on-mobile">
          {[["#accueil","Accueil"],["#offres","Offres"],["#contact","Contact"]].map(([h,l])=>(
            <li key={l}>
              <a href={h} style={{color:"#4b4b6a",fontSize:14,fontWeight:500,transition:"color .2s"}}
                onMouseEnter={e=>e.target.style.color="#2563eb"}
                onMouseLeave={e=>e.target.style.color="#4b4b6a"}>{l}</a>
            </li>
          ))}
        </ul>

        <div style={{display:"flex",gap:10}} className="hide-on-mobile">
          <button onClick={()=>navigate("/login")} style={{padding:"9px 22px",borderRadius:100,border:"2px solid #e2e0d8",background:"transparent",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s",color:"#0f0f1a"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#0f0f1a";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#0f0f1a";}}>
            Se connecter
          </button>
          <button className="btn-primary" style={{padding:"9px 22px",fontSize:13}} onClick={()=>navigate("/register")}>
            S'inscrire
          </button>
        </div>

        <button style={{display:"none",background:"none",border:"none",cursor:"pointer",color:"#0f0f1a"}}
          id="hamburger" onClick={()=>setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </nav>

      {isMenuOpen && (
        <div style={{position:"fixed",top:64,left:0,right:0,zIndex:99,background:"#f7f6f2",borderBottom:"1px solid #e2e0d8",padding:"16px 24px 20px"}}>
          {[["#accueil","Accueil"],["#offres","Offres"],["#contact","Contact"]].map(([h,l])=>(
            <a key={l} href={h} style={{display:"block",padding:"10px 0",color:"#0f0f1a",fontWeight:600,fontSize:15}} onClick={()=>setIsMenuOpen(false)}>{l}</a>
          ))}
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button className="btn-primary" style={{flex:1,justifyContent:"center",padding:"11px"}} onClick={()=>navigate("/login")}>Se connecter</button>
            <button className="btn-secondary" style={{flex:1,justifyContent:"center",padding:"11px"}} onClick={()=>navigate("/register")}>S'inscrire</button>
          </div>
        </div>
      )}

      {/* ─── HERO ────────────────────────────────────────────────── */}
      <header id="accueil" style={{
        position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",
        justifyContent:"center",overflow:"hidden",paddingTop:64,
        background:"linear-gradient(135deg,#2563eb 0%,#7c3aed 50%,#1e40af 100%)",
      }}>
        <div style={{position:"absolute",inset:0,opacity:.06,backgroundImage:"radial-gradient(rgba(255,255,255,.9) 1px,transparent 1px)",backgroundSize:"30px 30px"}}/>
        <div style={{position:"absolute",top:60,left:40,width:80,height:80,background:"rgba(255,255,255,.1)",borderRadius:"50%",filter:"blur(20px)",animation:"pulse 3s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:80,right:60,width:140,height:140,background:"rgba(124,58,237,.25)",borderRadius:"50%",filter:"blur(36px)",animation:"pulse 4s ease-in-out infinite 1s"}}/>

        <div style={{position:"relative",zIndex:2,maxWidth:1200,margin:"0 auto",padding:"0 40px",width:"100%"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
            <h1 className="fade-up d1" style={{fontFamily:"'Syne',sans-serif",fontSize:64,fontWeight:800,color:"#fff",lineHeight:1.06,letterSpacing:"-.04em",marginBottom:8}}>Découvrez</h1>
            <h1 className="fade-up d1" style={{fontFamily:"'Syne',sans-serif",fontSize:64,fontWeight:800,lineHeight:1.06,letterSpacing:"-.04em",marginBottom:8,background:"linear-gradient(90deg,rgba(255,255,255,.6),#fff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>JobBoard</h1>
            <h1 className="fade-up d1" style={{fontFamily:"'Syne',sans-serif",fontSize:44,fontWeight:800,color:"#fff",lineHeight:1.1,letterSpacing:"-.03em",marginBottom:24}}>Vos Offres d'Emploi Préférées</h1>
            <p className="fade-up d2" style={{fontSize:18,color:"rgba(255,255,255,.8)",lineHeight:1.75,maxWidth:540,marginBottom:40}}>
              Explorez une sélection exclusive d'offres d'emploi provenant des meilleures entreprises. Rejoignez des milliers d'utilisateurs satisfaits.
            </p>
            <div className="fade-up d3" style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center",marginBottom:56}}>
              <button className="btn-primary" onClick={()=>navigate("/register")}>
                <Users size={20}/>Espace Candidat<ArrowRight size={18}/>
              </button>
              <button className="btn-secondary" onClick={()=>navigate("/Enter")}>
                <Building2 size={20}/>Espace Entreprise<ArrowRight size={18}/>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── TICKER ──────────────────────────────────────────────── */}
      <div style={{background:"linear-gradient(90deg,#2563eb,#7c3aed)",padding:"12px 0",overflow:"hidden"}}>
        <div className="ticker-track">
          {[...["Développeur Full Stack","Data Scientist","Chef de Projet","UX Designer","DevOps","Commercial B2B","Analyste Financier","Product Manager"],
            ...["Développeur Full Stack","Data Scientist","Chef de Projet","UX Designer","DevOps","Commercial B2B","Analyste Financier","Product Manager"]
          ].map((t,i)=>(
            <span key={i} style={{whiteSpace:"nowrap",padding:"0 32px",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"rgba(255,255,255,.9)",letterSpacing:".08em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:14}}>
              {t} <span style={{opacity:.35}}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── SECTION OFFRES ──────────────────────────────────────── */}
      <section id="offres" style={{padding:"80px 0",background:"#fff"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
          
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:44,fontWeight:800,color:"#0f0f1a",letterSpacing:"-.03em",marginBottom:12}}>
              Découvrez Nos <span style={{color:"#2563eb"}}>Offres Exclusives</span>
            </h2>
            <p style={{fontSize:16,color:"#4b4b6a",maxWidth:560,margin:"0 auto",lineHeight:1.7}}>
              Une sélection soigneusement choisie d'offres pour vous offrir la meilleure opportunité de carrière.
            </p>
          </div>

          <div style={{display:"flex",justifyContent:"center",marginBottom:40}}>
            <div style={{position:"relative",width:"100%",maxWidth:480}}>
              <Search size={20} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}/>
              <input className="input-style" style={{paddingLeft:50}} type="text"
                placeholder="Rechercher par titre d'offre, entreprise..."
                value={searchQuery}
                onChange={e=>{ setSearchQuery(e.target.value); setDisplayCount(6); }}/>
            </div>
          </div>

  

          {loading ? (
            <div className="loader"/>
          ) : filteredOffers.length === 0 ? (
            <div style={{textAlign:"center",padding:"64px 0"}}>
              <div style={{width:80,height:80,background:"#f1f5f9",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                <Search size={32} color="#9ca3af"/>
              </div>
              <p style={{fontSize:17,color:"#4b4b6a"}}>Aucune offre trouvée pour cette recherche.</p>
            </div>
          ) : (
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:28}}>
                {filteredOffers.slice(0,displayCount).map(offer=>{
                  const tc = getTypeStyle(offer.type);
                  return (
                    <div key={offer._id} className="card-hover"
                      style={{background:"#fff",borderRadius:24,border:"1px solid #e2e0d8",overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}
                      onClick={(e)=>openPreview(e, offer)}>
                      <div style={{height:4,background:"linear-gradient(90deg,#2563eb,#7c3aed)"}}/>
                      <div style={{padding:24,paddingBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                          <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#4338ca"}}>
                            {initials(offer.entreprise?.username)}
                          </div>
                          <span style={{...tc,padding:"4px 14px",borderRadius:100,fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif",letterSpacing:".04em",textTransform:"uppercase"}}>
                            {offer.type||"CDI"}
                          </span>
                        </div>
                        <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#0f0f1a",marginBottom:6,letterSpacing:"-.02em",lineHeight:1.3}}>
                          {offer.titre||"Poste non renseigné"}
                        </h3>
                        <p style={{fontSize:14,fontWeight:600,color:"#2563eb",marginBottom:16}}>
                          {offer.entreprise?.username||"Entreprise"}
                        </p>
                        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
                          {offer.lieu && (
                            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#4b4b6a"}}>
                              <MapPin size={14} style={{opacity:.7}}/>{offer.lieu}
                            </div>
                          )}
                          {offer.domaine && (
                            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#4b4b6a"}}>
                              <Briefcase size={14} style={{opacity:.7}}/>{offer.domaine}
                            </div>
                          )}
                          {offer.salaire && (
                            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#4b4b6a"}}>
                              <Star size={13} style={{opacity:.7}}/>{offer.salaire}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{padding:"0 24px 24px"}}>
                        <button className="btn-primary"
                          style={{width:"100%",justifyContent:"center",padding:"12px",borderRadius:14}}
                          onClick={(e)=>openPreview(e, offer)}>
                          Voir l'offre <ArrowRight size={16}/>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:48}}>
                {filteredOffers.length > displayCount && (
                  <button className="btn-primary" onClick={()=>setDisplayCount(p=>p+6)}>
                    Voir Plus <ChevronDown size={18}/>
                  </button>
                )}
                {displayCount > 6 && (
                  <button onClick={()=>setDisplayCount(6)}
                    style={{padding:"13px 28px",borderRadius:14,border:"none",background:"#64748b",color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",transition:"all .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#475569"}
                    onMouseLeave={e=>e.currentTarget.style.background="#64748b"}>
                    Voir Moins
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>



      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer style={{background:"#0f0f1a",color:"rgba(255,255,255,.5)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(37,99,235,.08),rgba(124,58,237,.08))",pointerEvents:"none"}}/>
        <div style={{position:"relative",maxWidth:1200,margin:"0 auto",padding:"64px 40px 0"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <div style={{width:38,height:38,background:"linear-gradient(135deg,#2563eb,#7c3aed)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Briefcase size={18} color="#fff"/>
                </div>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-.03em"}}>
                  Job<span style={{color:"#60a5fa"}}>Board</span>
                </span>
              </div>
              <p style={{fontSize:14,color:"rgba(255,255,255,.45)",lineHeight:1.8,maxWidth:280,marginBottom:24}}>
                Votre plateforme de confiance pour découvrir les meilleures offres d'emploi.
              </p>
              <div style={{display:"flex",gap:10}}>
                {[["f","#"],["in","#"],["t","#"]].map(([l,h])=>(
                  <a key={l} href={h} style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.5)",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,transition:"all .2s",textDecoration:"none"}}
                    onMouseEnter={e=>{ e.currentTarget.style.background="#2563eb"; e.currentTarget.style.color="#fff"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,.07)"; e.currentTarget.style.color="rgba(255,255,255,.5)"; }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginBottom:20}}>Navigation</h3>
              <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:12}}>
                {[["#accueil","Accueil"],["#offres","Offres d'emploi"],["#contact","Contact"]].map(([h,l])=>(
                  <li key={l}>
                    <a href={h} style={{color:"rgba(255,255,255,.55)",fontSize:14,transition:"color .2s",textDecoration:"none"}}
                      onMouseEnter={e=>e.target.style.color="#60a5fa"}
                      onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.55)"}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginBottom:20}}>Espace</h3>
              <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:12}}>
                {[["/login","Espace Candidat"],["/Enter","Espace Entreprise"],["/register","Créer un compte"],["/login","Se connecter"]].map(([h,l])=>(
                  <li key={l}><a href={h} style={{color:"rgba(255,255,255,.55)",fontSize:14,transition:"color .2s",textDecoration:"none"}} onMouseEnter={e=>e.target.style.color="#60a5fa"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.55)"}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginBottom:20}}>Contact</h3>
              <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:16}}>
                {[[<Phone size={16}/>,"+216 XX XXX XXX"],[<MapPin size={16}/>,"Tunis, Tunisie"],[<Mail size={16}/>,"contact@jobboard.tn"]].map(([icon,text],i)=>(
                  <li key={i} style={{display:"flex",alignItems:"center",gap:12,fontSize:14,color:"rgba(255,255,255,.55)"}}>
                    <div style={{width:32,height:32,background:"rgba(37,99,235,.2)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#60a5fa",flexShrink:0}}>{icon}</div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.07)",maxWidth:1200,margin:"0 auto",padding:"24px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <p style={{fontSize:13}}>© {new Date().getFullYear()} JobBoard. Tous droits réservés.</p>
          <div style={{display:"flex",gap:24}}>
            {["Politique de confidentialité","Conditions d'utilisation"].map(t=>(
              <a key={t} href="#" style={{fontSize:13,color:"rgba(255,255,255,.3)",textDecoration:"none",transition:"color .2s"}}
                onMouseEnter={e=>e.target.style.color="#60a5fa"}
                onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.3)"}>{t}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}