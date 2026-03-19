import React from 'react';
import { Link } from 'react-router-dom';

export default function GroupsPage({ data }) {
  const groups = Object.values(data.groups)
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .filter(g => g.totalVotes > 0);
  
  return (
    <div className="animate-fade-in">
      <div className="flex align-center justify-between mb-6">
        <div>
          <h1>Groupes Politiques</h1>
          <p>Analyse des {groups.length} groupes parlementaires actifs sur la période sélectionnée.</p>
        </div>
      </div>
      
      <div className="grid-3">
        {groups.map(g => {
           const memberCount = data.deputies.filter(d => d.groupe === g.uid).length;
           const winRate = g.totalVotes > 0 ? ((g.victoires / g.totalVotes) * 100).toFixed(1) : 0;
           return (
             <Link key={g.uid} to={`/groups/${g.uid}`} className="glass-panel" style={{ textDecoration: 'none', color: 'inherit', display: 'block', borderTop: `4px solid ${g.couleur}` }}>
               <div className="flex align-center gap-3 mb-4">
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: g.couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                   {g.abrege.slice(0, 4)}
                 </div>
                 <div>
                   <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{g.libelle}</h3>
                 </div>
               </div>
               <div className="flex justify-between" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                 <span>{memberCount} Députés affiliés</span>
                 <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{winRate}% de Victoire</span>
               </div>
             </Link>
           );
        })}
      </div>
    </div>
  );
}
