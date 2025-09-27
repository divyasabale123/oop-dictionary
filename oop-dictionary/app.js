// OOP Dictionary - demo by Divya Sabale
// Loads initial data.json (simulated API) and persists edits in localStorage.

const DATA_FILE = 'data.json';
let words = [];
const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const wordInput = document.getElementById('wordInput');
const meaningInput = document.getElementById('meaningInput');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const addBtn = document.getElementById('addBtn');
let editIndex = -1;

// Load data (prefer localStorage; else fetch from data.json)
async function loadData(){
  const saved = localStorage.getItem('oop_dictionary_v1');
  if(saved){
    words = JSON.parse(saved);
    render();
    return;
  }
  try {
    const res = await fetch(DATA_FILE);
    words = await res.json();
    localStorage.setItem('oop_dictionary_v1', JSON.stringify(words));
    render();
  } catch (err) {
    console.error('Failed to load data.json', err);
    words = [];
    render();
  }
}

function render(filter=''){
  listEl.innerHTML = '';
  const f = filter.trim().toLowerCase();
  const filtered = words.filter(w => !f || w.word.toLowerCase().includes(f) || w.meaning.toLowerCase().includes(f));
  if(filtered.length === 0){
    listEl.innerHTML = `<p style="grid-column:1/-1;color:#666">No matching words. Try adding one.</p>`;
    return;
  }
  filtered.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h4>${escapeHtml(w.word)}</h4>
      <p>${escapeHtml(w.meaning)}</p>
      <div class="meta">
        <button class="editBtn">Edit</button>
        <button class="delBtn">Delete</button>
      </div>`;
    card.querySelector('.editBtn').addEventListener('click', ()=> openModal('Edit Word', w.word, w.meaning, i));
    card.querySelector('.delBtn').addEventListener('click', ()=>{
      if(confirm('Delete this word?')) {
        words.splice(i,1); saveAndRender();
      }
    });
    listEl.appendChild(card);
  });
}

function openModal(title='', word='', meaning='', idx=-1){
  editIndex = idx;
  modalTitle.textContent = title;
  wordInput.value = word;
  meaningInput.value = meaning;
  modal.style.display = 'flex';
  wordInput.focus();
}
function closeModal(){ modal.style.display='none'; editIndex=-1; wordInput.value=''; meaningInput.value=''; }

saveBtn.addEventListener('click', ()=>{
  const w = wordInput.value.trim();
  const m = meaningInput.value.trim();
  if(!w || !m){ alert('Please provide both word and meaning.'); return; }
  if(editIndex > -1){
    words[editIndex] = { word: w, meaning: m };
  } else {
    words.unshift({ word: w, meaning: m });
  }
  saveAndRender();
  closeModal();
});
cancelBtn.addEventListener('click', closeModal);
addBtn.addEventListener('click', ()=> openModal('Add Word', '', '', -1));
searchEl.addEventListener('input', ()=> render(searchEl.value));

function saveAndRender(){
  localStorage.setItem('oop_dictionary_v1', JSON.stringify(words));
  render(searchEl.value);
}

function escapeHtml(text){
  return text.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// init
loadData();
