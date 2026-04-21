import os
import re

base_dirs = [
    r"e:\Proyectos\Feedback System\Students",
    r"e:\Proyectos\Feedback System\Students\Nivel 7"
]

def extract_from_htm(file_path):
    if not os.path.exists(file_path):
        return []
    with open(file_path, "r", encoding="windows-1252") as f:
        content = f.read()
    rows = re.findall(r'<tr.*?>.*?</tr>', content, re.DOTALL)
    students = []
    for row in rows[1:]:
        cells = re.findall(r'<td.*?>\s*(.*?)\s*</td>', row, re.DOTALL)
        if len(cells) >= 7:
            ln = re.sub(r'<.*?>', '', cells[2]).strip().replace('\n', ' ')
            fn = re.sub(r'<.*?>', '', cells[3]).strip().replace('\n', ' ')
            email = re.sub(r'<.*?>', '', cells[6]).strip().replace('\n', ' ')
            if "@" in email:
                students.append(f"{fn} {ln} ({email})")
    return students

print("--- SCANNING LEVEL 7 DIRECTORY ---")
n7_base = r"e:\Proyectos\Feedback System\Students\Nivel 7"
for sec in ["1", "2", "3", "4"]:
    path = os.path.join(n7_base, f"Nivel_7_Seccion_{sec}_files", "sheet001.htm")
    names = extract_from_htm(path)
    print(f"Level 7 Section {sec}: {len(names)} students found.")

print("\n--- SCANNING ROOT STUDENTS DIRECTORY (Potential Mismatches) ---")
root_base = r"e:\Proyectos\Feedback System\Students"
for item in os.listdir(root_base):
    if item.endswith("_files"):
        path = os.path.join(root_base, item, "sheet001.htm")
        names = extract_from_htm(path)
        print(f"File {item}: {len(names)} students found.")
