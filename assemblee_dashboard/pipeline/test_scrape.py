import urllib.request
from bs4 import BeautifulSoup

url = "https://www.assemblee-nationale.fr/dyn/17/scrutins/5828"
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
html = urllib.request.urlopen(req).read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')

# Find the general result
sort = soup.select_one('.sort-scrutin')
print("Sort:", sort.text.strip() if sort else "Unknown")

# Find the votes per group
# Usually it's in a structure like: 
# <div class="groupe"> 
#   <h3>Groupe RN</h3>
#   <div class="pour"><h4>Pour</h4><ul><li>M. X</li>...</ul></div>
# </div>
# Let's see what classes are used
blocks = soup.select('div')
for b in blocks:
    if "Pour" in b.text and "M." in b.text and len(b.text) < 1000:
        print("Possible vote block class:", b.get('class'))
        print(b.text[:100])
        break

# Let's just find all the <li> and see their parents
lis = soup.select('ul, li')
for li in lis:
    text = li.text.strip()
    if text.startswith('M.') or text.startswith('Mme'):
        print("Found deputy:", text)
        print("Parent structure:")
        parent = li.parent
        while parent and parent.name != 'body':
            print("  ", parent.name, parent.get('class'))
            parent = parent.parent
        break
