document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch classes from Supabase
        const classes = await window.fetchClasses();
        
        // Populate the classes grid
        const classesGrid = document.querySelector('.classes-grid');
        classes.forEach(classItem => {
            const classCard = createClassCard(classItem);
            classesGrid.appendChild(classCard);
        });

        // Set up filter buttons
        setupFilters();

        // Set up register button click handlers
        setupRegisterButtons();

    } catch (error) {
        console.error('Error initializing classes:', error);
    }
});

function createClassCard(classData) {
    const classCard = document.createElement('div');
    classCard.className = 'class-card';
    classCard.dataset.category = classData.category;
    
    // Format the start time
    const startTime = new Date(classData.date);
    const options = { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
    };
    const formattedStartTime = startTime.toLocaleString('en-US', options);

    classCard.innerHTML = `
        <img src="${classData.image_url}" alt="${classData.title}">
        <div class="class-card-content">
            <h3>${classData.title}</h3>
            <div class="class-info">
                <div class="info-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${startTime.toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-rupee-sign"></i>
                    <span>₹${classData.fee}</span>
                </div>
            </div>
            <p class="description">${classData.description}</p>
            <button class="register-btn" onclick="storeAndRedirect('${classData.title}', '${classData.date}', '${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}', '${classData.fee}')">
                <i class="fas fa-calendar-alt"></i>
                Register Now
            </button>
        </div>
    `;

    return classCard;
}

// Function to store course details in localStorage and redirect
function storeAndRedirect(title, date, time, fee) {
    const courseDetails = {
        title: title,
        date: date,
        time: time,
        fee: fee
    };
    localStorage.setItem('courseDetails', JSON.stringify(courseDetails));
    window.location.href = 'register.html';
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.filter;
            const classCards = document.querySelectorAll('.class-card');
            
            classCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function setupRegisterButtons() {
    const registerBtns = document.querySelectorAll('.register-btn');
    registerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.class-card');
            const title = card.querySelector('h3').textContent;
            const date = card.querySelector('.info-item:first-child span').textContent;
            const time = card.querySelector('.info-item:nth-child(2) span').textContent;
            const fee = card.querySelector('.info-item:nth-child(3) span').textContent.replace('₹', '').trim();
            
            storeAndRedirect(title, date, time, fee);
        });
    });
}
