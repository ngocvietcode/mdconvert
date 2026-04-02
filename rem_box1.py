import re

with open('app/profiles/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Box 1 to DropDown
pattern1 = r'<div className="space-y-2 mb-3">.*?{/\* Add connector dropdown \*/}.*?</div>\s*</div>'
text = re.sub(pattern1, '', text, flags=re.DOTALL)

with open('app/profiles/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Removed Box 1 completely.")
