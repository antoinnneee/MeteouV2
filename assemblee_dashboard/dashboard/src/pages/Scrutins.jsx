import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScrutinsPage({ data }) {
  const [showAdoptedOnly, setShowAdoptedOnly] = useState(false);

  const scrutins = showAdoptedOnly 
    ? data.scrutins.filter(s => s.sort === 'adopté')
    : data.scrutins;

  return (
    <div className="animate-fade-in">
      <div className="flex align-center justify-between">
        <div>
          <h1>Scrutins Publics ({scrutins.length})</h1>
          <p>Résultats des lois et motions récentes.</p>
        </div>
        <button 
          className="btn" 
          onClick={() => setShowAdoptedOnly(!showAdoptedOnly)}
          style={{ background: showAdoptedOnly ? 'rgba(88, 166, 255, 0.2)' : '' }}
        >
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid currentColor', background: showAdoptedOnly ? 'currentColor' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showAdoptedOnly && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
          </div>
          Afficher uniquement les lois adoptées
        </button>
      </div>
      
      <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {scrutins.map(s => (
          <div key={s.uid} className="glass-panel">
            <div className="flex align-center justify-between mb-4">
              <span className={`badge ${s.sort === 'adopté' ? 'badge-success' : 'badge-danger'}`}>
                {s.sort.toUpperCase()}
              </span>
              <div className="flex align-center gap-4" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Calendar size={14} />
                {s.date || 'Non défini'}
              </div>
            </div>
            
            <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '8px' }}>
              Scrutin n°{s.numero}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
              <Link to={`/scrutins/${s.uid}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                {s.titre}
              </Link>
            </h3>
            
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                VOTES GLOBAUX : {s.synthese.pour || 0} Pour, {s.synthese.contre || 0} Contre, {s.synthese.abstentions || 0} Abstention, {577 - (Number(s.synthese.pour||0) + Number(s.synthese.contre||0) + Number(s.synthese.abstentions||0))} Absents
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', marginTop: '16px' }}>DÉTAIL PAR GROUPE</div>
              <div className="flex" style={{ gap: '8px', flexWrap: 'wrap' }}>
                {Object.entries(s.groupes).map(([gRef, dataValue]) => {
                  const group = data.groups[gRef];
                  if (!group) return null;
                  
                  const vote = dataValue.position;
                  let badgeColor = 'badge-neutral';
                  if (vote === 'pour') badgeColor = 'badge-success';
                  if (vote === 'contre') badgeColor = 'badge-danger';
                  if (vote === 'abstention') badgeColor = 'badge-warning';
                  
                  return (
                    <div key={gRef} className={`badge ${badgeColor}`} style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '6px 10px', gap: '4px' }}>
                      <strong>{group.abrege} : {vote.toUpperCase()}</strong>
                      <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>
                        {dataValue.pour} Pour • {dataValue.contre} Contre • {dataValue.abstention} Abst. • {dataValue.absents} Absents
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
