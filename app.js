// // AXIOS GET Request
// const axios = require('axios');
// // Fetch data from an API
// axios.get('https://api.example.com/data')
//     .then(response => {
//     console.log(response.data); // Handle the response
//     })
//     .catch(error => {
//     console.error('Error fetching data:', error); // Handle errors
// });
// // AXIOS POST Request
// // Send data to an API
// axios.post('https://api.example.com/data', {
//     comment})
//     .then(response => {
//     console.log('Data posted successfully:', response.data);
//     })
//     .catch(error => {
//     console.error('Error posting data:', error);
// });

    // Ta emot val från knapparna i HTML-filen
    // Theme buttons
    document.getElementById('relaxationBtn')?.addEventListener('click', function() {
        userChoices.theme = 'relaxation';
        // alert('You selected Relaxation Yoga.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });
    document.getElementById('innerFocusBtn')?.addEventListener('click', function() {
        userChoices.theme = 'innerFocus';
        // alert('You selected Inner Focus Yoga.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });
    document.getElementById('strengthBtn')?.addEventListener('click', function() {
        userChoices.theme = 'strength';
        // alert('You selected Strength Yoga.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });
    document.getElementById('flexibilityBtn')?.addEventListener('click', function() {
        userChoices.theme = 'flexibility';
        // alert('You selected Flexibility Yoga.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });
    // Focus area buttons
    document.getElementById('frontFocusBtn')?.addEventListener('click', function() {
        userChoices.focusArea = 'frontside';
        // alert('You selected Frontside Focus.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });
    document.getElementById('backFocusBtn')?.addEventListener('click', function() {
        userChoices.focusArea = 'backside';
        // alert('You selected Backside Focus.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });
    document.getElementById('upperBodyFocusBtn')?.addEventListener('click', function() {
        userChoices.focusArea = 'upperBody';
        // alert('You selected Upper Body Focus.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });
    document.getElementById('lowerBodyFocusBtn')?.addEventListener('click', function() {
        userChoices.focusArea = 'lowerBody';
        // alert('You selected Lower Body Focus.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });
    document.getElementById('hipsFocusBtn')?.addEventListener('click', function() {
        userChoices.focusArea = 'hips';
        //  alert('You selected Hips Focus.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });
    document.getElementById('wholeBodyBtn')?.addEventListener('click', function() {
        userChoices.focusArea = 'wholeBody';
        // alert('You selected Whole Body.');
        displayPositions(); // Anropa funktionen för att visa positioner
    });

    // Variabel för att kunna lagra användarens val
let userChoices = {
    theme: null, // assign null initially to indicate no selection
    focusArea: null // assign null initially to indicate no selection
};

// Funktion för att visa yoga-positioner baserat på val (Anropas här ovanför)
function displayPositions() {
    if (!userChoices.theme || !userChoices.focusArea) {
        console.log('Användaren har inte valt båda alternativen än');
        return;
    }
    // Spara användarens val i localStorage
    localStorage.setItem('userChoices', JSON.stringify(userChoices));
    console.log(`Visar positioner för: ${userChoices.theme} + ${userChoices.focusArea}`);
    // Navigera till todaysyoga.html
    window.location.href = 'todaysyoga.html';
}

// Hämta och visa yogapositioner från JSON-filen 
// ASYNC gör en funktion asynkron
// AWAIT stoppar exekveringen av koden tills PROMISE är löst
async function fetchAndDisplayPositions() {
    const mainContainer = document.querySelector('main');
    
    try {
        let response = await fetch("positions.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data); // skriv ut datan i konsolen
        
        // Hämta användarens val från localStorage (för todaysyoga.html)
        const savedChoices = localStorage.getItem('userChoices');
        const userChoices = savedChoices ? JSON.parse(savedChoices) : null;
        
        // Visa positionerna på sidan
        if (mainContainer && data.positions) {
            // Filtrera positioner baserat på användarens val
            let positionsToShow = data.positions;
            
            if (userChoices) {
                positionsToShow = data.positions.filter(pose => {
                    // Kolla om position matchar både theme och focusArea
                    const matchesTheme = pose.theme && pose.theme.includes(userChoices.theme);
                    const matchesFocus = pose.focusArea && pose.focusArea.some(area => 
                        area.toLowerCase().replace(' ', '') === userChoices.focusArea.toLowerCase()
                    );
                    return matchesTheme && matchesFocus;
                });
                
                console.log(`Filtrerade från ${data.positions.length} till ${positionsToShow.length} positioner`);
            }
            
            // Kontrollera om det finns några positioner att visa
            if (positionsToShow.length === 0) {
                const noResultCard = document.createElement('section');
                noResultCard.className = 'card';
                noResultCard.innerHTML = `
                    <h3>Inga positioner hittades</h3>
                    <p>Tyvärr finns det inga yogapositioner som matchar dina val just nu.</p>
                    <button onclick="window.location.href='index.html'">Gör nya val</button>
                `;
                mainContainer.appendChild(noResultCard);
                return;
            }
            
            positionsToShow.forEach(pose => {
                const card = document.createElement('section');
                card.className = 'card';
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                const img = document.createElement('img');
                img.src = pose.image;
                img.alt = pose.title;
                imageContainer.appendChild(img);
                const descriptionContainer = document.createElement('div');
                descriptionContainer.className = 'description-container';
                const title = document.createElement('h3');
                title.textContent = pose.title;
                const description = document.createElement('p');
                description.textContent = pose.description;
                descriptionContainer.appendChild(title);
                descriptionContainer.appendChild(description);
                card.appendChild(imageContainer);
                card.appendChild(descriptionContainer);
                mainContainer.appendChild(card);
            });
            // Logga användarens val om de finns
            if (userChoices) {
                console.log(`Användaren valde: ${userChoices.theme} + ${userChoices.focusArea}`);
            }
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
        
        // Visa användarvänligt felmeddelande på sidan
        if (mainContainer) {
            const errorCard = document.createElement('section');
            errorCard.className = 'card';
            errorCard.style.backgroundColor = '#ffebee';
            errorCard.innerHTML = `
                <h3>⚠️ Ett fel uppstod</h3>
                <p>Kunde inte ladda yogapositionerna. Kontrollera att positions.json finns och försök igen.</p>
                <p style="font-size: 12px; color: #666;">Teknisk info: ${error.message}</p>
                <button onclick="location.reload()">Försök igen</button>
            `;
            mainContainer.appendChild(errorCard);
        }
    }
}

// Anropa funktionen när todaysyoga.html laddas
if (window.location.pathname.includes('todaysyoga.html')) {
    fetchAndDisplayPositions();
}

// // Debugga ASYNC/AWAIT-anrop 
// async function fetchBrokenUrl() {
//     try {
//         let response = await fetch("positions-invalid.json");
//         let data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }
// // Anropa funktionen
// fetchBrokenUrl(); 

// Hantera kommentarer
document.getElementById('comment-form')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Förhindra standardformulärsändning
    const name = document.getElementById('comment-name').value;
    const comment = document.getElementById('comment-text').value;
    console.log(`Kommentar från ${name}: ${comment}`);
    alert('Tack för din kommentar!');
    // Rensa formuläret
    document.getElementById('comment-form').reset();
});
// Visa kommentarernas rubrik med användarens namn
window.addEventListener('load', function() {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        document.getElementById('greeting').textContent = `Share your experiences, ${savedName}`;
    }
});