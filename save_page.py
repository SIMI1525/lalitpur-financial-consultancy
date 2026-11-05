import json, os, sys

def save_page(filename, data):
    target = os.path.join("lalitpur-financial-consultancy/data/pages", filename)
    with open(target, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved: {filename}")

if __name__ == "__main__":
    print("save_page utility loaded.")
