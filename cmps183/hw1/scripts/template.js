console.log('on template')

const header = document.createElement('template');
header.innerHTML = `
    <header class="header">
        <h2>
            CMPS183: Homework 1
        </h2>
        <div class="pages">
            <span class="page">
                <a href="./index.html">Home</a>
            </span>
            <span class="page">
                <a href="./todo.html">Todo</a>
            </span>
            <span class="page">
                <a href="./todoForm.html">Todo Form</a>
            </span>
        </div>
    </header>`.trim();

const footer = document.createElement('template');
footer.innerHTML = `
<div class="footer">
        <div class="footer-container">
            <a href="#" class="footer-button">About Us</a> &nbsp;|&nbsp;
            <a href="#" class="footer-button">Contact</a>&nbsp;|&nbsp;
            <a href="#" class="footer-button">Privacy</a>&nbsp;|&nbsp;
            <a href="#" class="footer-button">Credits</a>
        </div>
    </div>
    `.trim();

document.body.appendChild(header.content.firstChild)
document.body.appendChild(footer.content.firstChild)
