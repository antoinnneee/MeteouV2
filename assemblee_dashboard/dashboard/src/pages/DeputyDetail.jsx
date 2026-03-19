import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar } from 'lucide-react';

export default function DeputyDetailPage({ data }) {
  const { id } = useParams();
  
  const deputy = data.deputies.find(d => d.uid === id);
  
  if (!deputy) return <div className="glass-panel">Député introuvable</div>;
  
  const group = data.groups[deputy.groupe] || { libelle: 'Non inscrit', couleur: '#666' };
  
  const presence = deputy.stats.total ? (deputy.stats.present / deputy.stats.total * 100).toFixed(1) : 0;
  const loyaute = deputy.stats.total ? ((1 - (deputy.stats.contre_groupe / deputy.stats.total)) * 100).toFixed(1) : 100;

  // Find all scrutins where this deputy voted
  const voteHistory = data.scrutins.filter(s => s.votes && s.votes[id]);

  return (
    <div className="animate-fade-in">
      <Link to="/deputies" className="btn mb-8 animate-fade-in" style={{ display: 'inline-flex', gap: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '12px 20px' }}>
        <ArrowLeft size={18} /> 
        <span style={{ fontWeight: '700' }}>Retour à la liste</span>
      </Link>
      
      <div className="glass-panel mb-8 animate-fade-in" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: group.couleur, opacity: 0.15, borderRadius: '50%', filter: 'blur(40px)' }}></div>
        
        <div className="flex align-center gap-6">
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '20px', 
            background: `linear-gradient(135deg, ${group.couleur}66 0%, ${group.couleur}22 100%)`, 
            border: `1px solid ${group.couleur}44`,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.8rem', 
            fontWeight: '900',
            color: '#fff',
            boxShadow: `0 10px 20px ${group.couleur}22`
          }}>
            {deputy.prenom[0]}{deputy.nom[0]}
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{deputy.prenom} {deputy.nom}</h1>
            <div className="flex align-center gap-3">
              <span className="badge" style={{ background: `${group.couleur}15`, color: group.couleur, border: `1px solid ${group.couleur}44`, padding: '8px 16px', fontSize: '0.9rem', borderRadius: '12px' }}>
                {group.libelle}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>UID: {deputy.uid}</span>
            </div>
          </div>
        </div>
        
        <div className="grid-3 mt-10">
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', border: '1px solid var(--panel-border)' }}>
            <div className="flex align-center gap-3 mb-4">
              <Calendar size={18} color="var(--accent)" />
              <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Taux de Présence</h4>
            </div>
            <h2 style={{ fontSize: '2.2rem', margin: '0 0 12px 0', color: 'var(--text-primary)' }}>{presence}%</h2>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${presence}%`, background: 'linear-gradient(to right, var(--accent), #818cf8)', borderRadius: '4px' }}></div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', border: '1px solid var(--panel-border)' }}>
            <div className="flex align-center gap-3 mb-4">
              <User size={18} color="var(--success)" />
              <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fidélité au Groupe</h4>
            </div>
            <h2 style={{ fontSize: '2.2rem', margin: '0 0 12px 0', color: 'var(--text-primary)' }}>{loyaute}%</h2>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${loyaute}%`, background: 'linear-gradient(to right, var(--success), #34d399)', borderRadius: '4px' }}></div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', border: '1px solid var(--panel-border)' }}>
            <div className="flex align-center gap-3 mb-4">
              <ArrowLeft size={18} color="var(--danger)" style={{ transform: 'rotate(45deg)' }} />
              <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Votes Rebelles</h4>
            </div>
            <h2 style={{ fontSize: '2.2rem', margin: '0 0 4px 0', color: 'var(--danger)' }}>{deputy.stats.contre_groupe}</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Sur {deputy.stats.total} scrutins</p>
          </div>
        </div>
      </div>
      
      <div className="flex align-center justify-between mb-6">
        <h2 style={{ margin: 0 }}>Historique des votes</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Période sélectionnée</div>
      </div>

      <div className="mt-4 flex flex-column gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {voteHistory.map(s => {
          const vote = s.votes[id];
          let statusColor = 'var(--text-secondary)';
          let bgColor = 'rgba(255,255,255,0.02)';
          if (vote === 'pour') { statusColor = 'var(--success)'; bgColor = 'rgba(16, 185, 129, 0.05)'; }
          if (vote === 'contre') { statusColor = 'var(--danger)'; bgColor = 'rgba(239, 68, 68, 0.05)'; }
          if (vote === 'abstention') { statusColor = 'var(--warning)'; bgColor = 'rgba(245, 158, 11, 0.05)'; }
          
          return (
            <div key={s.uid} className="glass-panel" style={{ padding: '24px', borderLeft: `4px solid ${statusColor}`, background: bgColor }}>
              <div className="flex justify-between align-center mb-3">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Scrutin n°{s.numero} • {s.date}
                </div>
                <div className="flex align-center gap-2">
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>VOTE INDIVIDUEL :</span>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: '900', 
                    color: statusColor, 
                    padding: '4px 12px', 
                    borderRadius: '8px', 
                    background: 'rgba(0,0,0,0.2)',
                    border: `1px solid ${statusColor}33`
                  }}>
                    {vote ? vote.toUpperCase() : 'ABSENT'}
                  </span>
                </div>
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0' }}>
                <Link to={`/scrutins/${s.uid}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', transition: 'var(--transition-fast)' }}>{s.titre}</Link>
              </h3>
              <div className="flex align-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Issue globale : <strong style={{ color: s.sort === 'adopté' ? 'var(--success)' : 'var(--danger)' }}>{s.sort.toUpperCase()}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Alignement : <strong>{vote === s.groupes[deputy.groupe]?.position ? 'CONFORME AU GROUPE' : 'VOTE REBELLE'}</strong>
                </div>
              </div>
            </div>
          );
        })}
        {voteHistory.length === 0 && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Aucun historique de vote trouvé pour ces scrutins récents.</p>
          </div>
        )}
      </div>
    </div>
  );
}
