import React, { useState, useMemo } from 'react';
import { Users, FileText, Activity, CheckCircle, RefreshCw } from 'lucide-react';

function groupMatrixTooltip(gr) {
  const full = gr.libelle || gr.abrege || '';
  const line =
    gr.libelle && gr.abrege && gr.libelle !== gr.abrege
      ? `${gr.libelle} (${gr.abrege})`
      : full;
  return `${line} — Cliquez pour surligner ce groupe`;
}

export default function DashboardPage({ data }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const resp = await fetch('/api/update', { method: 'POST' });
      const result = await resp.json();
      if (result.success) {
        window.location.reload();
      } else {
        alert("Erreur lors de la mise à jour : " + result.error);
      }
    } catch (e) {
      alert("Impossible de contacter le serveur local.");
    }
    setIsRefreshing(false);
  };
  
  const stats = useMemo(() => {
    if (!data) return null;
    
    // Calculate global attendance
    let totalPresent = 0;
    let totalVotes = 0;
    data.deputies.forEach(d => {
      totalPresent += d.stats.present;
      totalVotes += d.stats.total;
    });
    
    const attendanceRate = totalVotes > 0 ? (totalPresent / totalVotes * 100).toFixed(1) : 0;
    
    return {
      totalDeputies: data.deputies.length,
      totalScrutins: data.scrutins.length,
      attendanceRate,
    };
  }, [data]);

  if (!stats) return <div className="glass-panel">Initialisation...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex align-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 style={{ marginBottom: '8px' }}>Vue d'ensemble</h1>
          <p style={{ margin: 0 }}>Analyse en temps réel de la 17ème législature de l'Assemblée nationale.</p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="btn btn-primary animate-fade-in" 
          style={{ padding: '14px 28px', borderRadius: '14px' }}
        >
          <RefreshCw size={20} className={isRefreshing ? 'spin' : ''} />
          <span style={{ fontWeight: '700' }}>{isRefreshing ? 'Mise à jour...' : 'Actualiser les données'}</span>
        </button>
      </div>
      
      <div className="grid-3 mb-8 animate-fade-in">
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: 'var(--accent)', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)' }}></div>
          <div className="flex align-center gap-4 mb-4">
            <div className="flex align-center justify-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)' }}>
              <Users size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Députés Actifs</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '700' }}>+2 cette semaine</div>
            </div>
          </div>
          <div className="flex align-end gap-2">
            <h1 style={{ fontSize: '3.5rem', margin: 0, background: 'linear-gradient(135deg, #fff 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.totalDeputies}</h1>
            <span style={{ marginBottom: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Membres</span>
          </div>
        </div>
        
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: 'var(--success)', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)' }}></div>
          <div className="flex align-center gap-4 mb-4">
            <div className="flex align-center justify-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <Activity size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Taux de Présence</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '700' }}>STABLE</div>
            </div>
          </div>
          <div className="flex align-end gap-2">
            <h1 style={{ fontSize: '3.5rem', margin: 0, background: 'linear-gradient(135deg, #fff 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.attendanceRate}%</h1>
            <span style={{ marginBottom: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Participation</span>
          </div>
        </div>
        
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: 'var(--warning)', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)' }}></div>
          <div className="flex align-center gap-4 mb-4">
            <div className="flex align-center justify-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Scrutins Analysés</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>TOTAL PÉRIODE</div>
            </div>
          </div>
          <div className="flex align-end gap-2">
            <h1 style={{ fontSize: '3.5rem', margin: 0, background: 'linear-gradient(135deg, #fff 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.totalScrutins}</h1>
            <span style={{ marginBottom: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Votes publics</span>
          </div>
        </div>
      </div>
      
      <div className="grid-2 animate-fade-in">
        <div className="glass-panel">
          <div className="flex align-center justify-between mb-6">
            <div>
              <h2 style={{ margin: 0 }}>Victoires par groupe</h2>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Scrutins conformes à la position du groupe</p>
            </div>
            <div className="glass-panel" style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', fontWeight: '700' }}>
              CLASSEMENT
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.values(data.groups)
              .filter(g => g.totalVotes > 0)
              .sort((a,b) => b.victoires - a.victoires)
              .map((g, index) => (
              <div key={g.uid} className="flex align-center justify-between" style={{ 
                padding: '12px 16px', 
                background: 'rgba(15, 23, 42, 0.4)', 
                borderRadius: '14px',
                border: '1px solid var(--panel-border)',
                transition: 'var(--transition-fast)'
              }}>
                <div className="flex align-center gap-4">
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: g.couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.7rem', boxShadow: `0 0 10px ${g.couleur}44` }}>
                    {index + 1}
                  </div>
                  <span style={{ fontWeight: '600' }}>{g.abrege}</span>
                </div>
                <div className="flex align-center gap-3">
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{g.victoires}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>sur {g.totalVotes}</div>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `3px solid ${g.couleur}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800' }}>{Math.round((g.victoires / g.totalVotes) * 100)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <div className="flex align-center justify-between mb-6">
            <div>
              <h2 style={{ margin: 0 }}>Matrice d'alignement</h2>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Alignement des votes entre groupes</p>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent)', marginRight: '4px' }}></span>
              Alignement (%)
            </div>
          </div>

          {(() => {
            const activeGroups = Object.values(data.groups).sort((a,b)=>b.totalVotes - a.totalVotes).filter(g => g.totalVotes > 0);
            return (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `minmax(60px, auto) repeat(${activeGroups.length}, 1fr)`, 
                gap: '6px',
                background: 'rgba(0,0,0,0.2)',
                padding: '12px',
                borderRadius: '16px'
              }}>
                 <div style={{ padding: '8px', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Groupes</div>
                 {activeGroups.map(g => {
                   const partyColor = g.couleur || '#64748b';
                   return (
                   <div
                     key={`head-${g.uid}`}
                     onClick={() => setSelectedGroup(selectedGroup === g.uid ? null : g.uid)}
                     style={{
                       display: 'flex',
                       flexDirection: 'column',
                       borderRadius: '8px',
                       overflow: 'hidden',
                       cursor: 'pointer',
                       backgroundColor: selectedGroup === g.uid ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                       transition: 'var(--transition-fast)',
                       border: selectedGroup === g.uid ? '1px solid var(--accent)' : '1px solid transparent',
                     }}
                     title={groupMatrixTooltip(g)}
                   >
                     <div style={{ height: '3px', width: '100%', background: partyColor, flexShrink: 0 }} />
                     <div style={{
                       padding: '10px 4px',
                       textAlign: 'center',
                       fontWeight: '800',
                       fontSize: '0.75rem',
                       color: selectedGroup === g.uid ? 'var(--accent)' : 'inherit',
                     }}>
                       {g.abrege}
                     </div>
                   </div>
                 );
                 })}
                 
                 {activeGroups.map(gRow => (
                   <React.Fragment key={`row-${gRow.uid}`}>
                     <div
                       onClick={() => setSelectedGroup(selectedGroup === gRow.uid ? null : gRow.uid)}
                       style={{
                         display: 'flex',
                         alignItems: 'stretch',
                         borderRadius: '8px',
                         overflow: 'hidden',
                         cursor: 'pointer',
                         backgroundColor: selectedGroup === gRow.uid ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                         transition: 'var(--transition-fast)',
                         border: selectedGroup === gRow.uid ? '1px solid var(--accent)' : '1px solid transparent',
                       }}
                       title={groupMatrixTooltip(gRow)}
                     >
                       <div style={{ width: '3px', flexShrink: 0, background: gRow.couleur || '#64748b', borderRadius: '2px 0 0 2px' }} />
                       <div style={{
                         padding: '10px 8px',
                         fontWeight: '800',
                         fontSize: '0.75rem',
                         display: 'flex',
                         alignItems: 'center',
                         flex: 1,
                         color: selectedGroup === gRow.uid ? 'var(--accent)' : 'inherit',
                       }}>
                         {gRow.abrege}
                       </div>
                     </div>
                     {activeGroups.map(gCol => {
                       const val = data.alignment_matrix[gRow.uid]?.[gCol.uid] || 0;
                       const isSelected = selectedGroup && (selectedGroup === gRow.uid || selectedGroup === gCol.uid);
                       const isDimmed = selectedGroup && !isSelected;
                       
                       // Heatmap color calculation
                       const intensity = val / 100;
                       const bgColor = val === 100 ? 'rgba(59, 130, 246, 0.15)' : `rgba(59, 130, 246, ${intensity * 0.7})`;
                       
                       return (
                         <div key={`cell-${gRow.uid}-${gCol.uid}`} style={{ 
                           padding: '10px 4px', 
                           textAlign: 'center', 
                           backgroundColor: bgColor,
                           borderRadius: '8px',
                           fontSize: '0.8rem',
                           fontWeight: '700',
                           opacity: isDimmed ? 0.2 : 1,
                           transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                           border: isSelected ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                           boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                           transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                           zIndex: isSelected ? 10 : 0,
                           color: val > 70 ? '#fff' : 'var(--text-secondary)'
                         }}>
                           {val}%
                         </div>
                       );
                     })}
                   </React.Fragment>
                 ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
