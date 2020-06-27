// Transition from log in to register form
let logBtn = document.querySelector('#flip-register-form');
let logForm = document.querySelector('.log-in-form');
let registerForm = document.querySelector('.register-form');
let registerBtn = document.querySelector('#flip-log-form');

registerBtn.addEventListener('click', () => {
    logForm.style.top = "-400%";
    registerForm.style.top = "0%";
    console.log('work')
});

logBtn.addEventListener('click', () => {
    registerForm.style.top = '-400%';
    logForm.style.top = '0%';
});

