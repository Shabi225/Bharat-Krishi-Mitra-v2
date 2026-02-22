
let allSchemes = [];
let currentPage = 1;
const CARDS_PER_PAGE = 6;

async function loadSchemes() {
  console.log('Fetching schemes from database...');
  try {
    const response = await fetch('./api/schemes');
    const data = await response.json();
    console.log('Data received from API:', data);
    allSchemes = data.schemes || [];
    if (allSchemes.length > 0) {
      renderCards(allSchemes);
    } else {
      console.warn('No schemes found in the data received');
      document.getElementById('schemesGrid').innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#666;">कोई योजना नहीं मिली (Data Seed करें)</div>';
    }
    console.log('✅ Schemes processed:', allSchemes.length);
  } catch (e) {
    console.error('❌ DB load failed:', e);
    document.getElementById('schemesGrid').innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#666;">डेटाबेस से लोड नहीं हो सका</div>';
  }
}


function renderCards(schemes = [], page = currentPage) {
  console.log('Rendering cards for schemes:', schemes.length, 'Page:', page);

  if (!Array.isArray(schemes) || schemes.length === 0) {
    document.getElementById('schemesGrid').innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#666;">कोई योजना नहीं मिली</div>';
    document.getElementById('pagination').style.display = 'none';
    return;
  }
  
  const startIndex = (page - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const pageSchemes = schemes.slice(startIndex, endIndex);
  
  const grid = document.getElementById('schemesGrid');
  grid.innerHTML = pageSchemes.map(scheme => `
    <div class="scheme-card card" 
         data-gender="${scheme.gender || ''}" 
         data-caste="${scheme.caste || ''}" 
         data-age="${scheme.age || ''}" 
         data-state="${scheme.state || ''}" 
         data-category="${scheme.category || ''}"
         onclick="showDetail('${scheme.id || ''}')">
      <h4 class="card-header">${scheme.name || 'नाम उपलब्ध नहीं'}</h4>
      <ul>${(scheme.cardPoints || []).map(point => `<li>${point || ''}</li>`).join('')}</ul>
      <div class="status-badge">${scheme.status || ''}</div>
    </div>
  `).join('');
  
  renderPagination(schemes.length, page);
  currentPage = page;
}

function renderPagination(totalSchemes, currentPageNum) {
  const totalPages = Math.ceil(totalSchemes / CARDS_PER_PAGE);
  const pagination = document.getElementById('pagination');
  
  if (totalPages <= 1 || !pagination) {
    if (pagination) pagination.style.display = 'none';
    return;
  }
  
  pagination.style.display = 'flex';
  pagination.innerHTML = '';
  
  
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '« पिछला';
  prevBtn.className = 'pagination-btn';
  prevBtn.disabled = currentPageNum === 1;
  prevBtn.onclick = () => goToPage(currentPageNum - 1);
  pagination.appendChild(prevBtn);
  
  
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `pagination-btn ${i === currentPageNum ? 'active' : ''}`;
    btn.onclick = () => goToPage(i);
    pagination.appendChild(btn);
  }
  

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'अगला »';
  nextBtn.className = 'pagination-btn';
  nextBtn.disabled = currentPageNum === totalPages;
  nextBtn.onclick = () => goToPage(currentPageNum + 1);
  pagination.appendChild(nextBtn);
}

function goToPage(page) {
  const totalPages = Math.ceil(allSchemes.length / CARDS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  renderCards(allSchemes, page);
}

function filterSchemes() {
  const checked = Array.from(document.querySelectorAll('.filters input:checked'))
    .map(cb => cb.value.toLowerCase());
  
  const filteredSchemes = allSchemes.filter(scheme => {
    const dataValues = Object.values(scheme).map(v => 
      typeof v === 'string' ? v.toLowerCase() : ''
    );
    return checked.length === 0 || 
      checked.some(val => dataValues.some(d => d.includes(val)));
  });
  
  currentPage = 1;
  renderCards(filteredSchemes, 1);
}

function clearFilters() {
  document.querySelectorAll('.filters input').forEach(cb => cb.checked = false);
  currentPage = 1;
  renderCards(allSchemes, 1);
}

function showDetail(id) {
  const scheme = allSchemes.find(s => s && s.id === id);
  if (!scheme) return;
  
  document.getElementById('detailTitle').textContent = scheme.name;
  
  let content = '';
  if (scheme.description) content += scheme.description;
  
  if (scheme.applySteps && scheme.applySteps.length > 0) {
    content += '<div class="apply-section"><h3>आवेदन कैसे करें</h3><ol>';
    scheme.applySteps.forEach(step => content += `<li>${step}</li>`);
    content += '</ol></div>';
  }
  
  if (scheme.documents && scheme.documents.length > 0) {
    content += '<div class="docs-section"><h3>जरूरी कागजात</h3><ul>';
    scheme.documents.forEach(doc => content += `<li>${doc}</li>`);
    content += '</ul></div>';
  }
  
  if (scheme.notes) {
    content += `<div class="notes-section"><strong>ध्यान दें:</strong> ${scheme.notes}</div>`;
  }
  
  document.getElementById('detailContent').innerHTML = content;
  
  const applyBtn = document.getElementById('applyBtn');
  if (applyBtn) applyBtn.href = scheme.applyLink;
  else {
    const detail = document.querySelector('.detail');
    if (detail) {
      detail.insertAdjacentHTML('beforeend', 
        `<a id="applyBtn" href="${scheme.applyLink || '#'}" target="_blank" class="apply-link">अभी आवेदन करें</a>`);
    }
  }
  
  document.getElementById('detailModal').style.display = 'block';
}

function closeDetail() {
  document.getElementById('detailModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign in to view the schemes.');
    window.location.href = 'signin.html';
    return;
  }

  loadSchemes();
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDetail();
  });
});


function toggleNavMenu() {
  const menu = document.getElementById('navMenu');
  menu.classList.toggle('show');
}


document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('.nav-dropdown');
  if (!dropdown.contains(e.target)) {
    document.getElementById('navMenu').classList.remove('show');
  }
});

// Force native lang refresh after load
setTimeout(() => {
  const combo = document.querySelector('.goog-te-combo');
  if (combo) combo.dispatchEvent(new Event('change'));
}, 2000);

