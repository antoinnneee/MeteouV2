import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

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
      <Link to="/groups" className="btn mb-8" style={{ display: 'inline-flex', gap: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '12px 20px' }}>
        <ArrowLeft size={18} /> 
        <span style={{ fontWeight: '700' }}>Retour aux groupes</span>
      </Link>
      
      <div className="glass-panel mb-8 animate-fade-in" style={{ padding: '40px', position: 'relative', overflow: 'hidden', borderTop: `6px solid ${group.couleur}` }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: group.couleur, opacity: 0.1, borderRadius: '50%', filter: 'blur(60px)' }}></div>
        
        <div className="flex align-center gap-6">
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            background: group.couleur, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.5rem', 
            fontWeight: '900', 
            color: 'white',
            boxShadow: `0 12px 24px ${group.couleur}44`
          }}>
            {group.abrege}
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{group.libelle}</h1>
            <div className="flex align-center gap-4" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                <div className="flex align-center gap-2">
                    <User size={16} />
                    <span>{members.length} Députés</span>
                </div>
                <span>•</span>
                <span>{group.abrege}</span>
            </div>
          </div>
        </div>
        
        <div className="grid-3 mt-10">
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '12px' }}>Taux de Victoire</div>
            <h2 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--success)', fontWeight: '900' }}>{winRate}%</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Sur {group.totalVotes} scrutins</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
        <div>
          <h2 style={{ marginBottom: '24px' }}>Membres ({members.length})</h2>
          <div className="glass-panel" style={{ maxHeight: '700px', overflowY: 'auto', padding: 0, borderRadius: '20px', border: '1px solid var(--panel-border)' }}>
             {members.map(m => {
                const loyalty = m.stats.total ? ((1 - (m.stats.contre_groupe / m.stats.total)) * 100).toFixed(0) : 100;
                return (
                  <Link key={m.uid} to={`/deputies/${m.uid}`} className="flex align-center justify-between hover-bg" style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'inherit', textDecoration: 'none', transition: 'var(--transition-fast)' }}>
                     <div className="flex align-center gap-3">
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800' }}>
                            {m.prenom[0]}{m.nom[0]}
                        </div>
                        <span style={{ fontWeight: '700' }}>{m.nom} {m.prenom}</span>
                     </div>
                     <span style={{ fontSize: '0.8rem', fontWeight: '800', color: loyalty < 80 ? 'var(--danger)' : 'var(--success)' }}>
                        {loyalty}% aligné
                     </span>
                  </Link>
                )
             })}
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: '24px' }}>Historique de vote</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {groupScrutins.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }} className="glass-panel">Aucun vote trouvé sur cette période.</p>}
            {groupScrutins.map(s => {
              const info = s.groupes[id];
              let statusColor = 'var(--text-secondary)';
              let bgColor = 'rgba(255,255,255,0.02)';
              if (info.position === 'pour') { statusColor = 'var(--success)'; bgColor = 'rgba(16, 185, 129, 0.05)'; }
              if (info.position === 'contre') { statusColor = 'var(--danger)'; bgColor = 'rgba(239, 68, 68, 0.05)'; }
              if (info.position === 'abstention') { statusColor = 'var(--warning)'; bgColor = 'rgba(245, 158, 11, 0.05)'; }
              
              return (
                <div key={s.uid} className="glass-panel animate-fade-in" style={{ padding: '24px', borderLeft: `4px solid ${statusColor}`, background: bgColor, borderRadius: '16px' }}>
                  <div className="flex justify-between align-center mb-4">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Scrutin n°{s.numero} • {s.date}</span>
                    <span className="badge" style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.85rem', 
                        fontWeight: '900',
                        color: statusColor,
                        background: 'rgba(0,0,0,0.2)',
                        border: `1px solid ${statusColor}33`,
                        borderRadius: '8px'
                    }}>
                      POSITION: {info.position?.toUpperCase() || 'AUCUNE'}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 20px 0', fontSize: '1.25rem' }}>
                    <Link to={`/scrutins/${s.uid}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', transition: 'var(--transition-fast)' }}>{s.titre}</Link>
                  </h4>
                  <div className="flex align-center gap-6" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Discipline de vote:</div>
                    <div className="flex gap-4" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                        <span style={{color: 'var(--success)'}}>{info.pour} Pour</span>
                        <span style={{color: 'var(--danger)'}}>{info.contre} Contre</span>
                        <span style={{color: 'var(--warning)'}}>{info.abstention} Abst.</span>
                        <span style={{opacity: 0.5}}>{info.absents} Absents</span>
                    </div>
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
