import re
import os
import json

# Regex to find t('key') or t("key")
t_pattern = re.compile(r"t\(['\"]([a-zA-Z0-9_\.]+)['\"]\)")

keys = set()
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.astro') or file.endswith('.ts') or file.endswith('.tsx'):
            with open(os.path.join(root, file), 'r') as f:
                content = f.read()
                matches = t_pattern.findall(content)
                keys.update(matches)

# Extract keys from ui.ts (naively for pt/defaultLang)
ui_content = ""
with open('src/i18n/ui.ts', 'r') as f:
    ui_content = f.read()

# simple regex for 'key': 'value' in ui.ts
ui_keys = set(re.findall(r"['\"]([a-zA-Z0-9_\.]+)['\"]\s*:\s*['\"]", ui_content))

# Also read all pt.json files
page_keys = set()
for root, dirs, files in os.walk('src/i18n/pages'):
    for file in files:
        if file == 'pt.json':
            with open(os.path.join(root, file), 'r') as f:
                try:
                    data = json.load(f)
                    page_keys.update(data.keys())
                except:
                    pass

all_existing_keys = ui_keys.union(page_keys)

missing_keys = keys - all_existing_keys
print("Missing Keys:")
for key in sorted(missing_keys):
    print(key)

# Add missing keys to ui.ts dynamically under pt
if missing_keys:
    print("Found missing keys. Adding them to ui.ts (default pt).")

    # We will generate a string of these keys to inject into the pt dictionary of ui.ts
    inject_str = ""
    for key in sorted(missing_keys):
        # generate a somewhat readable value from key
        value = key.split('.')[-1].replace('_', ' ').title()
        inject_str += f"    '{key}': '{value}',\n"

    with open('src/i18n/ui.ts', 'r') as f:
        content = f.read()

    # find the start of 'pt': {
    pt_start = content.find("'pt': {")
    if pt_start == -1:
        pt_start = content.find("pt: {")

    if pt_start != -1:
        brace_pos = content.find("{", pt_start)
        new_content = content[:brace_pos+1] + "\n" + inject_str + content[brace_pos+1:]
        with open('src/i18n/ui.ts', 'w') as f:
            f.write(new_content)
        print("Successfully injected missing keys into ui.ts")
    else:
        print("Could not find pt object in ui.ts")
else:
    print("No missing keys found!")
