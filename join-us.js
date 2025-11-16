let eventsData = [];

async function loadEvents() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error('Failed to load events data');
    }
    const data = await response.json();
    eventsData = data.events;
    renderEvents(eventsData);
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

function renderEvents(events) {
  const eventsGrid = document.getElementById('eventsGrid');
  if (!eventsGrid) return;

  eventsGrid.innerHTML = '';

  events.forEach((event, index) => {
    const eventCard = createEventCard(event, index);
    eventsGrid.appendChild(eventCard);
  });
}

function createEventCard(event, index) {
  const card = document.createElement('div');
  card.className = 'event-card';
  card.setAttribute('data-event-index', index);
  card.style.cursor = 'pointer';

  card.innerHTML = `
    <div class="event-card-image">
      <img src="${event.image}" alt="${event.heading}" loading="lazy" decoding="async">
    </div>
    <div class="event-card-content">
      <h3 class="event-card-heading">${event.heading}</h3>
      <p class="event-card-description">
        ${event.description}
      </p>
      <a class="event-card-read-more" style="display: none;">Read more</a>
    </div>
  `;

  card.addEventListener('click', function(e) {
    openEventModal(event);
  });

  const readMoreBtn = card.querySelector('.event-card-read-more');
  if (readMoreBtn) {
    readMoreBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      openEventModal(event);
    });
  }

  const descriptionLinks = card.querySelectorAll('.event-description-link');
  descriptionLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  setTimeout(() => {
    const description = card.querySelector('.event-card-description');
    const readMoreButton = card.querySelector('.event-card-read-more');
    
    if (description && readMoreButton && description.scrollHeight > description.clientHeight) {
      readMoreButton.style.display = 'block';
    }
  }, 0);

  return card;
}

function openEventModal(event) {
  if (!event) return;

  const modal = document.getElementById('eventModal');
  const modalImage = document.getElementById('modalEventImage');
  const modalHeading = document.getElementById('modalEventHeading');
  const modalDescription = document.getElementById('modalEventDescription');

  if (modal && modalImage && modalHeading && modalDescription) {
    modalImage.src = event.image;
    modalImage.alt = event.heading;
    modalImage.loading = 'eager';
    modalImage.decoding = 'async';
    modalHeading.textContent = event.heading;
    modalDescription.innerHTML = event.description;

    modal.classList.add('active');
    document.body.classList.add('modal-open');

    const modalLinks = modalDescription.querySelectorAll('.event-description-link');
    modalLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });

    const modalContent = modal.querySelector('.event-modal-content');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
  }
}

function closeEventModal() {
  const modal = document.getElementById('eventModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;

function sortEvents(sortBy) {
  let sortedEvents = [...eventsData];

  switch (sortBy) {
    case 'recent':
      sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'alphabetical':
      sortedEvents.sort((a, b) => a.heading.localeCompare(b.heading));
      break;
    default:
      break;
  }

  renderEvents(sortedEvents);
}

function initEventsDropdown() {
  const dropdown = document.getElementById('eventsDropdown');
  const button = dropdown?.querySelector('.events-dropdown-button');
  const menu = dropdown?.querySelector('.events-dropdown-menu');
  const options = dropdown?.querySelectorAll('.events-dropdown-option');
  const selectedText = dropdown?.querySelector('.events-dropdown-selected');
  const hiddenSelect = document.getElementById('events-sort-select');

  if (!dropdown || !button || !menu || !selectedText || !hiddenSelect) return;

  button.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('active');
    button.setAttribute('aria-expanded', dropdown.classList.contains('active'));
  });

  options.forEach(option => {
    option.addEventListener('click', function() {
      const value = this.getAttribute('data-value');
      const text = this.textContent;

      selectedText.textContent = text;

      hiddenSelect.value = value;
      hiddenSelect.dispatchEvent(new Event('change'));

      options.forEach(opt => opt.setAttribute('aria-selected', 'false'));
      this.setAttribute('aria-selected', 'true');

      dropdown.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  button.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dropdown.classList.toggle('active');
      button.setAttribute('aria-expanded', dropdown.classList.contains('active'));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!dropdown.classList.contains('active')) {
        dropdown.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
      const firstOption = options[0];
      if (firstOption) firstOption.focus();
    }
  });

  options.forEach((option, index) => {
    option.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextOption = options[index + 1];
        if (nextOption) nextOption.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevOption = options[index - 1];
        if (prevOption) prevOption.focus();
        else button.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
        button.focus();
      }
    });

    option.setAttribute('tabindex', '0');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadEvents();
  initEventsDropdown();

  const sortSelect = document.getElementById('events-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortEvents(this.value);
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeEventModal();
    }
  });

  const modal = document.getElementById('eventModal');
  if (modal) {
    const modalContent = modal.querySelector('.event-modal-content');
    if (modalContent) {
      modalContent.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }
});

