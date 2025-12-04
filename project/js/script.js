/* ============================================
   ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
   ============================================ */

// Ждём полной загрузки DOM перед запуском скриптов
document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();      // Инициализация бургер-меню для мобильных
  initScrollTopButton(); // Инициализация кнопки "Наверх"
  initSearch();          // Инициализация поиска по ресурсам
});

/* ============================================
   БУРГЕР-МЕНЮ
   ============================================ */

/**
 * Инициализация бургер-меню для мобильных устройств
 * Открывает/закрывает меню при клике на кнопку-бургер
 */
function initBurgerMenu() {
  // Находим элементы: кнопку-бургер и список меню
  const burger = document.querySelector('.burger');
  const navList = document.querySelector('.nav-list');
  
  // Если элементов нет на странице - выходим
  if (!burger || !navList) return;

  /**
   * Закрытие меню
   * Убирает классы и атрибуты, которые показывают открытое меню
   */
  function closeMenu() {
    burger.classList.remove('is-open');           // Убираем класс открытого состояния
    document.body.classList.remove('nav-open');    // Убираем класс с body для CSS
    burger.setAttribute('aria-expanded', 'false'); // Для доступности (скринридеры)
  }

  /**
   * Открытие меню
   * Добавляет классы и атрибуты для показа меню
   */
  function openMenu() {
    burger.classList.add('is-open');              // Добавляем класс открытого состояния
    document.body.classList.add('nav-open');      // Добавляем класс на body для CSS
    burger.setAttribute('aria-expanded', 'true');  // Для доступности
  }

  // Обработчик клика на кнопку-бургер
  burger.addEventListener('click', (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    
    // Если меню открыто - закрываем, иначе открываем
    if (burger.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Закрытие меню при клике на ссылку внутри меню
  navList.addEventListener('click', (event) => {
    if (event.target.closest('a')) { // Если кликнули на ссылку
      closeMenu();
    }
  });

  // Закрытие меню при клике вне его области
  document.addEventListener('click', (event) => {
    // Если меню открыто И клик был не на меню и не на бургер
    if (burger.classList.contains('is-open') && 
        !navList.contains(event.target) && 
        !burger.contains(event.target)) {
      closeMenu();
    }
  });
}

/* ============================================
   КНОПКА "НАВЕРХ"
   ============================================ */

/**
 * Инициализация кнопки прокрутки наверх страницы
 * Показывает кнопку при прокрутке вниз и скрывает вверху
 */
function initScrollTopButton() {
  const btn = document.querySelector('.scroll-top');
  
  // Если кнопки нет на странице - выходим
  if (!btn) return;

  /**
   * Переключение видимости кнопки в зависимости от позиции прокрутки
   * Показываем кнопку, если прокрутили больше 260px вниз
   */
  const toggleVisibility = () => {
    if (window.scrollY > 260) {
      btn.classList.add('is-visible');    // Показываем кнопку
    } else {
      btn.classList.remove('is-visible'); // Скрываем кнопку
    }
  };

  // Слушаем событие прокрутки страницы
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  
  // Проверяем видимость сразу при загрузке
  toggleVisibility();

  // Обработчик клика на кнопку - прокрутка наверх
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0 }); // Прокручиваем страницу в начало
  });
}
