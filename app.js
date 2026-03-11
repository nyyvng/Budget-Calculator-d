// Getting each article
const [...articles] = document.querySelectorAll('article');
// Getting the inputs in each article
const all_da_inputs = articles.map(article =>
    article.querySelectorAll('input')
);
const next = /** @type {HTMLButtonElement} */ (document.querySelector('.next'));
const back = /** @type {HTMLButtonElement} */ (document.querySelector('.back'));
const reset = /** @type {HTMLButtonElement} */ (
    document.querySelector('.back-to-start')
);

let current_section = 0;

// Page nagivation with next, back, back to start
next.addEventListener('click', () => {
    navigate(current_section + 1);
});

back.addEventListener('click', () => {
    navigate(current_section - 1);
});

reset.addEventListener('click', () => {
    navigate(0);
});


// Step Counter JS
const arrayOfSteps = document.querySelectorAll(".stepItem")
for (const stepButton of arrayOfSteps) {
    stepButton.addEventListener("click", () => {
        navigate(stepButton.getAttribute("navTo"))
    })
}

// Setting sections to be visible or not visible based on current_section variable
/**
 * @param {number} section
 */
function navigate(section) {
    if (section === current_section) {
        return;
    }
    articles[current_section].classList.remove('current');
    articles[(current_section = section)].classList.add('current');
    
    // Hide next button if on last page
    if (current_section === articles.length - 1) {
        next.classList.add('hidden');
    } else {
        next.classList.remove('hidden');
    }
    // Hide back button if on last page
    if (current_section === 0) {
        back.classList.add('hidden');
    } else {
        back.classList.remove('hidden');
    }

    // Change inmages of step counter
    for (const stepButton of arrayOfSteps) {
        const buttonImg = stepButton.children[0]

        // Yes, I used a strange method for filling and unfilling images. 
            // I had to export new images for unfilled icons
        // Make sure we're not changing the first one since that's always filled
        if (stepButton.getAttribute("navTo") != 0) {
            if (stepButton.getAttribute("navTo") <= current_section) {
                 // For sections we're on or past, fill image in
                const filledImg = buttonImg.getAttribute("filled")
                buttonImg.setAttribute("src", filledImg)
            } else {
                 // For sections we're not at yet, unfill image
                const unfilledImg = buttonImg.getAttribute("unfilled")
                buttonImg.setAttribute("src", unfilledImg)
            }
        }

        // I have a note in HTML for coding functionality for future icons
    }
}

// Add all the values in each input on the section
/**
 * @param {NodeListOf<HTMLInputElement>} inputs
 */

function sum(inputs) {

    const arr = Array.from(inputs);
    if (arr.length === 0) return 0;

    const article = arr[0].closest('article');
    if (article && article.classList.contains('income')) {
        return 0;
    }

    return arr.reduce((total, input) => {
        const n = Number(input.value);
        return total + (Number.isFinite(n) ? n : 0);
    }, 0);
}

// Donut chart
const canvas = document.querySelector('canvas');
let current_chart = null;

function update() {
    current_chart?.destroy();
    current_chart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: document
                .querySelectorAll('article')
                .values()
                .map(article => article.firstElementChild.textContent),
            datasets: [
                {
                    label: 'Monthly (USD)',
                    data: all_da_inputs.map(inputs => sum(inputs))
                }
            ]
        }
    });
}

// Whenever you input something, update donut chart
document.body.addEventListener('input', () => {
    update();
});

update();
