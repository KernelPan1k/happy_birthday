let storage = browser.storage.local;
let dataStorage = null;

const sentencesList = {
  fr: [
    "Bon anniversaire",
    "Joyeuse fête",
    "Aujourd'hui est un jour spécial"
  ],
  en: [
    "Bon anniversaire",
    "Joyeuse fête",
    "Aujourd'hui est un jour spécial"
  ]
};

const getRandomNumber = (max) => (Math.floor(Math.random() * max) + 1) -1;

const getSentence = () => {
  const language = dataStorage.language || 'en';
  const nbr = getRandomNumber(sentencesList[language].length);

  return sentencesList[language][nbr];
};

const changeText = () => {
  const p = document.querySelectorAll('p');
  const l = p.length;
  let current = null;

  try {
    current = p[getRandomNumber(l)];
  } catch (e) {
    return;
  }

  const html = `<span style='color: red; font-weight: bold; padding: 5px; background: #ffea00; border: 1px solid black;'>
                    ${getSentence()} ${dataStorage.name}
                </span> <br />`;

  current.innerHTML = html + current.innerHTML;
};

const addYoutube = () => {
  const iframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/ykHAwUhjjGE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display: block; margin: auto;"></iframe>;';
  document.body.innerHTML = '<br><br>' + iframe + '<br><br>' + document.body.innerHTML;
};

const run = () => {
  console.log("run");

  if (!dataStorage) {
    return;
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
