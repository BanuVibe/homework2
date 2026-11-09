const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const form = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

let data = null;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  data = null;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked
  };

  const items = services
    .filter(function (service) {
      return selected[service.id] === true;
    })
    .map(function (service) {
      const { title, price } = service;
      return { title: title.trim(), price: price };
    });

  const total = items.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);

  return {
    count: items.length,
    total: total,
    items: items
  };
}

function handleShowProgram() {
  if (data === null) {
    return;
  }
  program.innerHTML = data.event.meeting;
  program.hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked
  );

  if (report.count === 0) {
    choiceError.textContent = 'Выберите хотя бы одну услугу.';
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
    return;
  }

  const titles = report.items.map(function (item) {
    return item.title;
  });

  result.innerHTML =
    'Выбрано услуг: ' + report.count +
    '<br>Итого: ' + report.total + ' руб.' +
    '<br>' + titles.join('<br>');

  const jsonString = JSON.stringify(report);
  JSON.parse(jsonString);
  reportJson.textContent = jsonString;

  choiceError.hidden = true;
  result.hidden = false;
  reportJson.hidden = false;
}

if (data === null) {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
  form.hidden = true;
} else {
  form.hidden = false;
  form.addEventListener('submit', handleSubmit);
}

showProgramButton.addEventListener('click', handleShowProgram);
