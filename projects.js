/* ==================================================================
   DONNÉES DU PORTFOLIO
   ------------------------------------------------------------------
   Pour ajouter un projet : copie un bloc { ... } dans PROJECTS et
   remplis-le. Le site se met à jour tout seul (filtres, compteurs,
   page de détail).

   - skills  : compétences PRATIQUÉES sur ce projet. Ce sont elles que
               le filtre utilise.
   - planned : compétences en cours ou prévues. Affichées en pointillés,
               non prises en compte par le filtre. Quand c'est fait,
               déplace-les dans skills.
   - sections: blocs de la page de détail, dans l'ordre. Chaque section
               peut contenir des paragraphes (paragraphs), une liste
               (items) et/ou des choix techniques (decisions).
   Le HTML simple est autorisé dans les textes : <strong>, <code>, <em>.
   ================================================================== */

/* Groupes affichés dans le filtre. Une compétence absente de ces
   groupes apparaît dans « Autres ». */
window.SKILL_GROUPS = [
  { name: "Machine Learning", skills: ["Machine Learning", "Deep Learning", "scikit-learn", "XGBoost", "PyTorch", "Hugging Face Transformers", "Fine-tuning", "Évaluation de modèles", "Détection d'anomalies", "NLP"] },
  { name: "Vision par ordinateur", skills: ["Computer Vision", "YOLO", "SAM", "SigLIP", "Anomalib"] },
  { name: "LLM", skills: ["LLM", "OpenAI API", "RAG", "Agents", "LangChain", "ChromaDB", "Embeddings", "LangSmith", "Évaluation de LLM", "LLM-as-a-judge", "Tests statistiques"] },
  { name: "MLOps", skills: ["MLflow", "DVC", "CI/CD", "GitHub Actions", "Docker", "Prefect", "Evidently AI", "Prometheus", "Grafana"] },
  { name: "Développement et cloud", skills: ["Python", "Pytest", "Pydantic", "FastAPI", "REST API", "Git", "uv", "Streamlit", "Azure Machine Learning", "Azure"] }
];

window.PROJECTS = [

  /* ---------------------------------------------------------------- */
  {
    slug: "llm-regression-ci",
    title: "Détection de régressions d'une feature LLM en CI",
    type: "Personnel",
    period: "2026",
    status: "En cours",
    summary: "Une CI qui teste une feature LLM comme on teste du code : chaque pull request qui touche au prompt ou au modèle est évaluée sur un golden dataset, et bloquée si la qualité régresse.",
    skills: ["Python", "LLM", "OpenAI API", "Pydantic", "Git", "uv"],
    planned: ["Évaluation de LLM", "LLM-as-a-judge", "Tests statistiques", "GitHub Actions", "CI/CD", "Docker"],
    links: [{ label: "Code sur GitHub", url: "https://github.com/Romain057/llm-regression-ci" }],
    sections: [
      {
        title: "Contexte",
        paragraphs: [
          "Une feature LLM classe les emails de support d'un produit SaaS fictif en quatre catégories et en rédige un résumé d'une phrase. Changer un mot du prompt ou passer à une nouvelle version du modèle peut dégrader la qualité sans qu'aucun test classique ne le voie.",
          "Le projet traite le prompt comme du code : il lui donne une batterie de tests qui tourne à chaque pull request."
        ]
      },
      {
        title: "Où j'en suis",
        paragraphs: [
          "Le projet est initialisé (uv, dépôt GitHub) et les schémas Pydantic de la feature et de sa configuration sont en place. Je construis maintenant le golden dataset, puis le moteur d'évaluation."
        ]
      },
      {
        title: "Architecture visée",
        items: [
          "Un <strong>golden dataset</strong> de 80 emails écrits et étiquetés à la main, 20 par catégorie, avec des cas difficiles : hésitation entre deux catégories, fautes de frappe, ironie, mélange de langues, plusieurs demandes dans un même email.",
          "Le prompt et sa configuration vivent dans un <strong>YAML versionné</strong>, validé par Pydantic : identifiant de modèle daté obligatoire (pas d'alias <code>-latest</code>), champ inconnu refusé, empreinte du contenu enregistrée dans chaque run.",
          "Un <strong>runner asynchrone</strong> évalue tout le dataset en parallèle et enregistre un run JSON qui contient les prédictions, pas des pass/fail : si une étiquette est corrigée, les anciens runs sont re-notés automatiquement.",
          "La catégorie est notée par exactitude, le résumé par un <strong>juge LLM calibré</strong> sur mes propres notes.",
          "Chaque pull request est comparée à la baseline de <code>main</code> par un <strong>test de McNemar</strong>. Le verdict (PASS, WARNING ou CRITICAL) est commenté sur la PR et envoyé sur Slack, et un CRITICAL bloque le merge.",
          "Un run nocturne suit la dérive lente, et les rapports HTML sont publiés sur GitHub Pages."
        ]
      },
      {
        title: "Choix techniques",
        decisions: [
          { title: "Un dataset écrit à la main plutôt qu'un dataset public", text: "Les messages du dataset public Bitext font 9 mots en médiane : les résumer revient à les paraphraser, et un juge n'aurait rien à mesurer. Ils ne contiennent pas non plus les cas difficiles qui font régresser un prompt." },
          { title: "Des seuils calés sur le bruit mesuré", text: "Sur 80 cas, une baisse de 3 % représente 2 à 3 cas, soit l'ordre de grandeur du bruit d'un modèle non déterministe. Un test A/A (le même prompt lancé deux fois) mesure ce bruit, et McNemar, adapté à des résultats appariés sur les mêmes cas, dit si un écart est significatif." },
          { title: "Un juge calibré avant d'être cru", text: "Un juge LLM n'est fiable que s'il est d'accord avec un humain. Je note moi-même un échantillon de résumés et je mesure l'accord avec le juge avant d'utiliser ses notes." },
          { title: "YAML pour l'humain, JSON pour la machine", text: "Des emails sur plusieurs lignes se relisent en revue de PR sans échappement en YAML. Les runs, écrits par le programme, sont en JSON." },
          { title: "Un coût par run maîtrisé", text: "Un petit modèle OpenAI, raisonnement désactivé : un run complet des 80 cas est estimé à environ un centime, ce qui permet de lancer l'évaluation à chaque PR." }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "pipeline-mlops-maintenance-predictive",
    title: "Pipeline d'entraînement MLOps, maintenance prédictive",
    type: "Personnel",
    period: "2026",
    status: "En cours",
    summary: "Un pipeline qui ne met un modèle en production que s'il bat le modèle actuel selon une règle métier, et qui retrace chaque modèle jusqu'au code et aux données qui l'ont produit.",
    skills: ["Python", "Machine Learning", "scikit-learn", "Évaluation de modèles", "DVC", "MLflow", "Pytest", "Git"],
    planned: ["FastAPI", "GitHub Actions", "CI/CD", "Evidently AI", "Prometheus", "Grafana", "Prefect", "Docker"],
    links: [{ label: "Code sur GitHub", url: "https://github.com/Romain057/MLOPS-predictive-maintenance" }],
    sections: [
      {
        title: "Contexte",
        paragraphs: [
          "Le dataset AI4I 2020 simule une machine-outil : 10 000 relevés de capteurs, dont 3,4 % de pannes.",
          "Le score du modèle n'est pas le but. Le projet construit l'infrastructure autour : savoir à tout moment quel modèle tourne, avec quelles données et quel code il a été produit, et comment le reproduire."
        ]
      },
      {
        title: "Ce que j'ai réalisé",
        items: [
          "<strong>Analyse exploratoire</strong> : dataset synthétique à la structure déterministe. Cinq colonnes de type de panne (TWF, HDF, PWF, OSF, RNF) sont une fuite de la cible : je les ai exclues des features.",
          "<strong>Pipeline DVC</strong> en trois étapes (préparation, entraînement, évaluation) paramétré par <code>params.yaml</code>. <code>dvc repro</code> ne relance que les étapes dont les données, le code ou les paramètres ont changé, et <code>dvc.lock</code> garde l'empreinte exacte de chaque exécution.",
          "<strong>Entraînement tracé</strong> : un pipeline scikit-learn (encodage + Random Forest) loggé dans MLflow avec ses paramètres, ses métriques, sa signature, le commit Git et l'empreinte md5 des données.",
          "<strong>Registry MLflow</strong> : chaque entraînement crée une version, et l'alias <code>champion</code> désigne le modèle en production.",
          "<strong>Promotion automatique</strong> : un candidat ne devient champion que s'il coûte strictement moins cher que le champion actuel sur le même jeu de test.",
          "<strong>Garde-fous de traçabilité</strong> : aucune promotion si le code ou la configuration contiennent des modifications non commitées, et arrêt immédiat si le serveur MLflow n'est pas défini.",
          "<strong>Tests</strong> : la logique de décision est isolée dans une fonction pure, testée avec Pytest."
        ]
      },
      {
        title: "Choix techniques",
        decisions: [
          { title: "Un coût métier plutôt que le F1", text: "Une panne ratée coûte bien plus qu'une inspection pour rien. Le F1 suppose que les deux erreurs coûtent pareil : choisir un modèle sur le F1, c'est faire un choix métier sans l'avoir décidé. Règle retenue : coût = 10 × pannes ratées + 1 × fausse alerte. L'accuracy est écartée : un modèle qui répond toujours « pas de panne » obtient 96,6 % sans détecter une seule panne." },
          { title: "Le prétraitement dans le pipeline", text: "Encodage et modèle forment un seul objet scikit-learn. Le modèle loggé accepte les données brutes : l'API n'aura pas à dupliquer le prétraitement, et il ne peut pas y avoir d'écart entre entraînement et production." },
          { title: "Un split stratifié", text: "Avec 3,4 % de pannes, un split non stratifié fait varier le nombre de pannes du test d'un run à l'autre, et les métriques bougent pour des raisons qui n'ont rien à voir avec le modèle." },
          { title: "skops plutôt que pickle", text: "Un pickle peut exécuter n'importe quel code au chargement. skops refuse les types qui n'ont pas été déclarés." },
          { title: "DVC décide quoi, l'orchestrateur décidera quand", text: "Prefect appellera <code>dvc repro</code> au lieu de réécrire les étapes : la logique du pipeline reste à un seul endroit. Prefect plutôt que Dagster, parce que DVC gère déjà le lignage des données." }
        ]
      },
      {
        title: "Résultats",
        paragraphs: [
          "Le champion actuel, un Random Forest pondéré, détecte 46 des 68 pannes du jeu de test, en rate 22 et déclenche 15 fausses alertes, soit un coût de 235. Face à la version non pondérée, il détecte 10 pannes de plus pour 11 fausses alertes supplémentaires : un échange rentable avec ce barème."
        ]
      },
      {
        title: "Suite",
        items: [
          "API FastAPI qui charge le modèle <code>@champion</code>, avec un schéma Pydantic strict et un journal des prédictions.",
          "CI GitHub Actions (Ruff, Pytest).",
          "Monitoring de dérive avec Evidently AI et alertes Slack, métriques système avec Prometheus et Grafana.",
          "Flows Prefect : surveillance planifiée, réentraînement par <code>dvc repro</code>, puis réentraînement déclenché par la dérive.",
          "Packaging Docker et remote DVC partagé (aujourd'hui un dossier local)."
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "industrialisation-remplissage-bennes",
    title: "Industrialisation d'un modèle d'estimation du remplissage des bennes",
    type: "Professionnel",
    org: "PAPREC",
    period: "2026",
    status: "En cours",
    summary: "Mise en production de la deuxième version d'un modèle de vision qui estime le remplissage des bennes : pipeline d'entraînement reproductible, registre champion/challenger et API.",
    skills: ["Python", "Computer Vision", "YOLO", "XGBoost", "DVC", "MLflow", "FastAPI", "REST API", "Pytest"],
    planned: ["GitHub Actions", "CI/CD", "Docker", "Azure"],
    links: [],
    note: "Projet d'entreprise : le code n'est pas public.",
    sections: [
      {
        title: "Contexte",
        paragraphs: [
          "Au lab IA de PAPREC, un modèle estime le remplissage des bennes à partir d'images, en combinant une segmentation YOLO et un modèle XGBoost.",
          "Pour sa deuxième version, j'ai pris en charge l'industrialisation, en appliquant les pratiques MLOps que j'avais présentées à l'équipe."
        ]
      },
      {
        title: "Ce que j'ai réalisé",
        items: [
          "<strong>Pipeline d'entraînement reproductible</strong> avec DVC et MLflow : données et modèles versionnés.",
          "<strong>Registre champion/challenger</strong> : un nouveau modèle ne remplace le modèle en service que s'il fait mieux.",
          "<strong>API FastAPI rétrocompatible</strong> avec la version précédente.",
          "<strong>Tests</strong> avec Pytest."
        ]
      },
      {
        title: "En cours",
        items: [
          "CI/CD avec GitHub Actions.",
          "Déploiement d'une image Docker sur Azure (Container Registry, App Service)."
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "vision-flux-camera-industriels",
    title: "Vision par ordinateur sur flux caméra industriels",
    type: "Professionnel",
    org: "PAPREC",
    period: "2025 – 2026",
    status: "Terminé",
    summary: "Fine-tuning d'un modèle image-texte, constitution d'un dataset de plus de 5 000 images et benchmark de méthodes de détection d'anomalies sur les images de sites de traitement des déchets.",
    skills: ["Python", "Computer Vision", "PyTorch", "Hugging Face Transformers", "SigLIP", "Fine-tuning", "SAM", "YOLO", "Anomalib", "Détection d'anomalies", "Évaluation de modèles", "MLflow", "Azure Machine Learning"],
    planned: [],
    links: [],
    note: "Projet d'entreprise : le code n'est pas public.",
    sections: [
      {
        title: "Contexte",
        paragraphs: [
          "Projet de vision par ordinateur du lab IA de PAPREC : détecter des anomalies sur les zones de dépotage et les convoyeurs des sites, à partir des flux caméra. J'y ai travaillé sous l'encadrement de mon tuteur."
        ]
      },
      {
        title: "Ce que j'ai réalisé",
        items: [
          "<strong>Tri des flux caméra</strong> : un pipeline qui ne garde que les images exploitables, et qui en écarte 80 % avant tout traitement.",
          "<strong>Dataset</strong> de fine-tuning constitué par collecte continue, passé de 1 000 à plus de 5 000 images.",
          "<strong>Fine-tuning de SigLIP</strong>, un modèle qui projette images et textes dans le même espace vectoriel.",
          "<strong>Évaluation de SAM et YOLO</strong> (segmentation et détection d'objets) sur les images des sites.",
          "<strong>Benchmark de détection d'anomalies</strong> non et semi-supervisée avec Anomalib (PaDiM, PatchCore, FastFlow, backbones ResNet18 et WideResNet50) et un autoencodeur, sur données réelles.",
          "<strong>Versionnement des modèles</strong> avec MLflow, dans un workspace Azure Machine Learning."
        ]
      },
      {
        title: "Ce que j'en retiens",
        paragraphs: [
          "Le volet zones de dépotage n'a pas abouti : les anomalies sont trop rares pour un apprentissage supervisé, et les méthodes non supervisées testées n'ont pas été concluantes sur les images réelles. Ce qui reste exploitable : le tri des flux, le dataset et le modèle versionné.",
          "Si c'était à refaire, je fixerais le critère de succès et je collecterais des étiquettes avant de modéliser."
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "agent-rag-formation",
    title: "Agent RAG pour répondre aux questions d'une formation",
    type: "Formation",
    period: "2026",
    status: "Terminé",
    summary: "Un agent conversationnel qui cherche ses réponses dans les cours et la FAQ d'une formation, avec deux outils et un traçage complet de ses exécutions.",
    skills: ["Python", "LLM", "RAG", "Agents", "LangChain", "ChromaDB", "Embeddings", "LangSmith", "OpenAI API"],
    planned: [],
    links: [],
    note: "Projet d'examen : le code n'est pas public, les supports de cours ne pouvant pas être diffusés.",
    sections: [
      {
        title: "Contexte",
        paragraphs: [
          "Projet d'examen de ma formation : un assistant pédagogique qui répond aux questions des apprenants à partir des cours (PDF) et de la FAQ du support."
        ]
      },
      {
        title: "Ce que j'ai réalisé",
        items: [
          "Chargement des PDF avec PyMuPDF4LLM et découpage des cours en segments de 500 caractères, avec un chevauchement de 50.",
          "Découpage spécifique de la FAQ : une paire question/réponse par segment, pour qu'une réponse ne soit jamais séparée de sa question.",
          "Indexation dans ChromaDB avec des embeddings all-MiniLM-L6-v2, et recherche des 5 segments les plus proches.",
          "Deux outils pour l'agent : la recherche sémantique, qui renvoie les extraits avec leur source, et la lecture d'un PDF complet quand les extraits ne suffisent pas.",
          "Agent ReAct avec LangChain (GPT-4o-mini, température 0, 5 itérations au maximum), et traçage des exécutions dans LangSmith."
        ]
      },
      {
        title: "Ce que je ferais autrement",
        items: [
          "Mesurer avant de régler : la taille des segments et le nombre d'extraits ont été fixés sans évaluation du retrieval. Prochaine étape : hit@k et MRR sur 30 à 50 questions annotées.",
          "all-MiniLM-L6-v2 est entraîné surtout sur de l'anglais, alors que le corpus est en français : à comparer avec un modèle multilingue.",
          "Tester une recherche hybride (BM25 + vecteurs) et un reranker.",
          "Le ReAct analysé dans le texte est dépassé : les modèles actuels appellent les outils nativement. La règle d'arrêt ajoutée au prompt compensait des erreurs d'analyse. Une réécriture avec LangGraph rendrait le graphe explicite."
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "classification-multimodale-ecommerce",
    title: "Classification multimodale de produits e-commerce",
    type: "Formation",
    org: "Projet de groupe",
    period: "2026",
    status: "Terminé",
    summary: "80 000 produits classés en 27 catégories à partir de leur texte et de leur image, puis industrialisés de l'API jusqu'au monitoring.",
    skills: ["Python", "Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Docker", "MLflow", "CI/CD", "REST API", "Prometheus", "Grafana", "Streamlit"],
    planned: [],
    links: [{ label: "Dépôt du projet (groupe)", url: "https://github.com/fibonaccos/rakuten-ops" }],
    sections: [
      {
        title: "Contexte",
        paragraphs: [
          "Projet de groupe de ma formation, sur des données de catalogue e-commerce : prédire la catégorie d'un produit parmi 27 à partir de son texte et de sa photo, sur 80 000 produits."
        ]
      },
      {
        title: "Ce que nous avons réalisé",
        items: [
          "Un modèle pour le texte, un modèle pour l'image, puis fusion des deux.",
          "API REST de prédiction conteneurisée avec Docker.",
          "Suivi des expériences et registre de modèles avec MLflow.",
          "Tests et CI/CD.",
          "Monitoring avec Prometheus et Grafana, et démo interactive avec Streamlit."
        ]
      }
      /* À COMPLÉTER : ajoute une section { title: "Ma contribution", items: [...] }
         avec la partie que tu as prise en charge dans le groupe. */
    ]
  }
];
