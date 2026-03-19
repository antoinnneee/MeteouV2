import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

export default function ScrutinDetailPage({ data }) {
  const { id } = useParams();
  
  const scrutin = data.scrutins.find(s => s.uid === id);
  if (!scrutin) return <div className="glass-panel">Scrutin introuvable</div>;
  
  const synth = scrutin.synthese || {};

  return (
    <div className="animate-fade-in">
      <Link to="/scrutins" className="btn mb-4" style={{ display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Retour à la liste
      </Link>
      
      <div className="glass-panel mb-8">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Scrutin n°{scrutin.numero} • {scrutin.date}</span>
        <h1 style={{ fontSize: '1.5rem', marginTop: '8px' }}>{scrutin.titre}</h1>
        <div className="mt-4 flex gap-4">
          <span className={`badge ${scrutin.sort === 'adopté' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
            {scrutin.sort.toUpperCase()}
          </span>
        </div>
        
        <div className="grid-3 mt-8">
          <div className="glass-panel flex align-center justify-between" style={{ background: 'rgba(35, 134, 54, 0.1)', borderColor: 'rgba(35, 134, 54, 0.3)' }}>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>POUR</p>
              <h2 style={{ margin: 0, color: '#3fb950', fontSize: '2.5rem' }}>{synth.pour || 0}</h2>
            </div>
            <CheckCircle size={40} color="#3fb950" opacity={0.5} />
          </div>
          
          <div className="glass-panel flex align-center justify-between" style={{ background: 'rgba(248, 81, 73, 0.1)', borderColor: 'rgba(248, 81, 73, 0.3)' }}>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>CONTRE</p>
              <h2 style={{ margin: 0, color: '#ff7b72', fontSize: '2.5rem' }}>{synth.contre || 0}</h2>
            </div>
            <XCircle size={40} color="#ff7b72" opacity={0.5} />
          </div>
          
          <div className="glass-panel flex align-center justify-between" style={{ background: 'rgba(210, 153, 34, 0.1)', borderColor: 'rgba(210, 153, 34, 0.3)' }}>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>ABSTENTION / ABSENTS</p>
              <h2 style={{ margin: 0, color: '#e3b341', fontSize: '2.5rem' }}>{synth.abstentions || 0} <span style={{fontSize: '1rem'}}>/ {577 - (Number(synth.pour||0) + Number(synth.contre||0) + Number(synth.abstentions||0))}</span></h2>
            </div>
            <MinusCircle size={40} color="#e3b341" opacity={0.5} />
          </div>
        </div>
      </div>
      
      <h2>Détail des votes par groupe</h2>
      <div className="grid-2 mt-4">
        {Object.entries(scrutin.groupes).map(([gRef, dataValue]) => {
          const group = data.groups[gRef];
          if (!group) return null;
          
          const vote = dataValue.position;
          let color = 'var(--text-secondary)';
          if (vote === 'pour') color = 'var(--success)';
          if (vote === 'contre') color = 'var(--danger)';
          if (vote === 'abstention') color = 'var(--warning)';
          
          return (
            <div key={gRef} className="glass-panel flex align-center justify-between" style={{ padding: '16px' }}>
              <div>
                <div className="flex align-center gap-4 mb-2">
                   <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: group.couleur }}></div>
                   <strong>{group.libelle}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {dataValue.pour} Pour • {dataValue.contre} Contre • {dataValue.abstention} Abstentions • {dataValue.absents} Absents
                </div>
              </div>
              <span style={{ fontWeight: 'bold', color, textTransform: 'uppercase' }}>{vote}</span>
            </div>
          );
        })}
      </div>
      
      <h2 className="mt-8">Analyse nominative</h2>
      <p>Retrouvez la position individuelle des députés ayant participé au vote dans l'onglet Députés.</p>
    </div>
  );
}
