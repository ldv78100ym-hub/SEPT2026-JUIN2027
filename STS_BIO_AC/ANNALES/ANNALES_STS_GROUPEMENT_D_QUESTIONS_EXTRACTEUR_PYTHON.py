import json
import os
import re
from collections import defaultdict

# ============================================================
# Configuration
# ============================================================
INPUT_FILE = "ANNALES_STS_GROUPEMENT_D_QUESTIONS_EXTRAITES2.json"  # à adapter
OUTPUT_DIR = "JSON"  # dossier de sortie

# ============================================================
# Fonctions utilitaires
# ============================================================
def sanitize_filename(name):
    """Nettoie le nom de la source pour en faire un nom de fichier valide."""
    # On conserve lettres, chiffres, underscores et tirets
    return re.sub(r'[^a-zA-Z0-9_\-]', '_', name)

def build_context_for_exercise(questions):
    """
    Reçoit une liste de questions d'un même exercice (même source).
    Retourne une chaîne de caractères contenant tous les contextes distincts,
    séparés par un saut de ligne.
    """
    distinct_contexts = []
    seen = set()
    for q in questions:
        ctx = q.get('context', '')
        if ctx and ctx not in seen:
            seen.add(ctx)
            distinct_contexts.append(ctx)
    # On joint avec un saut de ligne (ou deux pour plus de lisibilité)
    return "\n".join(distinct_contexts)

# ============================================================
# Lecture du fichier JSON
# ============================================================
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    all_questions = json.load(f)

# ============================================================
# Groupement par source, puis par exercice
# ============================================================
# Structure : sources[source][exercise] = liste de questions
sources = defaultdict(lambda: defaultdict(list))
for q in all_questions:
    src = q.get('source', '')
    ex = q.get('exercise', '')
    sources[src][ex].append(q)

# ============================================================
# Création du dossier de sortie
# ============================================================
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# Pour chaque source, on construit un nouveau tableau de questions
# avec les contextes unifiés par exercice
# ============================================================
for src, exercises in sources.items():
    updated_questions = []  # toutes les questions de cette source avec leur nouveau contexte
    
    # Pour chaque exercice de cette source
    for ex, q_list in exercises.items():
        # 1. Construire le contexte unifié pour cet exercice
        unified_context = build_context_for_exercise(q_list)
        
        # 2. Appliquer ce contexte à chaque question de l'exercice
        for q in q_list:
            q['context'] = unified_context
            updated_questions.append(q)
    
    # On écrit le fichier JSON pour cette source
    safe_name = sanitize_filename(src)
    # Si le nom est vide, on met "unknown"
    if not safe_name:
        safe_name = "unknown"
    output_path = os.path.join(OUTPUT_DIR, f"{safe_name}.json")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(updated_questions, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Fichier généré : {output_path} ({len(updated_questions)} questions)")

print("\n🎯 Tous les fichiers ont été créés dans le dossier 'JSON'.")