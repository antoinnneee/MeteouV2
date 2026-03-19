import urllib.request
import zipfile
import json
import io

URL_SCRUTINS = "https://data.assemblee-nationale.fr/static/openData/repository/17/loi/scrutins/Scrutins.json.zip"
URL_ACTEURS = "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip"

out = {}

req = urllib.request.Request(URL_ACTEURS, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    with zipfile.ZipFile(io.BytesIO(response.read())) as z:
        for f in z.namelist():
            if f.endswith('.json'):
                data = json.loads(z.read(f).decode('utf-8'))
                if 'acteur' in data and 'acteur' not in out:
                    out['acteur'] = data['acteur']
                if 'organe' in data and data['organe'].get('codeType') == 'GP' and 'organe_gp' not in out:
                    out['organe_gp'] = data['organe']
                if 'acteur' in out and 'organe_gp' in out:
                    break

req = urllib.request.Request(URL_SCRUTINS, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    with zipfile.ZipFile(io.BytesIO(response.read())) as z:
        for f in z.namelist():
            if f.endswith('.json'):
                data = json.loads(z.read(f).decode('utf-8'))
                if 'scrutin' in data:
                    out['scrutin'] = data['scrutin']
                    break

with open("schema.json", "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2, ensure_ascii=False)
    
print("Schema generated.")
