Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = this.length - 1; i >= 0; i--) {
    if(this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
};

let storage = browser.storage.local;
let dataStorage = null;

const getToday = () => {
  const today = new Date();
  return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
};

const getRandom = () => Math.floor(Math.random() * 10);

const sentencesList = {
  fr: [
    "Bon anniversaire",
    "Joyeuse fête",
    "Aujourd'hui est un jour spécial"
  ],
  en: [
    "Happy birthday",
    "Today is a special day"
  ]
};

const getRandomNumber = (max) => (Math.floor(Math.random() * max) + 1) - 1;

const getSentence = () => {
  const language = dataStorage.language || 'en';
  const nbr = getRandomNumber(sentencesList[language].length);

  return sentencesList[language][nbr];
};

const hexToRgb = function (h) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hex = h.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const dynamicColor = function (color) {
  const rgb = hexToRgb(color);

  if (!rgb) {
    return '#000000';
  }

  const o = Math.round(
    (
      (parseInt(rgb.r, 10) * 299)
      + (parseInt(rgb.g, 10) * 587)
      + (parseInt(rgb.b, 10) * 114)
    )
    / 1000
  );

  return 125 < o ? '#000000' : '#FFFFFF';
};

const getColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

const changeText = () => {
  const p = document.querySelectorAll('p');
  const l = p.length;
  let current = null;

  try {
    current = p[getRandomNumber(l)];
  } catch (e) {
    return;
  }

  const bgColor = getColor();
  const textColor = dynamicColor(bgColor);
  const borderColor = getColor();

  const html = `<span style='color: ${ textColor }; font-weight: bold; padding: 5px; background: ${ bgColor }; border: 1px solid ${ borderColor };'>
                    ${ getSentence() } ${ dataStorage.name }
                </span> <br />`;

  current.innerHTML = html + current.innerHTML;
};

const addYoutube = () => {
  const iframe = '<iframe id="happy-birthday-youtube" width="560" height="315" src="https://www.youtube.com/embed/ykHAwUhjjGE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display: block; margin: auto;"></iframe>;';
  document.body.innerHTML = '<br><br>' + iframe + '<br><br>' + document.body.innerHTML;
};

const run = () => {
  console.log("run");

  if (!dataStorage) {
    return;
  }

  const today = getToday();

  if (today !== dataStorage.date) {
    return;
  }

  const video = document.querySelector('#happy-birthday-youtube');

  if (video && video.length) {
    video.remove();
  }

  const random = getRandom();

  if (7 === random) {
    addYoutube();
  } else if (0 === random % 3) {
    changeText();
  }
};

const update = (result) => {
  if (result) {
    dataStorage = result.data;
    run();
  }
};

const storeChanged = () => {
  storage.get('data', update);
  console.log("Storage update");
};

let onChanged = browser.storage.onChanged;

if (!onChanged.hasListener(storeChanged)) {
  onChanged.addListener(storeChanged);
}

storage.get('data', update);
