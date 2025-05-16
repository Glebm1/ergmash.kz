// Движение слоев при движении мыши
document.addEventListener('mousemove', e => {
    Object.assign(document.documentElement, {
        style: `
        --move-x: ${(e.clientX - window.innerWidth / 2) * -0.003}deg;
        --move-y: ${(e.clientY - window.innerHeight / 2) * 0.01}deg;
        `
    });
});

// Слайдер в секции "Наши проекты"
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.projects-slider');
    const projectsContainer = document.querySelector('.projects-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.dots-container');

    const projectItems = document.querySelectorAll('.project-item');
    const totalItems = projectItems.length;
    let currentIndex = 0;

    function getVisibleSlides() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3;
    }

    let visibleSlides = getVisibleSlides();

    function createDots() {
        dotsContainer.innerHTML = '';
        const maxGroups = Math.ceil(totalItems / visibleSlides);
        for (let i = 0; i < maxGroups; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(i * visibleSlides));
            dotsContainer.appendChild(dot);
        }
    }

    createDots();

    function moveToSlide(index) {
        currentIndex = index;
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > totalItems - visibleSlides) currentIndex = totalItems - visibleSlides;

        const cardWidth = 100 / visibleSlides;
        const offset = -currentIndex * cardWidth;
        projectsContainer.style.transform = `translateX(${offset}%)`;

        const dots = document.querySelectorAll('.dot');
        const dotStep = Math.floor(totalItems / Math.ceil(totalItems / visibleSlides));
        const activeDotIndex = Math.min(Math.floor(currentIndex / dotStep), Math.ceil(totalItems / visibleSlides) - 1);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === activeDotIndex));
    }

    nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));

    window.addEventListener('resize', () => {
        const newVisibleSlides = getVisibleSlides();
        if (newVisibleSlides !== visibleSlides) {
            visibleSlides = newVisibleSlides;
            createDots();
            moveToSlide(currentIndex);
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    slider.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    slider.addEventListener('touchend', () => {
        const swipeDistance = touchEndX - touchStartX;
        if (swipeDistance < -minSwipeDistance) {
            moveToSlide(currentIndex + 1);
        } else if (swipeDistance > minSwipeDistance) {
            moveToSlide(currentIndex - 1);
        }
        touchStartX = 0;
        touchEndX = 0;
    });

    let isDragging = false;
    let mouseStartX = 0;
    let mouseEndX = 0;
    let dragOffset = 0;
    const minDragDistance = 50;

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        mouseStartX = e.clientX;
        dragOffset = 0;
        projectsContainer.style.transition = 'none';
    });

    slider.addEventListener('mousemove', (e) => {
        if (isDragging) {
            mouseEndX = e.clientX;
            dragOffset = mouseEndX - mouseStartX;
            const cardWidth = 100 / visibleSlides;
            const currentOffset = -currentIndex * cardWidth;
            const newOffset = currentOffset + (dragOffset / slider.offsetWidth) * 100;
            projectsContainer.style.transform = `translateX(${newOffset}%)`;
        }
    });

    slider.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            projectsContainer.style.transition = 'transform 0.5s ease-in-out';
            if (dragOffset < -minDragDistance) {
                moveToSlide(currentIndex + 1);
            } else if (dragOffset > minDragDistance) {
                moveToSlide(currentIndex - 1);
            } else {
                moveToSlide(currentIndex);
            }
            mouseStartX = 0;
            mouseEndX = 0;
            dragOffset = 0;
        }
    });

    slider.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            projectsContainer.style.transition = 'transform 0.5s ease-in-out';
            moveToSlide(currentIndex);
            mouseStartX = 0;
            mouseEndX = 0;
            dragOffset = 0;
        }
    });

    moveToSlide(0);
});

// Аккордеон для FAQ
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
            item.classList.toggle("active");
            const answer = item.querySelector(".faq-answer");
            answer.style.maxHeight = item.classList.contains("active") ? answer.scrollHeight + "px" : "0";
        });
    });
});

// Плавная прокрутка
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (targetId.startsWith("#")) {
                event.preventDefault();
                const targetSection = document.getElementById(targetId.substring(1));
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 50,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
});

// Переключение языка
document.addEventListener("DOMContentLoaded", () => {
    const langBtn = document.querySelector(".lang-btn");
    const langMenuItems = document.querySelectorAll(".lang-menu li");
    langMenuItems.forEach(item => {
        item.addEventListener("click", () => {
            const selectedLang = item.textContent;
            const targetUrl = item.getAttribute("data-url");
            langBtn.textContent = `${selectedLang} ▼`;
            window.location.href = targetUrl;
        });
    });
});

// Переключение темы
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    } else {
        body.classList.add('dark-theme');
    }
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
    });
});

// Бургер-меню
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});

// Анимация появления элементов с GSAP
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Анимация для элементов с классом .animate
    document.querySelectorAll('.animate').forEach((element, index) => {
        gsap.fromTo(element, 
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                delay: index * 0.1 // Смещение анимации для каждого элемента
            }
        );
    });
});

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gleb06092005@gmail.com', // Замени на свой Gmail
        pass: 'your-app-password' // Используй App Password от Google (не обычный пароль)
    }
});

// Route to handle form submission
app.post('/send-email', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
        from: 'gleb06092005@gmail.com', // Твой Gmail
        to: 'pmz-ural@pmz-ural.ru', // Email получателя
        subject: `Новое сообщение от ${name}`,
        text: `
            Имя: ${name}
            Email: ${email}
            Телефон: ${phone}
            Сообщение: ${message}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Письмо отправлено успешно');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Ошибка при отправке письма');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});