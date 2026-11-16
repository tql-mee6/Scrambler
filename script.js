document.addEventListener('DOMContentLoaded', () => {
      // === КАСТОМНЫЙ КУРСОР ===
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  // Двигаем курсор за мышкой
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Эффект клика
  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

  // Прячем курсор, если мышь ушла за пределы окна
  document.addEventListener('mouseleave', () => cursor.style.display = 'none');
  document.addEventListener('mouseenter', () => cursor.style.display = 'block');

    // 1. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ (SCROLL REVEAL)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Если хотим, чтобы анимация срабатывала только один раз, раскомментируем строчку ниже:
          // revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 }); // Срабатывает, когда 15% элемента видно
  
    revealElements.forEach(el => revealObserver.observe(el));
  
  
  // === ИСТОРИЯ В ДЕТАЛЯХ (Раскадровка) ===
  const storyData = [
    {
      title: "Ожидание на станции",
      note: "Эсра сидит на скамейке, полностью погрузившись в экран смартфона. Время вокруг нее будто остановилось, она не замечает ничего вокруг.",
      img: "images/wate.jpg" // <-- ИЗМЕНЕНО
    },
    {
      title: "Взгляд кубика",
      note: "Рядом лежит старый кубик Рубика. Благодаря мастерству аниматоров, кажется, что он «смотрит» на девушку, ожидая, когда она обратит на него внимание.",
      img: "images/screen2.jpg" // <-- Оставили старую (или замените на свою)
    },
    {
      title: "Первый контакт",
      note: "Эсра замечает кубик. Любопытство берет верх над привычкой бесконечно скроллить ленту. Она берет его в руки.",
      img: "images/contact.jpg" // <-- ИЗМЕНЕНО
    },
    {
      title: "Сборка",
      note: "Процесс сборки кубика требует времени и внимания. Это становится медитацией, которая возвращает Эсру в реальный мир и настоящее время.",
      img: "images/sborka.jpg" // <-- ИЗМЕНЕНО
    }
  ];

  const storyTabs = document.querySelectorAll('.story-tab');
  const storyTitle = document.getElementById('storyTitle');
  const storyNote = document.getElementById('storyNote');
  const storyImg = document.getElementById('storyImg');

  storyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Убираем активный класс у всех
      storyTabs.forEach(t => t.classList.remove('active'));
      // Добавляем текущему
      tab.classList.add('active');

      // Плавно скрываем контент
      storyTitle.style.opacity = 0;
      storyNote.style.opacity = 0;
      storyImg.style.opacity = 0;

      setTimeout(() => {
        const ep = tab.dataset.ep;
        storyTitle.textContent = storyData[ep].title;
        storyNote.textContent = storyData[ep].note;
        storyImg.src = storyData[ep].img;
        
        // Плавно показываем
        storyTitle.style.opacity = 1;
        storyNote.style.opacity = 1;
        storyImg.style.opacity = 1;
      }, 200);
    });
  });
  
  
    // 3. ЛАЙТБОКС (ПРОСМОТР КАРТИНОК)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
  
    galleryItems.forEach(item => {
      item.addEventListener('click', (e) => {
        lightboxImg.src = e.target.src;
        lightbox.removeAttribute('hidden'); // Показываем
        // Небольшая задержка для срабатывания CSS-перехода
        setTimeout(() => lightbox.classList.add('show'), 10);
      });
    });
  
    function closeLightbox() {
      lightbox.classList.remove('show');
      setTimeout(() => lightbox.setAttribute('hidden', ''), 300); // Ждем окончания анимации
    }
  
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox(); // Закрыть при клике на фон
    });
    
    // Закрытие по нажатию Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) {
        closeLightbox();
      }
    });

  // === 3D КУБИК РУБИКА (Плавное вращение) ===
  const cube = document.getElementById('cube');
  
  const faceColors = ['#d64545', '#f2a541', '#2a9d8f', '#e9eef3', '#ffd166', '#457b9d'];
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

  // Создаем грани
  faces.forEach((faceClass, index) => {
    const face = document.createElement('div');
    face.classList.add('cube-face', faceClass);
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cube-cell');
      cell.style.backgroundColor = faceColors[index]; 
      face.appendChild(cell);
    }
    cube.appendChild(face);
  });

  // Переменные для вращения
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let rotation = { x: -20, y: -30 }; // Текущий угол
  let velocity = { x: 0, y: 0 };     // Скорость вращения для инерции

  // Зажимаем мышку
  cube.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY }; // Используем clientX/Y
    velocity = { x: 0, y: 0 }; // Сбрасываем скорость
    cube.style.transition = 'none'; // Отключаем CSS-плавность на время перетаскивания
  });

  // Водим мышкой (слушаем весь документ, чтобы кубик не "застревал", если мышка ушла за его край)
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      // Вычисляем скорость для инерции
      velocity.y = deltaMove.x * 0.5;
      velocity.x = -deltaMove.y * 0.5;

      rotation.y += velocity.y;
      rotation.x += velocity.x;

      cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  // Отпускаем мышку
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      cube.style.transition = 'transform 0.2s ease-out'; // Включаем плавность для инерции
      
      // Применяем инерцию (кубик прокручивается еще чуть-чуть)
      rotation.x += velocity.x * 2;
      rotation.y += velocity.y * 2;
      cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    }
  });
  
  });