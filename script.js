/* ==============================================================================
   GESTION CENTRALISÉE DES PROJETS - MARION BACQUET
   ==============================================================================
   Ordre chronologique : DU PLUS RÉCENT (en haut) AU PLUS ANCIEN (en bas).
   
   POUR AJOUTER UN NOUVEAU PROJET :
   Ajoutez simplement un nouvel élément au TOUT DÉBUT de la liste PORTFOLIO_PROJECTS :
   
   {
       id: "mon-nouveau-projet",
       title: "Titre du projet",
       url: "page-du-projet.html",
       image: "assets/mon-image.png",
       alt: "Description de l'image",
       description: "Courte description du projet..."
   },
   
   Grâce à cette liste, votre nouveau projet se placera AUTOMATIQUEMENT EN TÊTE :
   1. Sur l'Accueil (index.html)
   2. Sur la page de tous les projets (projets.html)
   3. Dans les suggestions "Voir d'autres projets" en bas de toutes les pages !
   ============================================================================== */

const PORTFOLIO_PROJECTS = [
    {
        id: "canin",
        title: "Portrait Canin",
        url: "shooting-dog.html",
        image: "assets/dog_portrait.png",
        alt: "Portrait Canin",
        description: "Shooting animalier capturant la personnalité et la douceur des animaux de compagnie."
    },
    {
        id: "cheval",
        title: "Shooting Cheval",
        url: "shooting-cheval.html",
        image: "assets/horse_red_dress.png",
        alt: "Shooting Cheval",
        description: "J'ai réalisé mon premier shooting avec un cheval en Juin dernier, ce fut une expérience très enrichissante pour moi."
    },
    {
        id: "leslie",
        title: "Portrait Nature",
        url: "shooting-leslie.html",
        image: "assets/woman_grass.png",
        alt: "Portrait Nature",
        description: "Shooting portrait en extérieur, dans un cadre très joli."
    },
    {
        id: "mariage",
        title: "Mariage & Alliances",
        url: "shooting-mariage.html",
        image: "assets/couple_rings.png",
        alt: "Mariage & Alliances",
        description: "Reportage mariage focalisé sur les détails, les émotions et les moments précieux."
    },
    {
        id: "bullyonrocks",
        title: "Bully On Rocks",
        url: "bullyonrocks.html",
        image: "assets/bullyonrocks/tete.jpg",
        alt: "Bully On Rocks",
        description: "Shooting pour un groupe de Rock, au festival de Bully-les-Mines en 2026. Le festival \"Bully On Rocks\""
    },
    {
        id: "maternite",
        title: "Shooting Maternité",
        url: "shooting-maternite.html",
        image: "assets/maternity_blue.png",
        alt: "Shooting Maternité",
        description: "Séance photo de mise en valeur de la future maman en intérieur."
    }
];

document.addEventListener('DOMContentLoaded', () => {

    // --- FONCTIONS DE GÉNÉRATION DES CARTES PROJETS ---
    function createInteractiveCard(project) {
        const card = document.createElement('a');
        card.href = project.url;
        card.className = 'grid-card-interactive';
        card.setAttribute('aria-label', `Projet ${project.title}`);
        card.innerHTML = `
            <img src="${project.image}" alt="${project.alt || project.title}" class="grid-card-photo">
            <div class="grid-card-glass-hover">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <span class="glass-btn">Voir le projet ↗</span>
            </div>
        `;
        return card;
    }

    function createSuggestionCard(project) {
        const card = document.createElement('a');
        card.href = project.url;
        card.className = 'other-project-card';
        card.setAttribute('aria-label', `Voir projet ${project.title}`);
        card.innerHTML = `<img src="${project.image}" alt="${project.alt || project.title}">`;
        return card;
    }

    // --- INJECTION DYNAMIQUE SUR L'ACCUEIL (index.html) ---
    const mainProjectsGrid = document.getElementById('mainProjectsGrid');
    const extraProjectsGrid = document.getElementById('extraProjectsGrid');

    if (mainProjectsGrid && extraProjectsGrid) {
        mainProjectsGrid.innerHTML = '';
        PORTFOLIO_PROJECTS.slice(0, 3).forEach(project => {
            mainProjectsGrid.appendChild(createInteractiveCard(project));
        });

        extraProjectsGrid.innerHTML = '';
        PORTFOLIO_PROJECTS.slice(3).forEach(project => {
            extraProjectsGrid.appendChild(createInteractiveCard(project));
        });
    }

    // --- GESTION DU DÉROULEMENT "VOIR PLUS DE PROJETS" (Accueil) ---
    const toggleBtn = document.getElementById('toggleProjectsBtn');
    const extraWrapper = document.getElementById('extraProjects');
    if (toggleBtn && extraWrapper) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = extraWrapper.classList.toggle('open');
            toggleBtn.innerHTML = isOpen ? 'Voir moins ▲' : 'Voir plus de projets ▼';
            extraWrapper.style.maxHeight = isOpen ? (extraWrapper.scrollHeight + 60) + 'px' : '0';
        });
    }

    // --- INJECTION DYNAMIQUE SUR LA PAGE PROJETS (projets.html) ---
    const allProjectsPageGrid = document.getElementById('allProjectsPageGrid');
    if (allProjectsPageGrid) {
        allProjectsPageGrid.innerHTML = '';
        PORTFOLIO_PROJECTS.forEach(project => {
            allProjectsPageGrid.appendChild(createInteractiveCard(project));
        });
    }

    // --- INJECTION DYNAMIQUE DES SUGGESTIONS (pages individuelles) ---
    const otherProjectsGrid = document.querySelector('.other-projects-grid');
    if (otherProjectsGrid) {
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';

        // Filtrer les projets pour exclure celui de la page actuelle
        const suggestions = PORTFOLIO_PROJECTS.filter(project => {
            if (currentFile === 'audiovisuel.html') {
                return project.url !== 'audiovisuel.html';
            }
            return project.url !== currentFile;
        });

        // Limité exactement aux 3 projets les plus récents
        function renderSuggestions(listToRender) {
            otherProjectsGrid.innerHTML = '';
            listToRender.forEach(project => {
                otherProjectsGrid.appendChild(createSuggestionCard(project));
            });
        }

        renderSuggestions(suggestions.slice(0, 3));

        // Recherche dédiée sur la grille de suggestions
        const suggestionSearchInput = document.querySelector('.other-projects-section .project-search-input');
        if (suggestionSearchInput) {
            suggestionSearchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                let matchCount = 0;

                if (query === '') {
                    renderSuggestions(suggestions.slice(0, 3));
                    matchCount = 3;
                } else {
                    const filtered = suggestions.filter(p => {
                        const title = (p.title || '').toLowerCase();
                        const desc = (p.description || '').toLowerCase();
                        const alt = (p.alt || '').toLowerCase();
                        return title.includes(query) || desc.includes(query) || alt.includes(query);
                    });
                    renderSuggestions(filtered);
                    matchCount = filtered.length;
                }

                let noResultsMsg = document.getElementById('noResultsMsg');
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'noResultsMsg';
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.innerHTML = '<p>Aucun projet ne correspond à votre recherche.</p>';
                    otherProjectsGrid.parentNode.insertBefore(noResultsMsg, otherProjectsGrid.nextSibling);
                }
                noResultsMsg.style.display = (matchCount === 0 && query !== '') ? 'block' : 'none';
            });
        }
    }

    // --- MODALE DE CONTACT GLOBALE ---
    const modal = document.getElementById('contactModal');
    const closeBtn = document.getElementById('closeContactModal');
    const contactForm = document.getElementById('contactForm');

    function openModal() {
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    const contactSelectors = [
        '.nav-btn-contact',
        'a[href*="#contact"]',
        'a[href*="contact"]',
        '.footer-nav a[href*="contact"]',
        '.btn-contact-trigger'
    ];

    document.querySelectorAll(contactSelectors.join(', ')).forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- ENVOI FORMSPREE VIA FETCH ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Merci ! Votre message a bien été envoyé.');
                    contactForm.reset();
                    closeModal();
                } else {
                    alert('Une erreur est survenue lors de l\'envoi.');
                }
            } catch (error) {
                alert('Erreur réseau. Vérifiez votre connexion.');
                console.error('Erreur Formspree :', error);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- FILTRE DE RECHERCHE DE PROJETS EN TEMPS RÉEL (Accueil & Tous les projets) ---
    const searchInputs = document.querySelectorAll('.project-search-input');
    searchInputs.forEach(searchInput => {
        if (searchInput.closest('.other-projects-section')) return; // Géré spécifiquement plus haut

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            const cards = document.querySelectorAll('.grid-card-interactive, .grid-card');
            const otherCards = document.querySelectorAll('.other-project-card');

            let matchCount = 0;

            if (cards.length > 0) {
                const extraElem = document.getElementById('extraProjects');
                const toggle = document.getElementById('toggleProjectsBtn');

                if (query !== '') {
                    if (extraElem) {
                        extraElem.style.maxHeight = 'none';
                        extraElem.style.opacity = '1';
                    }
                    if (toggle) {
                        toggle.style.display = 'none';
                    }
                } else {
                    if (extraElem) {
                        const isOpen = extraElem.classList.contains('open');
                        extraElem.style.maxHeight = isOpen ? (extraElem.scrollHeight + 60) + 'px' : '0';
                        extraElem.style.opacity = isOpen ? '1' : '0';
                    }
                    if (toggle) {
                        toggle.style.display = '';
                    }
                }

                cards.forEach(card => {
                    const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
                    const desc = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
                    const imgAlt = card.querySelector('img') ? card.querySelector('img').getAttribute('alt').toLowerCase() : '';

                    if (title.includes(query) || desc.includes(query) || imgAlt.includes(query)) {
                        card.style.display = '';
                        matchCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
            } else if (otherCards.length > 0) {
                otherCards.forEach(card => {
                    const label = card.getAttribute('aria-label') ? card.getAttribute('aria-label').toLowerCase() : '';
                    const imgAlt = card.querySelector('img') ? card.querySelector('img').getAttribute('alt').toLowerCase() : '';

                    if (label.includes(query) || imgAlt.includes(query)) {
                        card.style.display = '';
                        matchCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            // Gestion du message "Aucun résultat"
            let noResultsMsg = document.getElementById('noResultsMsg');
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'noResultsMsg';
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.innerHTML = '<p>Aucun projet ne correspond à votre recherche.</p>';

                const grid = document.querySelector('.all-projects-grid, .other-projects-grid');
                if (grid) {
                    grid.parentNode.insertBefore(noResultsMsg, grid.nextSibling);
                }
            }

            if (matchCount === 0 && query !== '') {
                noResultsMsg.style.display = 'block';
            } else {
                noResultsMsg.style.display = 'none';
            }
        });
    });
});