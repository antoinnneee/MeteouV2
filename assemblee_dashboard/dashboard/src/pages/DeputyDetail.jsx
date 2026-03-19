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
      <Link to="/deputies" className="btn mb-4" style={{ display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Retour à la liste
      </Link>
      
      <div className="glass-panel mb-8">
        <div className="flex align-center gap-4">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {deputy.prenom[0]}{deputy.nom[0]}
          </div>
          <div>
            <h1>{deputy.prenom} {deputy.nom}</h1>
            <span className="badge" style={{ background: `${group.couleur}40`, color: group.couleur, border: `1px solid ${group.couleur}` }}>
              {group.libelle}
            </span>
          </div>
        </div>
        
        <div className="grid-3 mt-4">
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Présence</p>
            <h2 style={{ margin: 0, color: 'var(--accent)' }}>{presence}%</h2>
            <div className="mt-4" style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: `${presence}%`, background: 'var(--accent)', borderRadius: '2px' }}></div>
            </div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Fidélité au parti</p>
            <h2 style={{ margin: 0, color: 'var(--success)' }}>{loyaute}%</h2>
            <div className="mt-4" style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: `${loyaute}%`, background: 'var(--success)', borderRadius: '2px' }}></div>
            </div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Votes rebelles</p>
            <h2 style={{ margin: 0, color: 'var(--danger)' }}>{deputy.stats.contre_groupe}</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', marginTop: '4px' }}>Votes contre la consigne</p>
          </div>
        </div>
      </div>
      
      <h2>Historique des votes de la période sélectionnée</h2>
      <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {voteHistory.map(s => {
          const vote = s.votes[id];
          let badgeColor = 'badge-neutral';
          if (vote === 'pour') badgeColor = 'badge-success';
          if (vote === 'contre') badgeColor = 'badge-danger';
          if (vote === 'abstention') badgeColor = 'badge-warning';
          
          return (
            <div key={s.uid} className="glass-panel" style={{ padding: '16px' }}>
              <div className="flex justify-between align-center mb-4">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Scrutin n°{s.numero} • {s.date}</span>
                <span className={`badge ${badgeColor}`} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  A voté {vote ? vote.toUpperCase() : 'ABSENT'}
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}><Link to={`/scrutins/${s.uid}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{s.titre}</Link></h3>
              <p style={{ margin: 0, fontSize: '0.85rem', marginTop: '8px' }}>Issue globale: <strong>{s.sort}</strong></p>
            </div>
          );
        })}
        {voteHistory.length === 0 && <p>Aucun historique de vote trouvé pour ces scrutins récents.</p>}
      </div>
    </div>
  );
}
