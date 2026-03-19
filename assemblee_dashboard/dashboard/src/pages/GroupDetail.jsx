import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function GroupDetailPage({ data }) {
  const { id } = useParams();
  const group = data.groups[id];
  
  if (!group) return <div className="glass-panel">Groupe introuvable ou inactif sur la période.</div>;
  
  const members = data.deputies
    .filter(d => d.groupe === id)
    .sort((a,b) => a.nom.localeCompare(b.nom));
    
  const winRate = group.totalVotes ? ((group.victoires / group.totalVotes) * 100).toFixed(1) : 0;

  // Find all scrutins where this group took a position
  const groupScrutins = data.scrutins.filter(s => s.groupes[id]);

  return (
    <div className="animate-fade-in">
      <Link to="/groups" className="btn mb-4" style={{ display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Retour aux groupes
      </Link>
      
      <div className="glass-panel mb-8" style={{ borderTop: `4px solid ${group.couleur}` }}>
        <div className="flex align-center gap-4">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: group.couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
            {group.abrege}
          </div>
          <div>
            <h1>{group.libelle}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{members.length} Députés enregistrés</p>
          </div>
        </div>
        
        <div className="grid-3 mt-4">
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Taux de Victoire (Position adoptée)</p>
            <h2 style={{ margin: 0, color: 'var(--success)' }}>{winRate}%</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', marginTop: '4px' }}>Basé sur {group.totalVotes} positionnements officiels</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <h2>Membres du groupe ({members.length})</h2>
          <div className="glass-panel" style={{ maxHeight: '600px', overflowY: 'auto', padding: 0 }}>
             {members.map(m => {
                const loyalty = m.stats.total ? ((1 - (m.stats.contre_groupe / m.stats.total)) * 100).toFixed(0) : 100;
                return (
                  <Link key={m.uid} to={`/deputies/${m.uid}`} className="flex align-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'inherit', textDecoration: 'none' }}>
                     <span>{m.nom} {m.prenom}</span>
                     <span style={{ fontSize: '0.8rem', color: loyalty < 80 ? 'var(--danger)' : 'var(--success)' }}>
                        {loyalty}% aligné
                     </span>
                  </Link>
                )
             })}
          </div>
        </div>

        <div style={{ flex: '2 1 400px', minWidth: 0 }}>
          <h2>Historique de vote (Position de groupe)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
            {groupScrutins.length === 0 && <p className="text-secondary">Aucun vote trouvé sur cette période.</p>}
            {groupScrutins.map(s => {
              const info = s.groupes[id];
              let badgeColor = 'badge-neutral';
              if (info.position === 'pour') badgeColor = 'badge-success';
              if (info.position === 'contre') badgeColor = 'badge-danger';
              if (info.position === 'abstention') badgeColor = 'badge-warning';
              
              return (
                <div key={s.uid} className="glass-panel" style={{ padding: '16px' }}>
                  <div className="flex justify-between align-center mb-2">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Scrutin n°{s.numero} • {s.date}</span>
                    <span className={`badge ${badgeColor}`} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                      Majeur: {info.position?.toUpperCase() || 'AUCUNE'}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>
                    <Link to={`/scrutins/${s.uid}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{s.titre}</Link>
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
                    <strong>Bilan de discipline :</strong>
                    <span style={{color: 'var(--success)'}}>{info.pour} Pour</span>
                    <span style={{color: 'var(--danger)'}}>{info.contre} Contre</span>
                    <span style={{color: 'var(--warning)'}}>{info.abstention} Abst.</span>
                    <span style={{opacity: 0.5}}>{info.absents} Absents</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
