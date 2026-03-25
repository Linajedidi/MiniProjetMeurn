// src/pages/Register.js  — Inscription ENTREPRISE uniquement

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IC = {
  User:     ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  Mail:     ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock:     ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Phone:    ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>,
  Building: ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>,
  MapPin:   ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  FileText: ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Tag:      ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Eye:      ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:   ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Check:    ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  CheckCircle:()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 15.01 9 12.01"/></svg>,
  XCircle:  ()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Briefcase:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  Globe:    ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
};

const SECTEURS = [
  "Informatique & Tech","Finance & Banque","Santé & Médical",
  "Commerce & Vente","Marketing & Communication","Éducation & Formation",
  "BTP & Immobilier","Transport & Logistique","Industrie & Production",
  "Tourisme & Hôtellerie","Agriculture & Agroalimentaire",
  "Ressources Humaines","Juridique","Énergie & Environnement","Autre",
];

const S = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    :root{--entr:#2563eb;--ink:#0f0f1a;--ink2:#4b4b6a;--bg:#ffffff;--white:#fff;--border:#e2e0d8;}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--ink);}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .fade{animation:fadeUp .55s ease both;}
    .overlay{animation:fadeIn .2s ease both;}
    .nav{position:fixed;top:0;left:0;right:0;z-index:100;height:60px;background:rgba(255,255,255,.95);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 40px;}
    .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
    .nav-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#2563eb,#3b82f6);border-radius:10px;display:flex;align-items:center;justify-content:center;}
    .nav-logo-text{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--ink);letter-spacing:-.03em;}
    .nav-logo-text span{color:#2563eb;}
    .nav-link{font-size:14px;color:var(--ink2);}
    .nav-link a{color:var(--entr);text-decoration:none;font-weight:600;}
    .nav-link a:hover{text-decoration:underline;}
    .page{max-width:1000px;margin:0 auto;padding:88px 40px 80px;}
    @media(max-width:768px){.page{padding:80px 20px 60px;}.nav{padding:0 20px;}}
    .register-container{display:flex;background:white;border-radius:32px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.15);overflow:hidden;}
    .register-image{flex:1;background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);padding:2.5rem;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;overflow:hidden;}
    .register-image-bg{position:absolute;top:-20%;right:-20%;width:250px;height:250px;background:rgba(0,0,0,0.02);border-radius:50%;}
    .register-image-bg2{position:absolute;bottom:-15%;left:-15%;width:200px;height:200px;background:rgba(0,0,0,0.02);border-radius:50%;}
    .register-image-content{width:100%;max-width:280px;text-align:center;position:relative;z-index:1;}
    .register-image-content img{width:100%;height:auto;border-radius:20px;display:block;object-fit:cover;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1);}
    .register-image-content h3{color:#2D3E50;font-size:1.5rem;font-weight:600;margin-top:1.5rem;margin-bottom:0.5rem;}
    .register-image-content p{color:#6c757d;font-size:0.9rem;line-height:1.5;}
    .register-form{flex:1;padding:2.5rem;}
    .register-form h2{font-size:1.75rem;font-weight:700;color:#1F2937;margin-bottom:0.5rem;letter-spacing:-0.3px;}
    .register-form-sub{color:#6B7280;font-size:0.9rem;margin-bottom:2rem;}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
    @media(max-width:768px){.register-container{flex-direction:column;}.register-image{padding:2rem;}.form-grid{grid-template-columns:1fr;}}
    .form-full{grid-column:1/-1;}
    .form-field{display:flex;flex-direction:column;gap:8px;}
    .form-label{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:#374151;font-family:'Syne',sans-serif;letter-spacing:.05em;text-transform:uppercase;}
    .form-label-icon{color:var(--entr);}
    .form-input,.form-select,.form-textarea{width:100%;padding:13px 16px;border-radius:12px;border:2px solid #E5E7EB;background:#F9FAFB;font-family:'Inter',sans-serif;font-size:14px;color:var(--ink);outline:none;transition:border-color .2s;}
    .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--entr);background:white;}
    .form-input::placeholder,.form-textarea::placeholder{color:#9ca3af;}
    .form-textarea{resize:none;}
    .form-select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234b4b6a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;}
    .input-wrap{position:relative;}
    .input-wrap-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none;}
    .input-wrap .form-input,.input-wrap .form-select{padding-left:42px;}
    .pwd-toggle{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9ca3af;padding:0;display:flex;}
    .pwd-toggle:hover{color:var(--entr);}
    .form-sep{border:none;border-top:1px solid #E5E7EB;margin:24px 0;}
    .section-label{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:100px;background:#eff6ff;color:var(--entr);font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:18px;}
    .btn-submit{width:100%;padding:15px;border-radius:12px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;box-shadow:0 4px 20px rgba(37,99,235,.3);transition:all .25s ease;margin-top:8px;}
    .btn-submit:hover:not(:disabled){transform:scale(1.02);box-shadow:0 8px 28px rgba(37,99,235,.4);}
    .btn-submit:disabled{opacity:.65;cursor:not-allowed;}
    .spinner-sm{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
    .alert-err{padding:12px 16px;border-radius:12px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-size:14px;font-weight:500;margin-top:12px;}
    .alert-success{padding:12px 16px;border-radius:12px;background:#d1fae5;border:1px solid #a7f3d0;color:#065f46;font-size:14px;font-weight:500;margin-top:12px;}
    .login-link{text-align:center;margin-top:20px;font-size:14px;color:#6B7280;}
    .login-link a{color:var(--entr);font-weight:600;text-decoration:none;}
    .login-link a:hover{text-decoration:underline;}
    .modal-overlay{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);padding:20px;}
    .modal-box{background:#fff;border-radius:20px;padding:36px 32px;max-width:380px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,.2);text-align:center;}
    .modal-icon{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
    .modal-icon-ok{background:#dcfce7;color:#16a34a;}
    .modal-icon-err{background:#fee2e2;color:#ef4444;}
    .modal-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px;}
    .modal-msg{font-size:14px;color:var(--ink2);margin-bottom:24px;line-height:1.6;}
    .modal-btn{padding:11px 28px;border-radius:100px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:#fff;transition:all .2s;}
    .modal-btn:hover{transform:scale(1.04);}
    .modal-btn-ok{background:linear-gradient(135deg,#2563eb,#3b82f6);}
    .modal-btn-err{background:linear-gradient(135deg,#ef4444,#dc2626);}
    optgroup{font-weight:600;color:#2563eb;}
  `}</style>
);

// Fonction pour gérer les erreurs de chargement d'image
const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = "https://via.placeholder.com/280x280?text=Inscription+Entreprise";
};

export default function Register() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [secteur, setSecteur] = useState("");
  const [ville, setVille] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setApiError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setApiError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    const body = { username, email, password, tel, role: "ENTREPRISE", nomEntreprise, secteur, adresse: ville, description};
    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setModalMsg("Votre compte entreprise a été créé avec succès. Vous pouvez maintenant vous connecter et publier vos offres.");
        setShowSuccess(true);
        setUsername(""); setEmail(""); setPassword(""); setConfirmPassword(""); setTel("");
      } else {
        setApiError(data.message || "Une erreur est survenue.");
      }
    } catch { setApiError("Impossible de contacter le serveur."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <S />
      <nav className="nav">
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon"><IC.Briefcase /></div>
          <span className="nav-logo-text">Job<span>Board</span></span>
        </a>
        <span className="nav-link">Déjà inscrit ? <a href="/login">Se connecter</a></span>
      </nav>

      <div className="page fade">
        <div className="register-container">
          {/* Section Image - Côté gauche */}
          <div className="register-image">
            <div className="register-image-bg"></div>
            <div className="register-image-bg2"></div>
            <div className="register-image-content">
              <img
                src="http://localhost:3001/uploads/login.jpg"
                alt="Inscription Entreprise"
                onError={handleImageError}
              />
              <h3>Rejoignez-nous</h3>
              <p>Créez votre compte entreprise et commencez à recruter les meilleurs talents</p>
            </div>
          </div>

          {/* Section Formulaire - Côté droit */}
          <div className="register-form">
            <h2>Créer un compte Entreprise</h2>
            <p className="register-form-sub">Complétez votre profil pour commencer à publier vos offres d'emploi.</p>

            <form onSubmit={handleSubmit}>
              {/* Section compte */}
              <div className="section-label"><IC.User /> Informations du compte</div>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label"><span className="form-label-icon"><IC.User /></span>Nom du responsable</label>
                  <div className="input-wrap">
                    <span className="input-wrap-icon"><IC.User /></span>
                    <input className="form-input" type="text" placeholder="Votre nom complet" value={username} onChange={e => setUsername(e.target.value)} required />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label"><span className="form-label-icon"><IC.Phone /></span>Téléphone</label>
                  <div className="input-wrap">
                    <span className="input-wrap-icon"><IC.Phone /></span>
                    <input className="form-input" type="tel" placeholder="+216 XX XXX XXX" value={tel} onChange={e => setTel(e.target.value)} />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label"><span className="form-label-icon"><IC.Mail /></span>Email</label>
                  <div className="input-wrap">
                    <span className="input-wrap-icon"><IC.Mail /></span>
                    <input className="form-input" type="email" placeholder="contact@entreprise.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label"><span className="form-label-icon"><IC.Lock /></span>Mot de passe</label>
                  <div className="input-wrap" style={{ position: "relative" }}>
                    <span className="input-wrap-icon"><IC.Lock /></span>
                    <input className="form-input" type={showPwd ? "text" : "password"} placeholder="Minimum 6 caractères" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={{ paddingRight: 42, paddingLeft: 42 }} />
                    <button type="button" className="pwd-toggle" onClick={() => setShowPwd(p => !p)}>
                      {showPwd ? <IC.EyeOff /> : <IC.Eye />}
                    </button>
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label"><span className="form-label-icon"><IC.Lock /></span>Confirmer mot de passe</label>
                  <div className="input-wrap" style={{ position: "relative" }}>
                    <span className="input-wrap-icon"><IC.Lock /></span>
                    <input className="form-input" type={showConfirmPwd ? "text" : "password"} placeholder="Confirmez votre mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ paddingRight: 42, paddingLeft: 42 }} />
                    <button type="button" className="pwd-toggle" onClick={() => setShowConfirmPwd(p => !p)}>
                      {showConfirmPwd ? <IC.EyeOff /> : <IC.Eye />}
                    </button>
                  </div>
                </div>
              </div>

              <hr className="form-sep" />

              {/* Section entreprise */}
              <div className="section-label"><IC.Building /> Informations entreprise</div>
              <div className="form-grid">

                <div className="form-field">
                  <label className="form-label"><span className="form-label-icon"><IC.Building /></span>Nom de l'entreprise</label>
                  <div className="input-wrap">
                    <span className="input-wrap-icon"><IC.Building /></span>
                    <input className="form-input" type="text" placeholder="Nom officiel" value={nomEntreprise} onChange={e => setNomEntreprise(e.target.value)} required />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label"><span className="form-label-icon"><IC.Tag /></span>Secteur d'activité</label>
                  <div className="input-wrap">
                    <span className="input-wrap-icon"><IC.Tag /></span>
                    <select className="form-select" style={{ paddingLeft: 42 }} value={secteur} onChange={e => setSecteur(e.target.value)} required>
                      <option value="">Choisir un secteur…</option>
                      {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label"><span className="form-label-icon"><IC.MapPin /></span>Ville / Localité</label>
                  <div className="input-wrap">
                    <span className="input-wrap-icon"><IC.MapPin /></span>
                    <select className="form-select" style={{ paddingLeft: 42 }} value={ville} onChange={e => setVille(e.target.value)} required>
                      <option value="">Choisir une ville…</option>
                      <optgroup label="Grand Tunis">
                        <option>Tunis</option><option>Ariana</option><option>Ben Arous</option>
                        <option>La Manouba</option><option>La Marsa</option><option>Carthage</option>
                        <option>Sidi Bou Saïd</option><option>La Goulette</option>
                        <option>Hammam Lif</option><option>Radès</option><option>Mégrine</option>
                        <option>Mohamedia</option>
                      </optgroup>
                      <optgroup label="Nord-Est (Cap Bon)">
                        <option>Nabeul</option><option>Hammamet</option><option>Kelibia</option>
                        <option>Grombalia</option><option>Soliman</option><option>Korba</option>
                        <option>Takelsa</option><option>Menzel Temime</option>
                      </optgroup>
                      <optgroup label="Nord (Bizerte / Béja)">
                        <option>Bizerte</option><option>Menzel Bourguiba</option><option>Mateur</option>
                        <option>Béja</option><option>Zaghouan</option><option>El Fahs</option>
                      </optgroup>
                      <optgroup label="Nord-Ouest">
                        <option>Jendouba</option><option>Tabarka</option><option>Ain Draham</option>
                        <option>Ghardimaou</option><option>Le Kef</option><option>Siliana</option>
                        <option>Makthar</option><option>Dahmani</option>
                      </optgroup>
                      <optgroup label="Centre-Est (Sahel)">
                        <option>Sousse</option><option>Monastir</option><option>Mahdia</option>
                        <option>El Jem</option><option>Chebba</option><option>Sfax</option>
                        <option>Skhira</option><option>Kerkennah</option>
                      </optgroup>
                      <optgroup label="Centre-Ouest">
                        <option>Kairouan</option><option>Kasserine</option><option>Sbeitla</option>
                        <option>Thala</option><option>Haïdra</option><option>Sidi Bouzid</option>
                        <option>Regueb</option><option>Jelma</option>
                      </optgroup>
                      <optgroup label="Sud-Est">
                        <option>Gabès</option><option>Médenine</option><option>Zarzis</option>
                        <option>Ben Guerdane</option><option>Djerba — Houmt Souk</option>
                        <option>Djerba — Midoun</option><option>Tataouine</option><option>Ghomrassen</option>
                      </optgroup>
                      <optgroup label="Sud-Ouest">
                        <option>Gafsa</option><option>Metlaoui</option><option>Tozeur</option>
                        <option>Nefta</option><option>Kébili</option><option>Douz</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                

                <div className="form-field form-full">
                  <label className="form-label">
                    <span className="form-label-icon"><IC.FileText /></span>
                    Description
                    <span style={{ opacity: .5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}> (optionnel)</span>
                  </label>
                  <textarea className="form-textarea" rows={4} placeholder="Décrivez votre entreprise, votre activité, vos valeurs…" value={description} onChange={e => setDescription(e.target.value)} />
                </div>

              </div>

              {apiError && <div className="alert-err">❌ {apiError}</div>}

              <button type="submit" className="btn-submit" disabled={loading} style={{ marginTop: 24 }}>
                {loading
                  ? <><div className="spinner-sm" /> Création en cours…</>
                  : <><IC.Check /> Créer mon compte entreprise <IC.ArrowRight /></>
                }
              </button>
            </form>

            <p className="login-link">Déjà un compte ? <a href="/login">Se connecter</a></p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="modal-overlay overlay">
          <div className="modal-box">
            <div className="modal-icon modal-icon-ok"><IC.CheckCircle /></div>
            <h2 className="modal-title">Compte créé !</h2>
            <p className="modal-msg">{modalMsg}</p>
            <button className="modal-btn modal-btn-ok" onClick={() => { setShowSuccess(false); navigate("/login"); }}>
              Se connecter maintenant
            </button>
          </div>
        </div>
      )}
      {showError && (
        <div className="modal-overlay overlay">
          <div className="modal-box">
            <div className="modal-icon modal-icon-err"><IC.XCircle /></div>
            <h2 className="modal-title">Erreur</h2>
            <p className="modal-msg">{modalMsg}</p>
            <button className="modal-btn modal-btn-err" onClick={() => setShowError(false)}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}