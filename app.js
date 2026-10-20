const $ = (id) => document.getElementById(id);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const fields = {
  author: $('author'), handle: $('handle'), time: $('post-time'), text: $('post-text'),
  likes: $('likes'), comments: $('comments'), shares: $('shares'),
  photo: $('post-image'), avatar: $('avatar-image')
};

const avatars = {
  female: Array.from({ length:15 }, (_, index) => `assets/avatars/woman-${index + 1}.jpg`),
  male: Array.from({ length:15 }, (_, index) => `assets/avatars/man-${index + 1}.jpg`)
};
const state = { photo: makePlaceholder(), avatar: avatars.female[0] };
const formatState = {
  facebook: { layout: 'standard', image: 'original' },
  x: { layout: 'standard', image: 'original' },
  instagram: { layout: 'standard', image: 'square' }
};
const layoutOptions = {
  facebook: [['standard', 'Post w aktualnościach']],
  x: [['standard', 'Post w osi czasu'], ['embed', 'Osadzony post']],
  instagram: [['standard', 'Post w aplikacji'], ['embed', 'Osadzony post']]
};
let activePlatform = 'facebook';
const people = [
  { name:'Maja Zielińska', gender:'female' },
  { name:'Aleksandra Nowak', gender:'female' },
  { name:'Karolina Lis', gender:'female' },
  { name:'Natalia Borkowska', gender:'female' },
  { name:'Joanna Kowalska', gender:'female' },
  { name:'Anna Wiśniewska', gender:'female' },
  { name:'Zofia Kamińska', gender:'female' },
  { name:'Julia Lewandowska', gender:'female' },
  { name:'Katarzyna Wójcik', gender:'female' },
  { name:'Magdalena Mazur', gender:'female' },
  { name:'Alicja Krawczyk', gender:'female' },
  { name:'Monika Piotrowska', gender:'female' },
  { name:'Paulina Grabowska', gender:'female' },
  { name:'Ewa Pawłowska', gender:'female' },
  { name:'Weronika Michalska', gender:'female' },
  { name:'Jan Wysocki', gender:'male' },
  { name:'Michał Domański', gender:'male' },
  { name:'Piotr Kowalski', gender:'male' },
  { name:'Tomasz Nowak', gender:'male' },
  { name:'Jakub Wiśniewski', gender:'male' },
  { name:'Mateusz Kamiński', gender:'male' },
  { name:'Adam Lewandowski', gender:'male' },
  { name:'Krzysztof Wójcik', gender:'male' },
  { name:'Paweł Mazur', gender:'male' },
  { name:'Marcin Krawczyk', gender:'male' },
  { name:'Łukasz Piotrowski', gender:'male' },
  { name:'Bartosz Grabowski', gender:'male' },
  { name:'Wojciech Pawłowski', gender:'male' },
  { name:'Kamil Michalski', gender:'male' },
  { name:'Maciej Zawadzki', gender:'male' }
];
const texts = [
  'Czasem najlepsze pomysły zaczynają się od zwykłego spotkania. Dziękuję za rozmowy, energię i wspólny dzień ✨',
  'Mały zapis dużego dnia. Wracam z głową pełną pomysłów i wdzięcznością za ludzi, których spotykam po drodze.',
  'Nowe miejsce, dobre rozmowy i jeszcze lepsza energia. Takie dni warto zapamiętać 📷',
  'Za kulisami projektu, nad którym pracujemy od kilku tygodni. Już niedługo pokażemy więcej!'
];

function makePlaceholder() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#274c5e"/><stop offset=".55" stop-color="#e0a477"/><stop offset="1" stop-color="#f3d7bd"/></linearGradient></defs>
  <rect width="1200" height="800" fill="url(#g)"/><circle cx="950" cy="170" r="95" fill="#fff4d1" opacity=".9"/>
  <path d="M0 610 250 375 430 555 650 290 980 610Z" fill="#355f5a"/><path d="M0 680 310 470 540 660 760 405 1200 690Z" fill="#193c41" opacity=".9"/>
  <rect y="675" width="1200" height="125" fill="#102f34"/><text x="58" y="735" fill="white" opacity=".88" font-family="Arial" font-size="34">Twoje zdjęcie pojawi się tutaj</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function nowLocal() {
  const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,16);
}
fields.time.value = nowLocal();

function number(value) { return Math.max(0, Number(value) || 0); }
function compact(value) { return Intl.NumberFormat('pl-PL', { notation:'compact', maximumFractionDigits:1 }).format(number(value)); }
function full(value) { return Intl.NumberFormat('pl-PL').format(number(value)); }
function dateObj() { return fields.time.value ? new Date(fields.time.value) : new Date(); }
function handleValue() { return fields.handle.value.trim().replace(/^@/, '').replace(/\s+/g, '').toLowerCase() || 'uzytkownik'; }

function setStat(selector, known, value) {
  $$(selector).forEach(el => {
    el.textContent = known ? value : '███';
    el.classList.toggle('masked-stat', !known);
  });
}

function update() {
  const d = dateObj();
  const author = fields.author.value.trim() || 'Autor posta';
  const handle = handleValue();
  const text = fields.text.value;
  const likesKnown = fields.likes.value !== '', commentsKnown = fields.comments.value !== '', sharesKnown = fields.shares.value !== '';
  const likes = number(fields.likes.value), comments = number(fields.comments.value), shares = number(fields.shares.value);
  const derivedKnown = likesKnown && commentsKnown && sharesKnown;
  const views = Math.max(likes * 37 + comments * 11 + shares * 19, 120);
  const followers = Math.max(900 + likes * 68, 1900);
  $$('.author-target').forEach(el => el.textContent = author);
  $$('.handle-target').forEach(el => el.textContent = handle);
  $$('.text-target').forEach(el => el.textContent = text);
  setStat('.likes-target', likesKnown, full(likes));
  setStat('.comments-target', commentsKnown, full(comments));
  setStat('.shares-target', sharesKnown, full(shares));
  setStat('.views-target', derivedKnown, full(views));
  setStat('.views-short-target', derivedKnown, compact(views));
  setStat('.followers-target', derivedKnown, compact(followers));
  $$('.avatar-target').forEach(el => el.src = state.avatar);
  $$('.photo-target').forEach(el => el.src = state.photo);
  $$('.fb-date-target').forEach(el => el.textContent = new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'}).format(d));
  $$('.x-short-date-target').forEach(el => el.textContent = new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short'}).format(d));
  $$('.x-time-target').forEach(el => el.textContent = new Intl.DateTimeFormat('pl-PL',{hour:'2-digit',minute:'2-digit'}).format(d));
  $$('.x-date-target').forEach(el => el.textContent = new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short',year:'numeric'}).format(d));
  $$('.ig-date-target').forEach(el => el.textContent = new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'long'}).format(d));
  $('char-count').textContent = text.length;
}

function applyFormats() {
  const current = formatState[activePlatform];
  const layoutSelect = $('layout-format');
  layoutSelect.innerHTML = layoutOptions[activePlatform].map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
  if (!layoutOptions[activePlatform].some(([value]) => value === current.layout)) current.layout = 'standard';
  $('layout-format').value = current.layout;
  $('image-format').value = current.image;
  $$('.post-card').forEach(card => card.classList.toggle('embed-mode', card.dataset.card === activePlatform && current.layout === 'embed'));
  $$('.post-photo').forEach(photo => {
    photo.classList.remove('format-square', 'format-portrait', 'format-landscape');
    if (current.image !== 'original' && photo.closest(`[data-card="${activePlatform}"]`)) photo.classList.add(`format-${current.image}`);
  });
}

Object.values(fields).filter(el => !['file'].includes(el.type)).forEach(el => el.addEventListener('input', update));

function loadFile(input, key) {
  const file = input.files?.[0]; if (!file) return;
  const reader = new FileReader(); reader.onload = () => { state[key] = reader.result; update(); }; reader.readAsDataURL(file);
}
fields.photo.addEventListener('change', () => loadFile(fields.photo, 'photo'));
fields.avatar.addEventListener('change', () => loadFile(fields.avatar, 'avatar'));

$$('.tab').forEach(tab => tab.addEventListener('click', () => {
  activePlatform = tab.dataset.platform;
  $$('.tab').forEach(x => x.classList.toggle('active', x === tab));
  $$('.post-card').forEach(card => card.classList.toggle('active-card', card.dataset.card === tab.dataset.platform));
  applyFormats();
}));

$('layout-format').addEventListener('change', event => { formatState[activePlatform].layout = event.target.value; applyFormats(); });
$('image-format').addEventListener('change', event => { formatState[activePlatform].image = event.target.value; applyFormats(); });

$$('.view-button').forEach(button => button.addEventListener('click', () => {
  $$('.view-button').forEach(x => x.classList.toggle('active', x === button));
  $('preview-canvas').classList.toggle('mobile', button.dataset.view === 'mobile');
}));

$('randomize').addEventListener('click', () => {
  const person = people[Math.floor(Math.random()*people.length)];
  fields.author.value = person.name;
  fields.handle.value = person.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z]/g,'');
  fields.text.value = texts[Math.floor(Math.random()*texts.length)];
  fields.likes.value = '';
  fields.comments.value = '';
  fields.shares.value = '';
  const genderAvatars = avatars[person.gender];
  state.avatar = genderAvatars[Math.floor(Math.random() * genderAvatars.length)];
  update();
});

$('copy-post').addEventListener('click', async () => {
  const button = $('copy-post');
  const status = $('copy-status');
  const card = document.querySelector('.post-card.active-card');
  button.disabled = true;
  status.textContent = 'Przygotowuję…';
  try {
    if (!window.html2canvas || !navigator.clipboard?.write || !window.ClipboardItem) throw new Error('Clipboard image API unavailable');
    const canvas = await window.html2canvas(card, { backgroundColor:null, scale:2, useCORS:true, logging:false });
    const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('PNG export failed')), 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png':blob })]);
    status.textContent = 'Skopiowano obraz';
  } catch (error) {
    status.textContent = 'Nie udało się skopiować';
    console.error(error);
  } finally {
    button.disabled = false;
    window.setTimeout(() => { status.textContent = ''; }, 3200);
  }
});

update();
applyFormats();
