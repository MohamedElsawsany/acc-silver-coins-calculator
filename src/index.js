import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import './i18n';
import App from './App';

// Disable right-click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Disable F12 and DevTools shortcuts
document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();

    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        (e.ctrlKey && ['u', 's'].includes(key))
    ) {
        e.preventDefault();
        return false;
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);