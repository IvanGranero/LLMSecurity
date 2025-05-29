function createHexMessage() {
    const message = document.createElement('div');
    message.className = 'hex-message';
    message.style.left = Math.random() * 100 + 'vw';
    message.style.top = Math.random() * 100 + 'vh';
    
    const id = Math.floor(Math.random()*4096).toString(16).padStart(3, '0');
    const data = Array(8).fill().map(() => Math.floor(Math.random()*256).toString(16).padStart(2, '0')).join(' ');
    //message.textContent = `0x${id}#${data}`;
    message.textContent = data;
    
    document.querySelector('.background').appendChild(message);
    
    // Trigger reflow
    void message.offsetWidth;
    
    message.style.animation = `fadeInOut ${Math.random() * 3 + 2}s ease-in-out`;
    
    message.addEventListener('animationend', () => message.remove());
}

function initializeBackground() {
    document.querySelector('.background').innerHTML = '';
    
    for(let i = 0; i < 50; i++) {
        createHexMessage();
    }
}

function maintainMessageCount() {
    const currentCount = document.querySelectorAll('.hex-message').length;
    const desiredCount = 50;
    if (currentCount < desiredCount) {
        for (let i = 0; i < desiredCount - currentCount; i++) {
            createHexMessage();
        }
    }
}

window.addEventListener('load', () => {
    initializeBackground();
    setInterval(maintainMessageCount, 1000);
});

function toggleForms() {
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');
    if (loginContainer.style.display === 'none') {
        loginContainer.style.display = 'block';
        registerContainer.style.display = 'none';
    } else {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    }
}