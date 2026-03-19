import urllib.request
from bs4 import BeautifulSoup
import json

url = "https://www.assemblee-nationale.fr/dyn/17/scrutins?limit=10"
headers = {'User-Agent': 'Mozilla/5.0'}
try:
    req = urllib.request.Request(url, headers=headers)
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    
    # Try to find scrutin containers
    items = soup.select('.scrutin, article, .item, .resultat-item, tr')
    print(f"Found {len(items)} possible items.")
    for i in range(min(3, len(items))):
        print(f"--- Item {i} ---")
        print(items[i].text.strip()[:200])
        links = items[i].select('a')
        for a in links:
            print("Link:", a.get('href'))
except Exception as e:
    print(f"Error: {e}")
