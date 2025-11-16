async function loadModule(modulePath, insertFunction) {
  try {
    const response = await fetch(modulePath);
    if (!response.ok) {
      throw new Error(`Failed to load module: ${modulePath}`);
    }
    const html = await response.text();
    insertFunction(html);
  } catch (error) {
    console.error(`Error loading module ${modulePath}:`, error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  loadModule('modules/header.html', function(html) {
    body.insertAdjacentHTML('afterbegin', html);

    if (typeof initMobileMenu === 'function') {
      initMobileMenu();
    }
    if (typeof initActiveNavLinks === 'function') {
      initActiveNavLinks();
    }
  });
  
  const footerPlaceholder = document.querySelector('.footer-placeholder');
  if (footerPlaceholder) {
    loadModule('modules/footer.html', function(html) {
      footerPlaceholder.innerHTML = html;
    });
  } else {
    const footerDiv = document.createElement('div');
    footerDiv.className = 'footer-placeholder';
    body.appendChild(footerDiv);
    loadModule('modules/footer.html', function(html) {
      footerDiv.innerHTML = html;
    });
  }
});

