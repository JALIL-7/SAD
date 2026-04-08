import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f6f1ea' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 8px 24px rgba(0,0,0,.08)', width: '300px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Connexion Admin</h2>
        {error && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #dcd6cb' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mot de passe</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #dcd6cb' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', background: '#f7931e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
