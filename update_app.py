import os
import json

base_dir = "/home/aliozmen/Desktop/My Projects/HTML/26.0/frontend/images"
categories = ["Movies", "Series", "Books", "Games"]

content_db = {}
id_counter = 1

for category in categories:
    cat_dir = os.path.join(base_dir, category)
    if os.path.exists(cat_dir):
        for file in os.listdir(cat_dir):
            if file.endswith(('.jpg', '.jpeg', '.png')):
                title = os.path.splitext(file)[0]
                tag = category[:-1] if category != "Series" else "Series"
                if category == "Movies":
                    tag = "Movie"
                    
                item_id = f"item_{id_counter}"
                id_counter += 1
                
                content_db[item_id] = {
                    "title": title,
                    "img": f"../images/{category}/{file}",
                    "tags": [tag, "Popular"],
                    "year": "2024",
                    "length": "N/A",
                    "creator": "Cultify",
                    "age": "+13",
                    "desc": f"Explore the details of {title}."
                }

js_content = "const contentDB = " + json.dumps(content_db, indent=4, ensure_ascii=False) + ";"

# Read app.js
with open("/home/aliozmen/Desktop/My Projects/HTML/26.0/frontend/js/app.js", "r") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if line.startswith("const contentDB = {"):
        start_idx = i
    if start_idx != -1 and line.startswith("};"):
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + [js_content + "\n"] + lines[end_idx+1:]
    with open("/home/aliozmen/Desktop/My Projects/HTML/26.0/frontend/js/app.js", "w") as f:
        f.writelines(new_lines)
    print("app.js updated successfully with new image names.")
else:
    print("Could not find contentDB in app.js")

