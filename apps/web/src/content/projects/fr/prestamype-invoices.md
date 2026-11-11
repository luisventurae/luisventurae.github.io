---
title: Gestionnaire de factures
summary: Module où les entreprises gèrent, encaissent et font avancer leurs factures
role: Backend Engineer
---

Module de la plateforme Prestamype où les entreprises chargent leurs factures, suivent leurs encaissements et accèdent au financement.

### Contexte

Les entreprises chargeaient leurs factures une par une et la synchronisation avec la SUNAT, l’administration fiscale péruvienne, était lente, ce qui freinait toute la suite.

### Défi

Accélérer le chargement et la synchronisation sans perdre en fiabilité, pendant que le Business et le Produit continuaient d’itérer sur le module.

### Décisions techniques

- Microservices Node.js et TypeScript en architecture hexagonale, sur AWS avec infrastructure as code en AWS CDK.
- Chargement en masse automatisé et synchronisation SUNAT plus efficace.
- Nouvelle interface et nouveaux rapports d’encaissement, sur ordinateur et mobile.
- Coordination du module avec le Business et le Produit.

### Résultat

Le chargement automatique est passé de 2 minutes à 12 secondes par facture en moyenne, et le volume d’opportunités de financement a augmenté.
