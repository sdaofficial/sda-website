function initActiveNavLinks() {
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  const currentPath = window.location.pathname;
  
  let normalizedCurrentPath = currentPath;
  if (normalizedCurrentPath !== '/' && normalizedCurrentPath.endsWith('/')) {
    normalizedCurrentPath = normalizedCurrentPath.slice(0, -1);
  }

  if (normalizedCurrentPath.endsWith('/index.html')) {
    normalizedCurrentPath = normalizedCurrentPath.replace('/index.html', '') || '/';
  }
  if (normalizedCurrentPath.endsWith('index.html')) {
    normalizedCurrentPath = '/';
  }
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      return;
    }
    
    let linkPath = href || '/';
    if (linkPath !== '/' && linkPath.endsWith('/')) {
      linkPath = linkPath.slice(0, -1);
    }
    if (linkPath.endsWith('/index.html')) {
      linkPath = linkPath.replace('/index.html', '') || '/';
    }
    if (linkPath === 'index.html') {
      linkPath = '/';
    }
    
    if (normalizedCurrentPath === linkPath) {
      link.classList.add('active');
    }
  });
}

function initMobileMenu() {
  const menuToggle = document.querySelector('.header .menu-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-close');
  const body = document.body;

  function openMenu() {
    mobileMenuOverlay.classList.add('active');
    if (menuToggle) {
      menuToggle.classList.add('active');
    }
    body.classList.add('menu-open');
  }

  function closeMenu() {
    mobileMenuOverlay.classList.remove('active');
    if (menuToggle) {
      menuToggle.classList.remove('active');
    }
    body.classList.remove('menu-open');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (mobileMenuOverlay.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeMenu();
    });
  }

  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', function(e) {
      if (e.target === mobileMenuOverlay) {
        closeMenu();
      }
    });
  }
}


let teamData = {};
let currentTab = 'executives';
let currentIndex = {};

function createTeamMemberCard(member) {
  const memberCard = document.createElement('div');
  memberCard.className = 'team-member';
  
  memberCard.innerHTML = `
    <div class="team-member-image">
      <img src="${member.image}" alt="${member.name}" loading="lazy" decoding="async">
    </div>
    <h3 class="team-member-name">${member.name}</h3>
    <p class="team-member-title">${member.title}</p>
    <a href="${member.linkedin}" class="team-member-linkedin" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
      <img src="resources/images/icons/linkedin.svg" alt="LinkedIn" loading="lazy" decoding="async">
    </a>
  `;
  
  return memberCard;
}

function renderTeamMembers(tabName, members) {
  const carousel = document.querySelector(`.team-carousel[data-tab="${tabName}"]`);
  if (!carousel) return;
  
  carousel.innerHTML = '';
  
  members.forEach(member => {
    const card = createTeamMemberCard(member);
    carousel.appendChild(card);
  });
  
  currentIndex[tabName] = 0;
}

function updateCarouselPosition() {
  const activeCarousel = document.querySelector(`.team-carousel[data-tab="${currentTab}"]`);
  if (!activeCarousel) return;
  
  const members = activeCarousel.querySelectorAll('.team-member');
  if (members.length === 0) return;
  
  const itemsPerView = window.innerWidth <= 768 ? 2 : 4;
  const gap = window.innerWidth <= 768 ? 16 : 24;
  
  if (members.length <= itemsPerView) {
    activeCarousel.classList.add('centered');
    activeCarousel.style.transform = 'translateX(0)';
    currentIndex[currentTab] = 0;
    return;
  }
  
  activeCarousel.classList.remove('centered');
  const maxIndex = Math.max(0, members.length - itemsPerView);
  const currentIdx = Math.min(currentIndex[currentTab], maxIndex);
  
  const firstMember = members[0];
  const memberWidth = firstMember.offsetWidth + gap;
  const translateX = -currentIdx * memberWidth;
  
  activeCarousel.style.transform = `translateX(${translateX}px)`;
  currentIndex[currentTab] = currentIdx;
}

function updateCarouselButtons() {
  const activeCarousel = document.querySelector(`.team-carousel[data-tab="${currentTab}"]`);
  if (!activeCarousel) return;
  
  const members = activeCarousel.querySelectorAll('.team-member');
  const itemsPerView = window.innerWidth <= 768 ? 2 : 4;
  const carouselPrevBtn = document.querySelector('.carousel-btn-prev');
  const carouselNextBtn = document.querySelector('.carousel-btn-next');
  
  if (carouselPrevBtn) {
    carouselPrevBtn.style.display = 'flex';
    carouselPrevBtn.disabled = currentIndex[currentTab] === 0 || members.length <= itemsPerView;
  }
  if (carouselNextBtn) {
    carouselNextBtn.style.display = 'flex';
    const maxIndex = Math.max(0, members.length - itemsPerView);
    carouselNextBtn.disabled = currentIndex[currentTab] >= maxIndex || members.length <= itemsPerView;
  }
}

function initializeCarousel() {
  const teamTabs = document.querySelectorAll('.team-tab');
  const teamCarousels = document.querySelectorAll('.team-carousel');
  const carouselPrevBtn = document.querySelector('.carousel-btn-prev');
  const carouselNextBtn = document.querySelector('.carousel-btn-next');
  
  const executivesCarousel = document.querySelector('.team-carousel[data-tab="executives"]');
  if (executivesCarousel) {
    executivesCarousel.style.display = 'flex';
  }
  
  teamTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      teamTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      teamCarousels.forEach(carousel => {
        carousel.style.display = 'none';
      });
      
      const selectedCarousel = document.querySelector(`.team-carousel[data-tab="${tabName}"]`);
      if (selectedCarousel) {
        selectedCarousel.style.display = 'flex';
        currentTab = tabName;
        updateCarouselPosition();
        updateCarouselButtons();
      }
    });
  });

  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', function() {
      if (currentIndex[currentTab] > 0) {
        currentIndex[currentTab]--;
        updateCarouselPosition();
        updateCarouselButtons();
      }
    });
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', function() {
      const activeCarousel = document.querySelector(`.team-carousel[data-tab="${currentTab}"]`);
      if (!activeCarousel) return;
      
      const members = activeCarousel.querySelectorAll('.team-member');
      const itemsPerView = window.innerWidth <= 768 ? 2 : 4;
      const maxIndex = Math.max(0, members.length - itemsPerView);
      
      if (currentIndex[currentTab] < maxIndex) {
        currentIndex[currentTab]++;
        updateCarouselPosition();
        updateCarouselButtons();
      }
    });
  }

  updateCarouselPosition();
  updateCarouselButtons();

  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      currentIndex[currentTab] = 0;
      updateCarouselPosition();
      updateCarouselButtons();
    }, 250);
  });
}

async function loadTeamMembers() {
  try {
    const response = await fetch('team-members.json');
    if (!response.ok) {
      throw new Error('Failed to load team members data');
    }
    teamData = await response.json();
    
    Object.keys(teamData).forEach(tabName => {
      renderTeamMembers(tabName, teamData[tabName]);
    });
    
    initializeCarousel();
  } catch (error) {
    console.error('Error loading team members:', error);
  }
}
function initTeamSection() {
  loadTeamMembers();
}

document.addEventListener('DOMContentLoaded', function() {
  initActiveNavLinks();
  initMobileMenu();
  initTeamSection();
});
