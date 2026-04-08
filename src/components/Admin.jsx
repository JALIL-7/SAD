import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("news");
  const [news, setNews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newsletter, setNewsletter] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // News Form State
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsMedia, setNewsMedia] = useState("");
  const [newsType, setNewsType] = useState("text");
  const [mediaFile, setMediaFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setSession(session);
        fetchData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login");
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    const { data: newsData, error: newsError } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    const { data: msgData, error: msgError } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    const { data: nlData, error: nlError } = await supabase.from("newsletter").select("*").order("created_at", { ascending: false });
    
    if (newsError) console.error("Erreur News:", newsError.message);
    if (msgError) console.error("Erreur Messages:", msgError.message);
    if (nlError) console.error("Erreur Newsletter:", nlError.message);

    if (newsData) setNews(newsData);
    if (msgData) setMessages(msgData);
    if (nlData) setNewsletter(nlData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // CRUD News
  const handleSaveNews = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalMediaUrl = newsMedia;

    try {
      // Si un fichier est sélectionné, on le télécharge d'abord
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, mediaFile);

        if (uploadError) {
          throw new Error("Erreur Storage: " + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        finalMediaUrl = publicUrl;
      }

      const payload = { title: newsTitle, content: newsContent, media_url: finalMediaUrl, type: newsType };
      
      if (editingId) {
        const { error } = await supabase.from("news").update(payload).eq("id", editingId);
        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase.from("news").insert([payload]);
        if (error) throw error;
      }

      resetNewsForm();
      fetchData();
      alert(editingId ? "Actualité mise à jour !" : "Actualité publiée !");
    } catch (error) {
      console.error("Détails de l'erreur:", error);
      alert("Erreur: " + (error.message || "Problème de connexion au serveur"));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Supprimer cette actualité ?")) {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (!error) fetchData();
    }
  };

  const handleEditNews = (item) => {
    setEditingId(item.id);
    setNewsTitle(item.title);
    setNewsContent(item.content);
    setNewsMedia(item.media_url || "");
    setNewsType(item.type);
    setActiveTab("news-form");
  };

  const resetNewsForm = () => {
    setNewsTitle("");
    setNewsContent("");
    setNewsMedia("");
    setNewsType("text");
    setMediaFile(null);
    setEditingId(null);
  };

  if (!session) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Espace Admin SAD</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>Déconnexion</button>
      </header>

      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        <button onClick={() => setActiveTab("news")} style={{ border: 'none', background: activeTab === 'news' ? '#f7931e' : 'transparent', color: activeTab === 'news' ? '#fff' : '#333', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Actualités</button>
        <button onClick={() => { setActiveTab("news-form"); resetNewsForm(); }} style={{ border: 'none', background: activeTab === 'news-form' ? '#f7931e' : 'transparent', color: activeTab === 'news-form' ? '#fff' : '#333', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>+ Ajouter News</button>
        <button onClick={() => setActiveTab("messages")} style={{ border: 'none', background: activeTab === 'messages' ? '#f7931e' : 'transparent', color: activeTab === 'messages' ? '#fff' : '#333', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Messages ({messages.length})</button>
        <button onClick={() => setActiveTab("newsletter")} style={{ border: 'none', background: activeTab === 'newsletter' ? '#f7931e' : 'transparent', color: activeTab === 'newsletter' ? '#fff' : '#333', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Newsletter ({newsletter.length})</button>
      </nav>

      {loading && <p>Chargement des données...</p>}

      {activeTab === "news" && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {news.map(item => (
            <div key={item.id} style={{ border: '1px solid #eee', padding: '0', borderRadius: '1.2rem', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              {item.media_url && (
                <div style={{ width: '100%', height: '180px', overflow: 'hidden', background: '#f0f0f0', position: 'relative' }}>
                  {item.type === 'photo' ? (
                    <img src={item.media_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : item.type === 'video' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                      <iframe 
                        src={item.media_url.includes('youtube.com') ? item.media_url.replace('watch?v=', 'embed/') : item.media_url} 
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={item.title}
                      ></iframe>
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                      Texte seul
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    {item.type}
                  </div>
                </div>
              )}
              <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem', color: '#1e2a23' }}>{item.title}</h3>
                <p style={{ margin: '0 0 1.25rem', color: '#666', fontSize: '0.95rem', lineHeight: '1.5', flexGrow: 1 }}>
                  {item.content.length > 120 ? item.content.substring(0, 120) + "..." : item.content}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                  <button 
                    onClick={() => handleEditNews(item)} 
                    style={{ flex: 1, background: '#1e88e5', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '0.6rem', cursor: 'pointer', fontWeight: '600', transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => e.target.style.opacity = '0.9'}
                    onMouseOut={(e) => e.target.style.opacity = '1'}
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDeleteNews(item.id)} 
                    style={{ flex: 1, background: '#d32f2f', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '0.6rem', cursor: 'pointer', fontWeight: '600', transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => e.target.style.opacity = '0.9'}
                    onMouseOut={(e) => e.target.style.opacity = '1'}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
          {news.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#888' }}>Aucune actualité à afficher.</p>}
        </div>
      )}

      {(activeTab === "news-form") && (
        <form onSubmit={handleSaveNews} style={{ maxWidth: '600px', background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2>{editingId ? "Modifier l'actualité" : "Ajouter une actualité"}</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titre</label>
            <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contenu</label>
            <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} required rows="5" style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd' }}></textarea>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Fichier Média (Image ou Vidéo)</label>
            <input 
              type="file" 
              onChange={(e) => setMediaFile(e.target.files[0])} 
              style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} 
              accept={newsType === 'photo' ? 'image/*' : newsType === 'video' ? 'video/*' : '*/*'}
            />
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>Ou gardez l'URL existante : {newsMedia}</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Type de média</label>
            <select value={newsType} onChange={(e) => setNewsType(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1px solid #ddd' }}>
              <option value="text">Texte seul</option>
              <option value="photo">Photo</option>
              <option value="video">Vidéo</option>
            </select>
          </div>
          <button type="submit" disabled={uploading} style={{ background: '#f7931e', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', opacity: uploading ? 0.6 : 1 }}>
            {uploading ? "Chargement..." : editingId ? "Mettre à jour" : "Publier"}
          </button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); resetNewsForm(); setActiveTab("news"); }} style={{ marginLeft: '1rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>Annuler</button>}
        </form>
      )}

      {activeTab === "messages" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '1rem', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <strong>{msg.name} ({msg.email})</strong>
                <span style={{ color: '#888', fontSize: '0.85rem' }}>{new Date(msg.created_at).toLocaleString()}</span>
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</p>
            </div>
          ))}
          {messages.length === 0 && <p>Aucun message reçu.</p>}
        </div>
      )}

      {activeTab === "newsletter" && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #ddd' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Date d'inscription</th>
              </tr>
            </thead>
            <tbody>
              {newsletter.map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{sub.email}</td>
                  <td style={{ padding: '1rem' }}>{new Date(sub.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {newsletter.length === 0 && <p style={{ padding: '1rem' }}>Aucun abonné.</p>}
        </div>
      )}
    </div>
  );
}
