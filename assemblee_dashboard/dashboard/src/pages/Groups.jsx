import React from 'react';
import { Link } from 'react-router-dom';

function deputyPresencePct(d) {
  return d.stats?.total ? (d.stats.present / d.stats.total) * 100 : 0;
}

function groupAveragePresence(deputies) {
  if (!deputies.length) return '0.0';
  const sum = deputies.reduce((acc, d) => acc + deputyPresencePct(d), 0);
  return (sum / deputies.length).toFixed(1);
}

export default function GroupsPage({ data }) {
  const groups = Object.values(data.groups)
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .filter(g => g.totalVotes > 0);
  
  return (
    <div className="animate-fade-in">
      <div className="flex align-center justify-between mb-8">
        <div>
          <h1 style={{ marginBottom: '8px' }}>Groupes Politiques</h1>
          <p style={{ margin: 0 }}>Analyse des {groups.length} forces politiques de l'Hémicycle.</p>
        </div>
      </div>
      
      <div className="grid-3 animate-fade-in">
        {groups.map(g => {
           const members = data.deputies.filter(d => d.groupe === g.uid);
           const memberCount = members.length;
           const avgPresence = groupAveragePresence(members);
           const winRate = g.totalVotes > 0 ? ((g.victoires / g.totalVotes) * 100).toFixed(1) : 0;
           return (
             <Link key={g.uid} to={`/groups/${g.uid}`} className="glass-panel" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', transition: 'var(--transition)', border: '1px solid var(--panel-border)', borderTop: `6px solid ${g.couleur}`, padding: '24px' }}>
                <div className="flex align-center gap-4 mb-6">
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '16px', 
                    background: `${g.couleur}15`, 
                    color: g.couleur,
                    border: `1px solid ${g.couleur}44`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: '900', 
                    fontSize: '1.1rem',
                    boxShadow: `0 8px 16px ${g.couleur}11`
                  }}>
                    {g.abrege.slice(0, 3)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', lineHeight: '1.2' }}>{g.libelle}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', marginTop: '4px' }}>{g.abrege}</div>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2 mb-6" style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '12px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Membres</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{memberCount}</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prés. moy.</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent)' }}>{avgPresence}%</div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Votes</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{g.totalVotes}</div>
                  </div>
                </div>

                <div className="mt-auto">
                    <div className="flex align-center justify-between mb-2">
                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Taux de Victoire</span>
                        <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--success)' }}>{winRate}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                            height: '100%', 
                            width: `${winRate}%`, 
                            background: `linear-gradient(to right, #10b981, #34d399)`,
                            boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                            borderRadius: '4px' 
                        }}></div>
                    </div>
                </div>
             </Link>
           );
        })}
      </div>
    </div>
  );
}
