import React, { useState, useMemo } from 'react';
import { Users, FileText, Activity, CheckCircle, RefreshCw } from 'lucide-react';

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
      <div className="flex align-center justify-between mb-4">
        <div>
          <h1>Vue d'ensemble</h1>
          <p>Analyse en temps réel de la 17ème législature de l'Assemblée nationale.</p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="btn flex align-center gap-2" 
          style={{ background: 'var(--accent)', color: 'white', padding: '12px 24px' }}
        >
          <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} />
          {isRefreshing ? 'Actualisation...' : 'Actualiser les données'}
        </button>
      </div>
      
      <div className="grid-3 mb-8 mt-4">
        <div className="glass-panel">
          <div className="flex align-center gap-4 mb-4">
            <Users size={24} color="var(--accent)" />
            <h3>Députés Actifs</h3>
          </div>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>{stats.totalDeputies}</h1>
          <p style={{ margin: 0 }}>Membres recensés</p>
        </div>
        
        <div className="glass-panel">
          <div className="flex align-center gap-4 mb-4">
            <Activity size={24} color="var(--success)" />
            <h3>Taux de Présence</h3>
          </div>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>{stats.attendanceRate}%</h1>
          <p style={{ margin: 0 }}>Moyenne globale des votes publics</p>
        </div>
        
        <div className="glass-panel">
          <div className="flex align-center gap-4 mb-4">
            <FileText size={24} color="var(--warning)" />
            <h3>Scrutins Analysés</h3>
          </div>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>{stats.totalScrutins}</h1>
          <p style={{ margin: 0 }}>Votes publics récents</p>
        </div>
      </div>
      
      <div className="grid-2">
        <div className="glass-panel">
          <h2>Victoires par groupe politique</h2>
          <p>Scrutins remportés (le groupe a voté dans le sens de l'issue finale)</p>
          <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.values(data.groups)
              .filter(g => g.totalVotes > 0)
              .sort((a,b) => b.victoires - a.victoires)
              .map(g => (
              <div key={g.uid} className="flex align-center justify-between" style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <div className="flex align-center gap-4">
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: g.couleur }}></div>
                  <span>{g.abrege}</span>
                </div>
                <strong>{g.victoires} <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ {g.totalVotes}</span></strong>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <h2>Matrice d'alignement</h2>
          <p>Pourcentage de votes identiques entre les groupes majeurs</p>
          {(() => {
            const activeGroups = Object.values(data.groups).sort((a,b)=>b.totalVotes - a.totalVotes).filter(g => g.totalVotes > 0);
            return (
              <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: `minmax(50px, auto) repeat(${activeGroups.length}, 1fr)`, gap: '4px' }}>
                 {/* Simple heatmap UI */}
                 <div style={{ padding: '8px', fontWeight: 'bold' }}>Groupes</div>
                 {activeGroups.map(g => (
                   <div 
                     key={`head-${g.uid}`} 
                     onClick={() => setSelectedGroup(selectedGroup === g.uid ? null : g.uid)}
                     style={{ 
                       padding: '8px 4px', 
                       textAlign: 'center', 
                       fontWeight: 'bold', 
                       fontSize: '0.8rem',
                       cursor: 'pointer',
                       backgroundColor: selectedGroup === g.uid ? 'rgba(255,255,255,0.1)' : 'transparent',
                       borderRadius: '4px',
                       transition: 'background 0.2s',
                       borderBottom: `2px solid ${g.couleur}`
                     }}
                     title={`Cliquez pour surligner le groupe ${g.abrege}`}
                   >
                     {g.abrege}
                   </div>
                 ))}
                 
                 {activeGroups.map(gRow => (
                   <React.Fragment key={`row-${gRow.uid}`}>
                     <div 
                       onClick={() => setSelectedGroup(selectedGroup === gRow.uid ? null : gRow.uid)}
                       style={{ 
                         padding: '8px', 
                         fontWeight: 'bold', 
                         fontSize: '0.8rem', 
                         display: 'flex', 
                         alignItems: 'center',
                         cursor: 'pointer',
                         backgroundColor: selectedGroup === gRow.uid ? 'rgba(255,255,255,0.1)' : 'transparent',
                         borderRadius: '4px',
                         transition: 'background 0.2s',
                         borderLeft: `2px solid ${gRow.couleur}`
                       }}
                       title={`Cliquez pour surligner le groupe ${gRow.abrege}`}
                     >
                       {gRow.abrege}
                     </div>
                     {activeGroups.map(gCol => {
                       const val = data.alignment_matrix[gRow.uid]?.[gCol.uid] || 0;
                       const isSelected = selectedGroup && (selectedGroup === gRow.uid || selectedGroup === gCol.uid);
                       const isDimmed = selectedGroup && !isSelected;
                       
                       return (
                         <div key={`cell-${gRow.uid}-${gCol.uid}`} style={{ 
                           padding: '8px 4px', 
                           textAlign: 'center', 
                           backgroundColor: `rgba(88, 166, 255, ${val/100 * 0.6})`,
                           borderRadius: '4px',
                           fontSize: '0.8rem',
                           opacity: isDimmed ? 0.15 : 1,
                           transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                           border: isSelected ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                           transition: 'all 0.2s ease',
                           zIndex: isSelected ? 1 : 0
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
