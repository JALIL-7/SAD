import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useTranslation } from "react-i18next";
import "../App.css";

function Home() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // Form states
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoadingNews(true);
    const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (data) setNews(data);
    setLoadingNews(false);
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("newsletter").insert([{ email: newsletterEmail }]);
    if (error) {
      if (error.code === '23505') setStatusMessage(i18n.language === 'fr' ? "Vous êtes déjà inscrit !" : "Already subscribed!");
      else setStatusMessage(i18n.language === 'fr' ? `Erreur : ${error.message}` : `Error: ${error.message}`);
    } else {
      setStatusMessage(i18n.language === 'fr' ? "Merci pour votre inscription !" : "Thanks for subscribing!");
      setNewsletterEmail("");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("contact_messages").insert([{ name: contactName, message: contactMessage, email: contactEmail }]);
    if (error) {
      setStatusMessage(i18n.language === 'fr' ? `Erreur : ${error.message}` : `Error: ${error.message}`);
    } else {
      setStatusMessage(i18n.language === 'fr' ? "Message envoyé avec succès !" : "Message sent successfully!");
      setContactName("");
      setContactMessage("");
      setContactEmail("");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="app-container">
      {statusMessage && (
        <div style={{ position: 'fixed', top: '2rem', right: '2rem', padding: '1rem', background: '#f7931e', color: '#fff', borderRadius: '0.5rem', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {statusMessage}
        </div>
      )}
      <a className="skip-link" href="#contenu">Aller au contenu</a>

      <header className="site-header" role="banner">
        <div className="container header-inner">
          <a href="/" className="brand" aria-label="Accueil SAD">
            <div className="brand-logo-container">
              <img src="/img/logo Image 2026-02-27 at 20.47.08.jpeg" alt="Logo SAD" className="brand-logo" />
            </div>
            <span className="brand-divider"></span>
            <span className="brand-stack">
              <span className="brand-title">
                <span>SOLIDARITÉ</span>
                <span>ACTIVE POUR LE</span>
                <span>DÉVELOPPEMENT</span>
              </span>
            </span>
          </a>
          <nav className="nav" aria-label="Navigation principale">
            <button 
              className="nav-toggle" 
              aria-expanded={menuOpen} 
              aria-controls="menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Menu
            </button>
            <ul id="menu" className={`nav-list ${menuOpen ? 'open' : ''}`}>
              <li><a href="#a-propos">{t('nav.about')}</a></li>
              <li><a href="#solutions">{t('nav.solutions')}</a></li>
              <li><a href="#histoires">{t('nav.stories')}</a></li>
              <li><a href="#projets">{t('nav.projects')}</a></li>
              <li><a href="#impact">{t('nav.impact')}</a></li>
              <li><a href="#engagement" className="btn-link">{t('nav.engagement')}</a></li>
              <li><a href="#contact">{t('nav.contact')}</a></li>
              <li><a href="/login">{t('nav.admin')}</a></li>
              <li>
                <select 
                  id="lang-switch" 
                  aria-label="Langue" 
                  value={i18n.language} 
                  onChange={(e) => changeLanguage(e.target.value)}
                  style={{ padding: '0.2rem', borderRadius: '0.4rem', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                >
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                </select>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="contenu" tabIndex="-1">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-bg" role="img" aria-label="Scène locale du canton"></div>
          <div className="container hero-inner">
            <div className="hero-copy">
              <h1 id="hero-title">{t('hero.title')}</h1>
              <p className="lead"><span className="slogan-badge">{t('hero.badge')}</span></p>
              <p className="problem">{t('hero.but')}</p>
              <div className="hero-cta">
                <a href="#engagement" className="btn primary">{t('hero.cta1')}</a>
                <a href="#projets" className="btn ghost">{t('hero.cta2')}</a>
              </div>
            </div>
          </div>
        </section>

        <section id="galerie" className="section" aria-labelledby="galerie-title">
          <div className="container">
            <header className="section-header">
              <h2 id="galerie-title">{t('news.title')}</h2>
              <p>{t('news.desc')}</p>
            </header>
            <div id="media-gallery" className="cards-flex">
              {loadingNews ? (
                <p>{t('news.loading')}</p>
              ) : news.length > 0 ? (
                news.map((item) => (
                  <article key={item.id} className="card">
                    {item.media_url && (
                      <div className="news-media-preview" style={{ marginBottom: '1rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        {item.type === 'photo' ? (
                          <img src={item.media_url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        ) : item.type === 'video' ? (
                          <div className="video-container">
                            <iframe 
                              src={item.media_url.includes('youtube.com') ? item.media_url.replace('watch?v=', 'embed/') : item.media_url} 
                              title={item.title}
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : null}
                      </div>
                    )}
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                  </article>
                ))
              ) : (
                <p>{t('news.empty')}</p>
              )}
            </div>
          </div>
        </section>

        <section id="a-propos" className="section muted" aria-labelledby="apropos-title">
          <div className="container">
            <header className="section-header">
              <h2 id="apropos-title">{t('about.title')}</h2>
              <p>{t('about.desc')}</p>
            </header>
            <div className="grid-3">
              <article className="card">
                <h3>{t('about.siege')}</h3>
                <p>Siège social : Atakpamé (Quartier Sada), Préfecture de l’Ogou.<br/>Adresse : BP 97 Atakpamé – Togo.<br/>Tél. : (00228) 90 03 16 84 / 98 38 74 44 / 90 90 20 61.</p>
              </article>
              <article className="card">
                <h3>{t('about.vision')}</h3>
                <p>Un environnement où les groupes vulnérables (enfants/jeunes, femmes, personnes âgées, personnes vivant avec handicap et autres minorités) jouissent pleinement de leurs droits et participent librement et activement au développement local.</p>
              </article>
              <article className="card">
                <h3>{t('about.mission')}</h3>
                <p>Contribuer à l’épanouissement des groupes vulnérables dans les communautés par la protection, la participation et la promotion d’initiatives durables.</p>
              </article>
            </div>
            <div className="card card--top-margin" style={{marginTop: '1.5rem'}}>
              <h3>{t('about.but_title')}</h3>
              <p>Améliorer les conditions de vie socio‑économiques et culturelles des communautés à la base par une approche de développement humain durable, inclusif et participatif.</p>
            </div>
          </div>
        </section>

        <section id="solutions" className="section" aria-labelledby="solutions-title">
          <div className="container">
            <header className="section-header">
              <h2 id="solutions-title">{t('nav.solutions')}</h2>
              <p>Trois domaines d’intervention, conformément aux orientations officielles.</p>
            </header>
            <div className="grid-3">
              <article className="card action">
                <h3>Santé et éducation</h3>
                <p>Promotion des soins de santé de qualité et d’une éducation de qualité pour tous, avec amélioration du pouvoir d’achat des ménages.</p>
              </article>
              <article className="card action">
                <h3>Droits et protection</h3>
                <p>Protection des groupes vulnérables : enfants/jeunes, femmes, personnes âgées, personnes vivant avec handicap et autres minorités.</p>
              </article>
              <article className="card action">
                <h3>Parrainage</h3>
                <p>Parrainage des enfants et des jeunes pour soutenir leur parcours scolaire et social.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="histoires" className="section muted" aria-labelledby="histoires-title">
          <div className="container">
            <header className="section-header">
              <h2 id="histoires-title">{t('nav.stories')}</h2>
              <p>Des parcours courts et vrais qui montrent des progrès visibles.</p>
            </header>
            <div className="stories">
              <figure className="story">
                <blockquote>Avant, ma fille marchait longtemps pour l’école. Avec le club lecture du village, elle a rattrapé son retard et retrouve confiance.</blockquote>
                <figcaption>Une mère du canton</figcaption>
              </figure>
              <figure className="story">
                <blockquote>Le groupe d’épargne nous a permis d’acheter de petits outils. Maintenant, nous produisons plus et vendons mieux.</blockquote>
                <figcaption>Un petit producteur</figcaption>
              </figure>
              <figure className="story">
                <blockquote>Grâce aux séances de prévention, j’ai appris des gestes simples pour protéger la santé de mes enfants.</blockquote>
                <figcaption>Une jeune cheffe de ménage</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="projets" className="section" aria-labelledby="projets-title">
          <div className="container">
            <header className="section-header">
              <h2 id="projets-title">{t('nav.projects')}</h2>
              <p>Des projets concrets, visibles sur le terrain.</p>
            </header>
            <div className="cards-flex">
              <article className="card project">
                <h3>En cours</h3>
                <ul className="list">
                  <li>Clubs lecture dans 4 villages</li>
                  <li>Campagnes de sensibilisation santé</li>
                  <li>Groupes d’épargne communautaires</li>
                </ul>
              </article>
              <article className="card project">
                <h3>Réalisés</h3>
                <ul className="list">
                  <li>120 kits scolaires distribués</li>
                  <li>3 points d’eau réhabilités</li>
                  <li>Plantation de 1 500 arbres</li>
                </ul>
              </article>
              <article className="card project">
                <h3>À venir</h3>
                <ul className="list">
                  <li>Jardins familiaux pilote</li>
                  <li>Appui à l’entrepreneuriat des jeunes</li>
                  <li>Ateliers santé maternelle</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section id="impact" className="section muted" aria-labelledby="impact-title">
          <div className="container">
            <header className="section-header">
              <h2 id="impact-title">{t('nav.impact')}</h2>
              <p>Des chiffres simples qui racontent des progrès concrets.</p>
            </header>
            <div className="stats">
              <div className="stat">
                <div className="stat-number">1500</div>
                <div className="stat-label">arbres plantés</div>
              </div>
              <div className="stat">
                <div className="stat-number">120</div>
                <div className="stat-label">kits scolaires</div>
              </div>
              <div className="stat">
                <div className="stat-number">7</div>
                <div className="stat-label">villages couverts</div>
              </div>
              <div className="stat">
                <div className="stat-number">300</div>
                <div className="stat-label">familles accompagnées</div>
              </div>
            </div>
          </div>
        </section>

        <section id="engagement" className="section cta" aria-labelledby="engagement-title">
          <div className="container">
            <header className="section-header">
              <h2 id="engagement-title">{t('nav.engagement')}</h2>
              <p>Chacun peut contribuer, selon ses envies et ses forces.</p>
            </header>
            <div className="grid-3">
              <article className="card engage">
                <h3>Devenir bénévole</h3>
                <p>Donner un peu de temps pour les activités du canton.</p>
                <a className="btn secondary" href="#contact">Je me propose</a>
              </article>
              <article className="card engage">
                <h3>Soutenir un projet</h3>
                <p>Participer à l’achat de kits, d’arbres ou d’équipements.</p>
                <a className="btn secondary" href="#contact">Je soutiens</a>
              </article>
              <article className="card engage">
                <h3>Rejoindre l’initiative</h3>
                <p>Faire partie d’un réseau local d’entraide.</p>
                <a className="btn secondary" href="#contact">Je rejoins</a>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="section" aria-labelledby="contact-title">
          <div className="container">
            <header className="section-header">
              <h2 id="contact-title">{t('contact.title')}</h2>
              <p>{t('contact.desc')}</p>
            </header>
            <div className="contact-grid">
              <form id="newsletter" className="card form" aria-labelledby="newsletter-title" onSubmit={handleNewsletterSubmit}>
                <h3 id="newsletter-title">{t('contact.newsletter_title')}</h3>
                <div className="field">
                  <label htmlFor="email">{t('contact.email_label')}</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="vous@exemple.com" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn primary">{t('contact.subscribe')}</button>
                <p className="form-hint">{t('contact.newsletter_hint')}</p>
              </form>
              <form id="contact-form" className="card form" aria-labelledby="contact-form-title" onSubmit={handleContactSubmit}>
                <h3 id="contact-form-title">{t('contact.write_us')}</h3>
                <div className="field">
                  <label htmlFor="nom">{t('contact.name_label')}</label>
                  <input 
                    id="nom" 
                    name="nom" 
                    type="text" 
                    placeholder="Votre nom" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required 
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact_email">{t('contact.email_label')} ({i18n.language === 'fr' ? 'facultatif' : 'optional'})</label>
                  <input 
                    id="contact_email" 
                    name="contact_email" 
                    type="email" 
                    placeholder="vous@exemple.com" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="message">{t('contact.message_label')}</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="4" 
                    placeholder="Votre message" 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn secondary">{t('contact.send')}</button>
                <p className="form-hint">{t('contact.contact_hint')} <a href="mailto:ongsadatg@gmail.com">ongsadatg@gmail.com</a> ou <a href="mailto:solidarite.active1@gmail.com">solidarite.active1@gmail.com</a> — Tél. (00228) 90 03 16 84 / 98 38 74 44 / 90 90 20 61.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" role="contentinfo">
        <div className="container footer-inner">
          <p><strong>SAD</strong> – Solidarité Active pour le Développement</p>
          <p>Ensemble pour le bien‑être des enfants et des communautés.</p>
          <nav aria-label="Liens de bas de page">
            <a href="#a-propos">{t('nav.about')}</a>
            <a href="#solutions">{t('nav.solutions')}</a>
            <a href="#projets">{t('nav.projects')}</a>
            <a href="#contact">{t('nav.contact')}</a>
          </nav>
          <div className="social">
            <a aria-label="Facebook" href="#" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#1877F2" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.7c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>
            </a>
            <a aria-label="TikTok" href="#" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#000" aria-hidden="true"><path d="M17 6.4c.9.7 2 1.2 3.2 1.3v2.5a6.9 6.9 0 0 1-3.3-.9v5.3a4.8 4.8 0 1 1-4.8-4.8c.2 0 .4 0 .6.1v2.6a2.2 2.2 0 1 0 1.6 2.1V3h2.7c.1 1.3.8 2.5 2 3.4z"/></svg>
            </a>
            <a aria-label="WhatsApp" href="#" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#25D366" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.9 14.7L2 22l5.4-1.9A10 10 0 1 0 12 2zm5.7 14.1c-.2.6-1.1 1.1-1.5 1.2-.4.1-.9.1-1.5-.1-.4-.1-1-.3-1.7-.7-3-1.7-5-4.9-5.2-5.1-.2-.2-1.2-1.6-1.2-3s.8-2.1 1.1-2.4c.3-.3.7-.3 1-.3h.7c.2 0 .5 0 .7.6.2.6.9 2.1 1 2.3.1.2.1.4 0 .6-.1.2-.3.4-.5.6-.2.2-.4.5-.2.9.2.4.9 1.4 1.9 2.2 1.3 1 2.3 1.3 2.7 1.4.3.1.6.1.8-.1.3-.2 1-1.1 1.2-1.5.2-.4.5-.4.8-.2.3.2 2.1 1 2.4 1.2.3.2.5.3.5.5z"/></svg>
            </a>
            <a aria-label="LinkedIn" href="#" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#0A66C2" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7H9.32V9h3.4v1.56h.05c.47-.88 1.62-1.8 3.34-1.8 3.57 0 4.23 2.35 4.23 5.41v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
