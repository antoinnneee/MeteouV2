import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Calendar, Landmark } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import DashboardPage from './pages/Dashboard';
import DeputiesPage from './pages/Deputies';
import ScrutinsPage from './pages/Scrutins';
import DeputyDetailPage from './pages/DeputyDetail';
import ScrutinDetailPage from './pages/ScrutinDetail';
import GroupsPage from './pages/Groups';
import GroupDetailPage from './pages/GroupDetail';
import './index.css';

function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <h2>Assemblée Nationale</h2>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/deputies" className={`nav-link ${location.pathname.startsWith('/deputies') ? 'active' : ''}`}>
          <Users size={20} /> Députés
        </Link>
        <Link to="/groups" className={`nav-link ${location.pathname.startsWith('/groups') ? 'active' : ''}`}>
          <Landmark size={20} /> Groupes Politiques
        </Link>
        <Link to="/scrutins" className={`nav-link ${location.pathname.startsWith('/scrutins') ? 'active' : ''}`}>
          <FileText size={20} /> Scrutins
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [lastXCount, setLastXCount] = useState(100);

  useEffect(() => {
    fetch('/db.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load db.json", err);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return null;
    
    // 1. Filter scrutins by dateRange
    const now = new Date('2026-03-19'); // using today's simulated date
    let scrutins = data.scrutins.filter(s => {
       if (dateRange === 'all' || dateRange === 'lastX') return true;
       if (!s.date) return false;
       
       if (dateRange === 'custom') {
           if (customStart && s.date < customStart) return false;
           if (customEnd && s.date > customEnd) return false;
           return true;
       }
       
       const d = new Date(s.date);
       if (dateRange === 'last30') return (now - d) / (1000*3600*24) <= 30;
       if (dateRange === 'last90') return (now - d) / (1000*3600*24) <= 90;
       if (dateRange === '2026') return d.getFullYear() === 2026;
       if (dateRange === '2025') return d.getFullYear() === 2025;
       if (dateRange === '2024') return d.getFullYear() === 2024;
       return true;
    });

    if (dateRange === 'lastX') {
       scrutins = scrutins.slice(0, lastXCount);
    }

    // 2. Clone deputies and reset stats
    const deputies = data.deputies.map(d => ({ 
      ...d, 
      stats: { present: 0, absent: 0, total: 0, contre_groupe: 0 } 
    }));
    
    // Clone groups
    const groups = {};
    for (const k in data.groups) {
        groups[k] = { ...data.groups[k], victoires: 0, totalVotes: 0 };
    }
    
    const alignment = {};
    const alignment_total = {};
    for (const k in groups) {
        alignment[k] = {};
        alignment_total[k] = {};
    }

    // 3. Recalculate based ONLY on filtered scrutins
    for (const s of scrutins) {
       const isAdopted = s.sort?.toLowerCase() === 'adopté';
       
       // Group stats
       const gKeys = Object.keys(s.groupes);
       for (const gRef of gKeys) {
         if (!groups[gRef]) continue;
         const pos = s.groupes[gRef].position;
         groups[gRef].totalVotes++;
         
         if ((isAdopted && pos === 'pour') || (!isAdopted && pos === 'contre')) {
            groups[gRef].victoires++;
         }
         
         for (const gRef2 of gKeys) {
             if (gRef === gRef2) continue;
             const pos2 = s.groupes[gRef2]?.position;
             if (['pour', 'contre'].includes(pos) && ['pour', 'contre'].includes(pos2)) {
                 if (!alignment_total[gRef][gRef2]) alignment_total[gRef][gRef2] = 0;
                 if (!alignment[gRef][gRef2]) alignment[gRef][gRef2] = 0;
                 
                 alignment_total[gRef][gRef2]++;
                 if (pos === pos2) alignment[gRef][gRef2]++;
             }
         }
       }
       
       // Deputy stats
       for (const dep of deputies) {
          dep.stats.total++;
          const actual_vote = s.votes ? s.votes[dep.uid] : null;
          if (actual_vote && actual_vote !== 'nonVotant') {
              dep.stats.present++;
              const myGroupPos = s.groupes[dep.groupe]?.position;
              if (myGroupPos && ['pour', 'contre'].includes(myGroupPos) && ['pour', 'contre'].includes(actual_vote)) {
                  if (actual_vote !== myGroupPos) dep.stats.contre_groupe++;
              }
          } else {
              dep.stats.absent++;
          }
       }
    }
    
    // Compute final alignment percentages
    const final_alignment = {};
    for (const g1 in alignment) {
       final_alignment[g1] = {};
       for (const g2 in alignment[g1]) {
           const tot = alignment_total[g1][g2];
           final_alignment[g1][g2] = tot ? Math.round((alignment[g1][g2] / tot) * 100) : 0;
       }
    }

    return { 
       scrutins, 
       deputies, 
       groups, 
       alignment_matrix: final_alignment 
    };
  }, [data, dateRange, customStart, customEnd, lastXCount]);

  if (loading) {
    return <div className="app-container"><div className="main-content"><h1>Chargement des données...</h1></div></div>;
  }

  if (!data) {
    return <div className="app-container"><div className="main-content"><h1>Erreur de chargement des données.</h1></div></div>;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <header className="flex align-center justify-between mb-8 animate-fade-in" style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--panel-border)' }}>
            <div className="flex align-center gap-4">
              <div className="glass-panel" style={{ padding: '0.75rem', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <Calendar size={22} color="var(--accent)" />
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Période d'analyse</h4>
                <div className="flex align-center gap-3 mt-1">
                  <select 
                    value={dateRange} 
                    onChange={e => setDateRange(e.target.value)}
                    className="input" 
                    style={{ width: 'auto', minWidth: '220px', padding: '10px 16px', fontWeight: '600' }}
                  >
                    <option value="lastX">Derniers X Scrutins</option>
                    <option value="all">Historique complet</option>
                    <option value="custom">Période Personnalisée</option>
                    <option value="last30">30 derniers jours</option>
                    <option value="last90">90 derniers jours</option>
                    <option value="2026">Année 2026</option>
                    <option value="2025">Année 2025</option>
                    <option value="2024">Année 2024</option>
                  </select>
                  
                  {dateRange === 'custom' && (
                    <div className="flex align-center gap-2 animate-fade-in">
                      <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="input" style={{ width: 'auto' }} />
                      <span style={{color: 'var(--text-secondary)', fontWeight: 'bold'}}>→</span>
                      <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="input" style={{ width: 'auto' }} />
                    </div>
                  )}
                  
                  {dateRange === 'lastX' && (
                    <div className="flex align-center gap-2 animate-fade-in">
                      <input type="number" min="1" max="10000" value={lastXCount} onChange={e => setLastXCount(parseInt(e.target.value) || 100)} className="input" style={{ width: '100px', textAlign: 'center' }} />
                      <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600'}}>Scrutins</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex align-center gap-4">
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut Système</div>
                <div className="flex align-center gap-2 mt-1">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Live Data</span>
                </div>
              </div>
            </div>
          </header>
          <Routes>
            <Route path="/" element={<DashboardPage data={filteredData} />} />
            <Route path="/deputies" element={<DeputiesPage data={filteredData} />} />
            <Route path="/deputies/:id" element={<DeputyDetailPage data={filteredData} />} />
            <Route path="/groups" element={<GroupsPage data={filteredData} />} />
            <Route path="/groups/:id" element={<GroupDetailPage data={filteredData} />} />
            <Route path="/scrutins" element={<ScrutinsPage data={filteredData} />} />
            <Route path="/scrutins/:id" element={<ScrutinDetailPage data={filteredData} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
