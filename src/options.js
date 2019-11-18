function saveOptions(e) {
  e.preventDefault();

  const nameField = document.querySelector("#name");
  const dateField = document.querySelector("#date");
  const languageField = document.querySelector("#language");

  nameField.style.borderColor = 'inherit';
  dateField.style.borderColor = 'inherit';

  const name = nameField.value;
  const date = dateField.value;
  const language = languageField.value;

  let valid = true;

  if (!name) {
    valid = false;
    nameField.style.borderColor = 'red';
  }

  if (!date || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) {
    valid = false;
    dateField.style.borderColor = 'red';
  }

  if (!valid) {
    return;
  }

  browser.storage.local.set({
    data: {
      name: name,
      date: date,
      language: language,
    }
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#name").value = result.data.name || "";
    document.querySelector("#date").value = result.data.date || "";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  const data = browser.storage.local.get("data");
  data.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#birthday-form").addEventListener("submit", saveOptions);
