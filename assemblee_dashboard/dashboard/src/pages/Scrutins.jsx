import React, { useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScrutinsPage({ data }) {
  const [showAdoptedOnly, setShowAdoptedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;

  const scrutins = showAdoptedOnly 
    ? data.scrutins.filter(s => s.sort === 'adopté')
    : data.scrutins;

  const totalPages = Math.ceil(scrutins.length / pageSize);
  const currentScrutins = scrutins.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex align-center justify-between mb-8">
        <div>
          <h1 style={{ marginBottom: '8px' }}>Scrutins Publics</h1>
          <p style={{ margin: 0 }}>Analyse des {scrutins.length} derniers votes solennels de l'Assemblée.</p>
        </div>
        <button 
          className={`btn ${showAdoptedOnly ? 'btn-primary' : ''}`} 
          onClick={() => { setShowAdoptedOnly(!showAdoptedOnly); setCurrentPage(1); }}
          style={{ padding: '12px 24px', borderRadius: '12px' }}
        >
          <CheckCircle size={18} />
          <span style={{ fontWeight: '700' }}>Uniquement les lois adoptées</span>
        </button>
      </div>
      
      <div className="mt-8 flex flex-column gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {currentScrutins.map(s => (
          <div key={s.uid} className="glass-panel" style={{ padding: '32px', border: '1px solid var(--panel-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: s.sort === 'adopté' ? 'var(--success)' : 'var(--danger)' }}></div>
            
            <div className="flex align-center justify-between mb-6">
              <div className="flex align-center gap-3">
                <span className={`badge ${s.sort === 'adopté' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem' }}>
                  {s.sort.toUpperCase()}
                </span>
                <span style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                  SCRUTIN N°{s.numero}
                </span>
              </div>
              <div className="flex align-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>
                <Calendar size={16} />
                {s.date || 'Date inconnue'}
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', lineHeight: '1.3' }}>
              <Link to={`/scrutins/${s.uid}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', transition: 'var(--transition-fast)' }}>
                {s.titre}
              </Link>
            </h3>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
              <div className="flex align-center justify-between mb-4">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>Résultat Global</div>
                <div className="flex gap-4">
                  <span style={{ color: 'var(--success)', fontWeight: '800' }}>{s.synthese.pour || 0} Pour</span>
                  <span style={{ color: 'var(--danger)', fontWeight: '800' }}>{s.synthese.contre || 0} Contre</span>
                  <span style={{ color: 'var(--warning)', fontWeight: '800' }}>{s.synthese.abstentions || 0} Abst.</span>
                </div>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(s.synthese.pour/577)*100}%`, background: 'var(--success)' }}></div>
                <div style={{ height: '100%', width: `${(s.synthese.contre/577)*100}%`, background: 'var(--danger)' }}></div>
                <div style={{ height: '100%', width: `${(s.synthese.abstentions/577)*100}%`, background: 'var(--warning)' }}></div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '16px' }}>Position des Groupes</div>
            <div className="flex" style={{ gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(s.groupes).map(([gRef, dataValue]) => {
                const group = data.groups[gRef];
                if (!group) return null;
                
                const vote = dataValue.position;
                let borderColor = 'rgba(255,255,255,0.1)';
                let glowColor = 'transparent';
                if (vote === 'pour') { borderColor = 'var(--success)'; glowColor = 'rgba(16, 185, 129, 0.1)'; }
                if (vote === 'contre') { borderColor = 'var(--danger)'; glowColor = 'rgba(239, 68, 68, 0.1)'; }
                
                return (
                  <div key={gRef} style={{ 
                    padding: '12px', 
                    borderRadius: '14px', 
                    background: 'rgba(15, 23, 42, 0.4)', 
                    border: `1px solid ${borderColor}`,
                    boxShadow: `0 4px 12px ${glowColor}`,
                    minWidth: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div className="flex align-center justify-between">
                      <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>{group.abrege}</span>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: '900', 
                        padding: '2px 6px', 
                        borderRadius: '6px', 
                        background: vote === 'pour' ? 'var(--success)' : (vote === 'contre' ? 'var(--danger)' : 'var(--panel-border)'),
                        color: '#fff'
                      }}>{vote.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', gap: '4px' }}>
                      <span style={{ color: 'var(--success)' }}>{dataValue.pour}P</span> • 
                      <span style={{ color: 'var(--danger)' }}>{dataValue.contre}C</span> • 
                      <span>{dataValue.absents}A</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="glass-panel mt-12 flex align-center justify-between" style={{ padding: '20px 32px', borderRadius: '20px' }}>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
            Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
          </div>
          <div className="flex gap-4">
            <button 
              className="btn" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ opacity: currentPage === 1 ? 0.3 : 1, pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
            >
              Précédent
            </button>
            <button 
              className="btn btn-primary" 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ opacity: currentPage === totalPages ? 0.3 : 1, pointerEvents: currentPage === totalPages ? 'none' : 'auto' }}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
