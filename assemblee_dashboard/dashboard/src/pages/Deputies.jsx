import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DeputiesPage({ data }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('present'); // present, fidelite, nom
  const [sortAsc, setSortAsc] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const [selectedGroup, setSelectedGroup] = useState('all');

  const deputies = useMemo(() => {
    let result = [...data.deputies];

    if (selectedGroup !== 'all') {
      result = result.filter(d => d.groupe === selectedGroup);
    }
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => 
        d.nom.toLowerCase().includes(q) || 
        d.prenom.toLowerCase().includes(q)
      );
    }
    
    result.sort((a, b) => {
      let valA, valB;
      
      if (sortBy === 'nom') {
        valA = a.nom; valB = b.nom;
      } else if (sortBy === 'groupe') {
        valA = data.groups[a.groupe]?.abrege || '';
        valB = data.groups[b.groupe]?.abrege || '';
      } else if (sortBy === 'present') {
        valA = a.stats.total ? a.stats.present / a.stats.total : 0;
        valB = b.stats.total ? b.stats.present / b.stats.total : 0;
      } else if (sortBy === 'fidelite') {
        valA = a.stats.total ? 1 - (a.stats.contre_groupe / a.stats.total) : 0;
        valB = b.stats.total ? 1 - (b.stats.contre_groupe / b.stats.total) : 0;
      }
      
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [data, search, sortBy, sortAsc, selectedGroup]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex align-center justify-between mb-8">
        <div>
          <h1 style={{ marginBottom: '8px' }}>Députés</h1>
          <p style={{ margin: 0 }}>Analyse de l'activité et de la fidélité des membres de l'Assemblée.</p>
        </div>
      </div>
      
      <div className="glass-panel mb-8" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Filtrer par Groupe Politique
          </div>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button 
              className={`badge ${selectedGroup === 'all' ? 'badge-primary' : ''}`}
              style={{ 
                cursor: 'pointer', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '14px',
                fontSize: '0.85rem',
                fontWeight: '700',
                background: selectedGroup === 'all' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color: selectedGroup === 'all' ? '#fff' : 'var(--text-secondary)',
                transition: 'var(--transition-fast)'
              }}
              onClick={() => { setSelectedGroup('all'); setVisibleCount(100); }}
            >
              Tous les groupes
            </button>
            {Object.entries(data.groups).map(([id, g]) => (
              <button 
                key={id}
                style={{ 
                  cursor: 'pointer', 
                  border: `1px solid ${selectedGroup === id ? g.couleur : 'transparent'}`, 
                  background: selectedGroup === id ? `${g.couleur}33` : 'rgba(255,255,255,0.05)',
                  color: selectedGroup === id ? g.couleur : 'var(--text-secondary)',
                  padding: '10px 20px',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  transition: 'var(--transition-fast)'
                }}
                onClick={() => { setSelectedGroup(id); setVisibleCount(100); }}
              >
                {g.abrege}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '600px' }}>
          <Search size={22} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Rechercher par nom ou prénom..." 
            style={{ paddingLeft: '48px', fontSize: '1rem', height: '56px', background: 'rgba(15, 23, 42, 0.4)' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nom')} style={{ cursor: 'pointer' }}>
                  <div className="flex align-center gap-2">
                    DÉPUTÉ {sortBy === 'nom' && (sortAsc ? <span style={{ color: 'var(--accent)' }}>↑</span> : <span style={{ color: 'var(--accent)' }}>↓</span>)}
                  </div>
                </th>
                <th onClick={() => handleSort('groupe')} style={{ cursor: 'pointer' }}>
                  <div className="flex align-center gap-2">
                    GROUPE {sortBy === 'groupe' && (sortAsc ? <span style={{ color: 'var(--accent)' }}>↑</span> : <span style={{ color: 'var(--accent)' }}>↓</span>)}
                  </div>
                </th>
                <th onClick={() => handleSort('present')} style={{ cursor: 'pointer' }}>
                  <div className="flex align-center gap-2">
                    PRÉSENCE {sortBy === 'present' && (sortAsc ? <span style={{ color: 'var(--accent)' }}>↑</span> : <span style={{ color: 'var(--accent)' }}>↓</span>)}
                  </div>
                </th>
                <th onClick={() => handleSort('fidelite')} style={{ cursor: 'pointer' }}>
                  <div className="flex align-center gap-2">
                    FIDÉLITÉ {sortBy === 'fidelite' && (sortAsc ? <span style={{ color: 'var(--accent)' }}>↑</span> : <span style={{ color: 'var(--accent)' }}>↓</span>)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {deputies.slice(0, visibleCount).map(d => {
                const group = data.groups[d.groupe] || { abrege: 'NC', couleur: '#666' };
                const presence = d.stats.total ? (d.stats.present / d.stats.total * 100).toFixed(1) : 0;
                const loyaute = d.stats.total ? ((1 - (d.stats.contre_groupe / d.stats.total)) * 100).toFixed(1) : 100;
                
                return (
                  <tr key={d.uid}>
                    <td>
                      <Link to={`/deputies/${d.uid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="flex align-center gap-4">
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '12px', 
                            background: `linear-gradient(135deg, ${group.couleur}44 0%, ${group.couleur}22 100%)`, 
                            border: `1px solid ${group.couleur}44`,
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '0.9rem', 
                            fontWeight: '800',
                            color: group.couleur
                          }}>
                            {d.prenom[0]}{d.nom[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{d.prenom} {d.nom}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UID: {d.uid}</div>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <span className="badge" style={{ background: `${group.couleur}15`, color: group.couleur, border: `1px solid ${group.couleur}30` }}>
                        {group.abrege}
                      </span>
                    </td>
                    <td>
                      <div style={{ minWidth: '140px' }}>
                        <div className="flex align-center justify-between mb-2">
                          <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{presence}%</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{d.stats.present}/{d.stats.total}</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${presence}%`, 
                            background: `linear-gradient(to right, var(--accent), #818cf8)`,
                            boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
                            borderRadius: '3px'
                          }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ minWidth: '140px' }}>
                        <div className="flex align-center justify-between mb-2">
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: loyaute > 90 ? 'var(--success)' : 'var(--warning)' }}>{loyaute}%</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fidélité</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${loyaute}%`, 
                            background: loyaute > 90 ? 'var(--success)' : 'var(--warning)',
                            boxShadow: `0 0 10px ${loyaute > 90 ? 'var(--success)' : 'var(--warning)'}33`,
                            borderRadius: '3px'
                          }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: visibleCount < deputies.length ? '16px' : '0' }}>
              Affichage de <strong>{Math.min(visibleCount, deputies.length)}</strong> députés sur <strong>{deputies.length}</strong>.
            </div>
            {visibleCount < deputies.length && (
              <button 
                className="btn btn-primary" 
                onClick={() => setVisibleCount(prev => prev + 100)}
                style={{ padding: '10px 32px', borderRadius: '12px', fontSize: '0.9rem' }}
              >
                Voir plus (+100)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
