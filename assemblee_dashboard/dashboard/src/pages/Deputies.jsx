import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DeputiesPage({ data }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('present'); // present, fidelite, nom
  const [sortAsc, setSortAsc] = useState(false);

  const deputies = useMemo(() => {
    let result = [...data.deputies];
    
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
  }, [data, search, sortBy, sortAsc]);

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
      <h1>Députés</h1>
      <p>Taux de présence et fidélité au sein de leur groupe politique.</p>
      
      <div className="glass-panel mb-8 mt-4">
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="input-control" 
            placeholder="Rechercher un député par nom..." 
            style={{ paddingLeft: '40px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nom')}>Député {sortBy === 'nom' ? (sortAsc ? '↑' : '↓') : ''}</th>
                <th>Groupe</th>
                <th onClick={() => handleSort('present')}>Présence {sortBy === 'present' ? (sortAsc ? '↑' : '↓') : ''}</th>
                <th onClick={() => handleSort('fidelite')}>Fidélité au Groupe {sortBy === 'fidelite' ? (sortAsc ? '↑' : '↓') : ''}</th>
              </tr>
            </thead>
            <tbody>
              {deputies.slice(0, 50).map(d => {
                const group = data.groups[d.groupe] || { abrege: 'NC', couleur: '#666' };
                const presence = d.stats.total ? (d.stats.present / d.stats.total * 100).toFixed(1) : 0;
                const loyaute = d.stats.total ? ((1 - (d.stats.contre_groupe / d.stats.total)) * 100).toFixed(1) : 100;
                
                return (
                  <tr key={d.uid}>
                    <td>
                      <div className="flex align-center gap-4">
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {d.prenom[0]}{d.nom[0]}
                        </div>
                        <div>
                          <strong><Link to={`/deputies/${d.uid}`} style={{ color: 'var(--text-primary)', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>{d.prenom} {d.nom}</Link></strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: `${group.couleur}40`, color: group.couleur, border: `1px solid ${group.couleur}` }}>
                        {group.abrege}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{presence}%</span>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', width: '80px' }}>
                          <div style={{ height: '100%', width: `${presence}%`, background: 'var(--accent)', borderRadius: '3px' }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{loyaute}%</span>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', width: '80px' }}>
                          <div style={{ height: '100%', width: `${loyaute}%`, background: loyaute > 90 ? 'var(--success)' : 'var(--warning)', borderRadius: '3px' }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {deputies.length > 50 && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Affichage des 50 premiers résultats sur {deputies.length}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
