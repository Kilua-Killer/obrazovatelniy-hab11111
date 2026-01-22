// Калькулятор стоимости
const basePrices = {
    bot: { low: 5000, medium: 8000, high: 12000 },
    website: { low: 8000, medium: 15000, high: 25000 },
    mobile: { low: 10000, medium: 18000, high: 30000 },
    science: { low: 2000, medium: 3500, high: 6000 }
};

const urgencyMultiplier = {
    normal: 1,
    urgent: 1.5,
    superUrgent: 2
};

const baseDays = {
    low: 7,
    medium: 14,
    high: 21
};

const urgencyDays = {
    normal: 1,
    urgent: 0.5,
    superUrgent: 0.3
};

// Мобильное меню
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');
}

function calculatePrice() {
    const projectType = document.getElementById('projectType').value;
    const complexity = document.getElementById('complexity').value;
    const urgency = document.getElementById('urgency').value;
    const pages = parseInt(document.getElementById('pages').value);
    
    const basePrice = basePrices[projectType][complexity];
    const urgencyPrice = basePrice * urgencyMultiplier[urgency];
    const pagesPrice = Math.max(0, (pages - 10) * 200);
    const totalPrice = urgencyPrice + pagesPrice;
    
    const deadline = Math.ceil(baseDays[complexity] * urgencyDays[urgency]);
    
    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString('ru-RU');
    document.getElementById('deadline').textContent = deadline;
}

function updatePagesValue() {
    const pages = document.getElementById('pages').value;
    document.getElementById('pagesValue').textContent = pages;
    calculatePrice();
}

// Система уведомлений
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const content = document.getElementById('notification-content');
    
    notification.className = `notification ${type}`;
    content.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Обработчики событий
document.getElementById('projectType').addEventListener('change', calculatePrice);
document.getElementById('complexity').addEventListener('change', calculatePrice);
document.getElementById('urgency').addEventListener('change', calculatePrice);
document.getElementById('pages').addEventListener('input', updatePagesValue);

// Плавная прокрутка с улучшенным UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Добавляем подсветку целевой секции
            target.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.3)';
            setTimeout(() => {
                target.style.boxShadow = '';
            }, 1000);
        }
    });
});

// Улучшенная обработка формы заказа
function submitOrder(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const projectSubject = document.getElementById('projectSubject').value;
    const description = document.getElementById('description').value;
    
    if (!name || !phone || !email || !projectSubject || !description) {
        showNotification('⚠️ Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('📧 Введите корректный email адрес', 'error');
        return;
    }
    
    // Валидация телефона
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
        showNotification('📞 Введите корректный номер телефона', 'error');
        return;
    }
    
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Показываем загрузку
    button.innerHTML = '<div class="loading-spinner"></div> Отправка...';
    button.disabled = true;
    
    // Сохраняем заявку в localStorage (имитация базы данных)
    const order = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email,
        projectType: projectSubject,
        description: description,
        timestamp: new Date().toISOString(),
        status: 'new'
    };
    
    // Получаем существующие заказы
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('Новая заявка:', order);
    console.log('Все заявки:', orders);
    
    // Имитация отправки формы
    setTimeout(() => {
        showNotification('✅ Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов.', 'success');
        
        // Очистка формы
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
        document.getElementById('projectSubject').value = '';
        document.getElementById('description').value = '';
        
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Добавляем конфетти эффект
        createConfetti();
    }, 2000);
}

// Эффект конфетти
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random() * 0.8 + 0.2};
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const horizontalMovement = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            { 
                transform: `translateY(0) translateX(0) rotate(0deg)`,
                opacity: 1
            },
            { 
                transform: `translateY(100vh) translateX(${horizontalMovement}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Улучшенная анимация при прокрутке
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
}

// Инициализация анимаций
document.addEventListener('DOMContentLoaded', function() {
    // Запуск анимации при загрузке
    setTimeout(animateOnScroll, 100);
    
    // Первоначальный расчет цены
    calculatePrice();
    
    // Добавляем интерактивность карточкам
    document.querySelectorAll('.feature-card, .project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Показываем приветственное уведомление
    setTimeout(() => {
        showNotification('👋 Добро пожаловать в Образовательный Хаб! Готовы создать крутой проект?', 'info');
    }, 1000);
});

window.addEventListener('scroll', animateOnScroll);

// Параллакс эффект для hero секции
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = hero.querySelector('.container');
    
    if (hero && heroContent) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 800;
    }
});

// Динамическое изменение фона при прокрутке
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = scrolled / maxScroll;
    
    // Меняем градиент фона в зависимости от прокрутки
    if (scrollPercentage > 0.5) {
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else {
        document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    }
});

// Добавляем звуковые эффекты (опционально)
function playSound(type) {
    // Создаем простой звуковой эффект с помощью Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'click':
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            break;
        case 'success':
            oscillator.frequency.value = 1200;
            gainNode.gain.value = 0.2;
            break;
        case 'hover':
            oscillator.frequency.value = 600;
            gainNode.gain.value = 0.05;
            break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Добавляем звуковые эффекты к кнопкам
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', () => playSound('hover'));
    button.addEventListener('click', () => playSound('click'));
});

// Функция для просмотра заявок (для админа)
function viewOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('Все заявки:', orders);
    return orders;
}

// Добавляем горячую клавишу для просмотра заявок
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'O') {
        e.preventDefault();
        const orders = viewOrders();
        showNotification(`📊 Всего заявок: ${orders.length}. Проверьте консоль для деталей.`, 'info');
    }
});
