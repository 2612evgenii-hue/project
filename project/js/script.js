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

/* ============================================
   ПОИСК ПО РЕСУРСАМ
   ============================================ */

/**
 * Инициализация поиска по каталогу ресурсов
 * Фильтрует карточки ресурсов по текстовому запросу и типу
 */
function initSearch() {
  // Находим элементы формы поиска
  const searchInput = document.querySelector('.search-input');   // Поле ввода текста
  const searchSelect = document.querySelector('.search-select'); // Выпадающий список типов
  const cards = document.querySelectorAll('.search-results .resource-card'); // Все карточки для поиска
  const emptyState = document.querySelector('.search-empty');    // Сообщение "ничего не найдено"

  // Если элементов нет - выходим (поиск только на странице poisk.html)
  if (!searchInput || !searchSelect || !cards.length) return;

  /**
   * Нормализация строки для поиска
   * Приводит к нижнему регистру, убирает лишние пробелы
   * @param {string} str - строка для нормализации
   * @returns {string} - нормализованная строка
   */
  const normalize = (str) =>
    (str || '')
      .toString()
      .toLowerCase()        // В нижний регистр
      .replace(/\s+/g, ' ') // Множественные пробелы в один
      .trim();             // Убираем пробелы в начале и конце

  /**
   * Применение фильтров поиска
   * Показывает/скрывает карточки в зависимости от запроса и типа
   */
  function applySearch() {
    const query = normalize(searchInput.value); // Текст запроса
    const typeFilter = searchSelect.value;     // Выбранный тип ресурса
    let visibleCount = 0;                       // Счётчик видимых карточек

    // Проходим по всем карточкам
    cards.forEach((card) => {
      // Получаем данные из атрибутов карточки
      const title = normalize(card.dataset.title); // Название ресурса
      const tags = normalize(card.dataset.tags);   // Теги для поиска
      const type = (card.dataset.type || '').toLowerCase(); // Тип ресурса

      // Проверяем совпадение по тексту (в названии или тегах)
      const matchesText =
        !query || title.includes(query) || tags.includes(query);
      
      // Проверяем совпадение по типу (или "Все")
      const matchesType =
        typeFilter === 'all' || typeFilter === type;

      // Карточка видна, если совпадает и текст, и тип
      const isVisible = matchesText && matchesType;
      
      // Показываем или скрываем карточку
      card.style.display = isVisible ? '' : 'none';
      
      // Считаем видимые карточки
      if (isVisible) visibleCount += 1;
    });

    // Показываем сообщение "ничего не найдено", если нет результатов
    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  // Применяем поиск при вводе текста
  searchInput.addEventListener('input', applySearch);
  
  // Применяем поиск при изменении типа ресурса
  searchSelect.addEventListener('change', applySearch);

  // Запускаем поиск сразу при загрузке страницы
  applySearch();
}
