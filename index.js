document.addEventListener("DOMContentLoaded", function() {
    const API_URL = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json';
    const championContainer = document.getElementById('championContainer');
    const searchBar = document.getElementById('searchBar');
    const roleDropdown = document.getElementById('roleDropdown');
    let expandedCard = null;

    fetch(API_URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const champions = Object.values(data.data);
            displayChampions(champions);

            searchBar.addEventListener('input', function(e) {
                const searchValue = e.target.value.toLowerCase();
                const filteredChampions = champions.filter(function(champion) {
                    return champion.name.toLowerCase().includes(searchValue);
                });
                displayChampions(filteredChampions);
            });

            roleDropdown.addEventListener('change', function(e) {
                const selectedRole = e.target.value;
                let filteredChampions = champions;

                if (selectedRole !== 'all') {
                    filteredChampions = champions.filter(function(champion) {
                        return champion.tags.includes(selectedRole);
                    });
                }

                displayChampions(filteredChampions);
            });
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });

    function displayChampions(champions) {
        championContainer.innerHTML = '';

        champions.forEach(function(champion) {
            const championCard = document.createElement('div');
            championCard.classList.add('ch-card');
            championCard.innerHTML = `
                <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg" alt="${champion.name}">
                <h3>${champion.name}</h3>
                <p>${champion.title}</p>
            `;

            championCard.setAttribute('data-id', champion.id);

            championCard.addEventListener('click', function() {
                toggleExpand(championCard, champion.id);
            });

            championContainer.appendChild(championCard);
        });
    }

    function toggleExpand(card, championId) {
        if (expandedCard && expandedCard !== card) {
            collapseCard(expandedCard);
        }

        if (card.classList.contains('expanded')) {
            collapseCard(card);
        } else {
            expandCard(card, championId);
        }
    }

    function expandCard(card, championId) {
        card.classList.add('expanded');
        showAbilities(card, championId);
        expandedCard = card;
    }

    function collapseCard(card) {
        card.classList.remove('expanded');
        const abilitiesList = card.querySelector('.abilities-list');
        if (abilitiesList) {
            abilitiesList.remove();
        }
        expandedCard = null;
    }

    function showAbilities(card, championId) {
        const CHAMPION_DETAILS_URL = `https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion/${championId}.json`;

        fetch(CHAMPION_DETAILS_URL)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const championData = data.data[championId];
                const abilities = championData.spells.map(function(spell) {
                    return `<strong>${spell.name}</strong>: ${spell.description}`;
                });

                const abilitiesList = document.createElement('ul');
                abilitiesList.classList.add('abilities-list');

                abilities.forEach(function(ability) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = ability;
                    abilitiesList.appendChild(listItem);
                });

                card.appendChild(abilitiesList);
            })
            .catch(function(error) {
                console.error('Error fetching champion details:', error);
            });
    }
});
