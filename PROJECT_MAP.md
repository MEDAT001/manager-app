# PROJECT_MAP.md — Manager.app

## TECH_STACK
- React 19.2.7 + react-dom 19.2.7
- Vite 8.1.4 (Rolldown bundler, proxy API)
- TypeScript 7.0.2
- Tailwind CSS 4.3.2 + @tailwindcss/vite 4.3.1
- lucide-react (icônes: User, Bot, Send, Mic, MicOff, Zap, RefreshCw)
- Web Speech API (navigateur natif)
- OpenRouter API (modèle: openrouter/free)
- Google Fonts: Inter (400-700)

## SYSTEM_FLOW
1. Utilisateur tape ou dicte un message
2. Message ajouté à la conversation (useChat)
3. Crédit décrémenté (useCredits)
4. Requête streaming envoyée via proxy Vite → OpenRouter
5. System prompt coaching injecté (4 disciplines + matrice de décision)
6. Réponse streamée token par token, affichée en temps réel
7. Filtre: raisonnement/steps/balises supprimés de l'affichage
8. Coach utilise la matrice PNL/IE/Ennéagramme/Énergie sans jamais les nommer

## ARCHITECTURE
- SPA React 1 route (pas de router)
- State: hooks custom (useChat, useCredits, useVoiceRecognition)
- API: streaming SSE via fetch + ReadableStream
- Sécurité: clé API dans .env.local, proxy Vite (clé côté serveur dev)
- Web Speech API pour la reconnaissance vocale (fr-FR)
- 3 phases coaching gérées par le system prompt:
  * Tours 1-3: mode Laser (questions courtes, max 2 phrases)
  * Après: mode Matrice (PNL/IE/Ennéa/Énergie selon contexte)
  * Style: Miroir → Intervention → Appel à l'action
- OrbAnimation: 3 cercles imbriqués avec animation CSS (scale + box-shadow)
- Crédits: 20 initiaux, -1/text, -2/voice

## ORPHANS & PENDING
- [ ] Tests unitaires (Vitest)
- [ ] Mode sombre
- [ ] Persistance conversations (localStorage)
- [ ] Authentification utilisateur
- [ ] Dashboard admin / suivi utilisation
- [ ] Gestion rate-limit côté client (retry 429)
