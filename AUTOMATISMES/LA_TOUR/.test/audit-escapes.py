#!/usr/bin/env python3
"""Audit des échappements LaTeX dans les modules JS de LA TOUR.
Convention correcte : 2 backslashes avant ( ou ) dans le fichier source
(→ 1 backslash à l'exécution). Aucune séquence \n littérale."""
import re, sys
from collections import Counter

ok = True
for f in sys.argv[1:]:
    s = open(f, encoding='utf-8').read()
    ouv = Counter(len(m.group(1)) for m in re.finditer(r'(\\+)\(', s))
    fer = Counter(len(m.group(1)) for m in re.finditer(r'(\\+)\)', s))
    nl = Counter(len(m.group(1)) for m in re.finditer(r'(\\+)n\b', s))
    bad_ouv = {k: v for k, v in ouv.items() if k != 2}
    bad_fer = {k: v for k, v in fer.items() if k != 2}
    bad_nl = dict(nl)
    status = 'OK ' if not bad_ouv and not bad_fer and not bad_nl else 'BAD'
    if status == 'BAD':
        ok = False
    print(f"{status} {f}  ouvrants={dict(sorted(ouv.items()))} fermants={dict(sorted(fer.items()))} n={dict(nl)}")
sys.exit(0 if ok else 1)
