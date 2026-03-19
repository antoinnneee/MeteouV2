import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, MinusCircle, Calendar } from 'lucide-react';

export default function ScrutinDetailPage({ data }) {
  const { id } = useParams();
  
  const scrutin = data.scrutins.find(s => s.uid === id);
  if (!scrutin) return <div className="glass-panel">Scrutin introuvable</div>;
  
  const synth = scrutin.synthese || {};

  return (
    <div className="animate-fade-in">
      <Link to="/scrutins" className="btn mb-8" style={{ display: 'inline-flex', gap: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '12px 20px' }}>
        <ArrowLeft size={18} /> 
        <span style={{ fontWeight: '700' }}>Retour à la liste</span>
      </Link>
      
      <div className="glass-panel mb-8 animate-fade-in" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: scrutin.sort === 'adopté' ? 'var(--success)' : 'var(--danger)' }}></div>
        
        <div className="flex align-center justify-between mb-6">
          <div className="flex align-center gap-3">
            <span className={`badge ${scrutin.sort === 'adopté' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '12px' }}>
              {scrutin.sort.toUpperCase()}
            </span>
            <span style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
              SCRUTIN N°{scrutin.numero}
            </span>
          </div>
          <div className="flex align-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>
            <Calendar size={18} />
            {scrutin.date || 'Date inconnue'}
          </div>
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '32px', lineHeight: '1.2' }}>{scrutin.titre}</h1>
        
        <div className="grid-3 mt-8">
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '20px' }}>
            <div className="flex align-center justify-between mb-3">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Pour</span>
              <CheckCircle size={20} color="var(--success)" />
            </div>
            <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--success)', fontWeight: '900' }}>{synth.pour || 0}</h2>
          </div>
          
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '20px' }}>
            <div className="flex align-center justify-between mb-3">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Contre</span>
              <XCircle size={20} color="var(--danger)" />
            </div>
            <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--danger)', fontWeight: '900' }}>{synth.contre || 0}</h2>
          </div>
          
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)', borderRadius: '20px' }}>
            <div className="flex align-center justify-between mb-3">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Abstention</span>
              <MinusCircle size={20} color="var(--warning)" />
            </div>
            <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--warning)', fontWeight: '900' }}>{synth.abstentions || 0}</h2>
          </div>
        </div>
      </div>
      
      <div className="flex align-center justify-between mb-6">
        <h2 style={{ margin: 0 }}>Détail des votes par groupe</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>577 membres théoriques</div>
      </div>

      <div className="grid-2 mt-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
        {Object.entries(scrutin.groupes).map(([gRef, dataValue]) => {
          const group = data.groups[gRef];
          if (!group) return null;
          
          const vote = dataValue.position;
          let color = 'var(--text-secondary)';
          let borderColor = 'rgba(255,255,255,0.1)';
          if (vote === 'pour') { color = 'var(--success)'; borderColor = 'rgba(16, 185, 129, 0.3)'; }
          if (vote === 'contre') { color = 'var(--danger)'; borderColor = 'rgba(239, 68, 68, 0.3)'; }
          if (vote === 'abstention') { color = 'var(--warning)'; borderColor = 'rgba(245, 158, 11, 0.3)'; }
          
          return (
            <div key={gRef} className="glass-panel animate-fade-in" style={{ padding: '24px', border: `1px solid ${borderColor}`, borderRadius: '20px', background: 'rgba(15, 23, 42, 0.4)' }}>
              <div className="flex align-center justify-between mb-6">
                <div className="flex align-center gap-4">
                  <div style={{ width: '12px', height: '32px', borderRadius: '6px', background: group.couleur }}></div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{group.libelle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>{group.abrege}</div>
                  </div>
                </div>
                <div className="badge" style={{ 
                  background: vote === 'pour' ? 'rgba(16, 185, 129, 0.1)' : (vote === 'contre' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)'),
                  color: color,
                  fontWeight: '900',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  border: `1px solid ${color}44`
                }}>
                  {vote.toUpperCase()}
                </div>
              </div>
              
              <div className="grid-4 bg-darker" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Pour</div>
                  <div style={{ fontWeight: '800', color: 'var(--success)' }}>{dataValue.pour}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Contre</div>
                  <div style={{ fontWeight: '800', color: 'var(--danger)' }}>{dataValue.contre}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Abst.</div>
                  <div style={{ fontWeight: '800', color: 'var(--warning)' }}>{dataValue.abstention}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Abs.</div>
                  <div style={{ fontWeight: '800', opacity: 0.5 }}>{dataValue.absents}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="glass-panel" style={{ marginTop: '40px', padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--panel-border)' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Analyse nominative</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Retrouvez la position individuelle des députés ayant participé au vote dans l'onglet <Link to="/deputies" style={{ color: 'var(--accent)', fontWeight: '700' }}>Députés</Link>.</p>
      </div>
    </div>
  );
}
