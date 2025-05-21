
const generateForm = document.getElementById('generateForm');
const topicInput = document.getElementById('topic');
const styleSelect = document.getElementById('style');
const generatedTextContainer = document.getElementById('generatedTextContainer');
const generatedText = document.getElementById('generatedText');
const translationResult = document.getElementById('translationResult');
const textsList = document.getElementById('textsList');
const difficultWordsList = document.getElementById('difficultWordsList');

const modal = document.getElementById('modal');
const modalWord = document.getElementById('modalWord');
const modalContent = document.getElementById('modalContent');
const requestExamples = document.getElementById('requestExamples');
const markDifficult = document.getElementById('markDifficult');
const closeModal = document.getElementById('closeModal');
const speakWord = document.getElementById('speakWord');

const difficultWordModal = document.getElementById('difficultWordModal');
const difficultModalWord = document.getElementById('difficultModalWord');
const difficultModalContent = document.getElementById('difficultModalContent');
const closeDifficultModal = document.getElementById('closeDifficultModal');
const speakDifficultWord = document.getElementById('speakDifficultWord');

// Controles de voz aprimorados
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const timeDisplay = document.getElementById('timeDisplay');

// Variáveis para controle de áudio
let currentUtterance = null;
let speechState = 'stopped'; // 'playing', 'paused', 'stopped'
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;




// Obter a posição aproximada da palavra atual
function getCurrentWordPosition() {
  if (!currentUtterance || speechState === 'stopped') return 0;
  
  const text = currentUtterance.text;
  const totalLength = text.length;
  const duration = getTotalDuration(text);
  
  // Calcular posição aproximada com base no tempo decorrido
  const position = Math.floor((elapsedTime / duration) * totalLength);
  return position;
}

// Estimar duração total do texto (baseado em média de caracteres por segundo)
function getTotalDuration(text) {
  // Média de caracteres por segundo (ajustado pela taxa)
  const charsPerSecond = 15 * 1;
  return (text.length / charsPerSecond) * 1000;
}

// Timer para atualizar a barra de progresso
function startTimer() {
  stopTimer();
  startTime = Date.now() - elapsedTime;
  
  timerInterval = setInterval(() => {
    if (speechState === 'playing') {
      elapsedTime = Date.now() - startTime;
      updateProgressBar();
    }
  }, 100);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  elapsedTime = 0;
  updateProgressBar();
}

// Atualizar barra de progresso e exibição de tempo
function updateProgressBar() {
  if (!currentUtterance || !currentUtterance.text) return;
  
  const text = currentUtterance.text;
  const duration = getTotalDuration(text);
  
  // Calcular porcentagem de progresso
  const progress = Math.min((elapsedTime / duration) * 100, 100);
  progressFill.style.width = `${progress}%`;
  
  // Atualizar tempo exibido
  const seconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timeDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Função principal para tocar o texto
function speakText(text, startPosition = 0) {
  if (!text) {
    alert('Nenhum texto em inglês disponível para falar.');
    return;
  }

  // Cancelar qualquer fala anterior
  if (speechState !== 'paused') {
    speechSynthesis.cancel();
  }

  // Se o texto já está sendo falado e a função é chamada novamente, alternar entre play/pause
  if (speechState === 'playing') {
    pauseSpeech();
    return;
  } else if (speechState === 'paused') {
    resumeSpeech();
    return;
  }

  // Criar nova instância de fala
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'en-US';
  currentUtterance.rate = parseFloat(1);
  

  
  // Eventos para controlar o estado
  currentUtterance.onstart = () => {
    speechState = 'playing';
    playPauseBtn.innerHTML = '<span class="controlIcon">⏸️</span>';
    startTimer();
  };

  currentUtterance.onend = () => {
    speechState = 'stopped';
    playPauseBtn.innerHTML = '<span class="controlIcon">▶️</span>';
    resetTimer();
  };

  currentUtterance.onpause = () => {
    speechState = 'paused';
    playPauseBtn.innerHTML = '<span class="controlIcon">▶️</span>';
    stopTimer();
  };

  currentUtterance.onresume = () => {
    speechState = 'playing';
    playPauseBtn.innerHTML = '<span class="controlIcon">⏸️</span>';
    startTimer();
  };

  // Se tiver uma posição inicial específica, tentar avançar para ela
  if (startPosition > 0) {
    // Estimar o tempo decorrido com base na posição
    const duration = getTotalDuration(text);
    elapsedTime = (startPosition / text.length) * duration;
    startTime = Date.now() - elapsedTime;
    
    // Não é possível pular para uma posição específica facilmente,
    // então usamos uma abordagem aproximada baseada em caracteres
    const textToRead = text.substring(Math.max(0, startPosition));
    currentUtterance.text = textToRead;
  }

  // Iniciar a fala
  speechSynthesis.speak(currentUtterance);
  speechState = 'playing';
  playPauseBtn.innerHTML = '<span class="controlIcon">⏸️</span>';
}

function pauseSpeech() {
  if (speechState === 'playing' && speechSynthesis.speaking) {
    speechSynthesis.pause();
    speechState = 'paused';
    playPauseBtn.innerHTML = '<span class="controlIcon">▶️</span>';
    stopTimer();
  }
}

function resumeSpeech() {
  if (speechState === 'paused' && speechSynthesis.paused) {
    speechSynthesis.resume();
    speechState = 'playing';
    playPauseBtn.innerHTML = '<span class="controlIcon">⏸️</span>';
    startTimer();
  }
}

function stopSpeech() {
  speechSynthesis.cancel();
  speechState = 'stopped';
  playPauseBtn.innerHTML = '<span class="controlIcon">▶️</span>';
  currentUtterance = null;
  resetTimer();
}

// Eventos dos botões
playPauseBtn.addEventListener('click', () => {
  const englishText = document.getElementById('englishText')?.textContent || '';
  
  if (speechState === 'stopped') {
    speakText(englishText);
  } else if (speechState === 'playing') {
    pauseSpeech();
  } else if (speechState === 'paused') {
    resumeSpeech();
  }
});

stopBtn.addEventListener('click', stopSpeech);

// Clique na barra de progresso para mudar a posição
progressBar.addEventListener('click', (e) => {
  if (!currentUtterance || !currentUtterance.text) return;
  
  const rect = progressBar.getBoundingClientRect();
  const clickPosition = (e.clientX - rect.left) / rect.width;
  
  const text = document.getElementById('englishText')?.textContent || '';
  const newPosition = Math.floor(clickPosition * text.length);
  
  // Parar e reiniciar a partir da nova posição
  stopSpeech();
  speakText(text, newPosition);
});

// Text-to-Speech para modal words (simplificado)
function speakWordOnly(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = parseFloat(1);
  
 
  
  speechSynthesis.speak(utterance);
}

// Speak the word in the translation modal
speakWord.addEventListener('click', () => {
  const word = modalWord.textContent;
  if (word) {
    speakWordOnly(word);
  }
});

// Speak the word in the difficult word modal
speakDifficultWord.addEventListener('click', () => {
  const word = difficultModalWord.textContent;
  if (word) {
    speakWordOnly(word);
  }
});

generateForm.addEventListener('submit', async e => {
  e.preventDefault();
  const topic = topicInput.value.trim();
  const style = styleSelect.value;

  if (!topic) {
    alert('Informe o tema do texto.');
    return;
  }

  // Reset speech synthesis state
  stopSpeech();

  generatedTextContainer.style.display = 'block';
  generatedText.textContent = 'Gerando texto...';
  translationResult.innerHTML = '';

  try {
    const prompt = `Escreva um texto em inglês sobre o tema "${topic}" no estilo "${style}".`;
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama2", prompt, stream: false })
    });

    const data = await res.json();
    const englishText = (data.response || '').trim();
    generatedText.textContent = englishText;

    const translationRes = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: englishText, source: 'en', target: 'pt' })
    });

    const translationData = await translationRes.json();
    const translated = translationData.translatedText;

    const words = englishText.split(/\s+/).map(word => {
      const clean = word.replace(/[.,!?;:"'()]/g, '');
      return `<span class="highlight" data-word="${clean}">${word}</span>`;
    }).join(' ');

    translationResult.innerHTML = `
      <h3>Inglês:</h3>
      <p id="englishText">${words}</p>
      <h3>Português:</h3>
      <p>${translated}</p>
    `;

    await fetch('http://localhost:3001/texts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ topic, style, text: englishText, translation: translated })
    });

    loadSavedTexts();
  } catch {
    generatedText.textContent = 'Erro ao gerar ou traduzir texto.';
  }
});

async function loadSavedTexts() {
  try {
    const res = await fetch('http://localhost:3001/texts');
    const data = await res.json();

    textsList.innerHTML = '';
    if (!data.length) {
      textsList.textContent = 'Nenhum texto salvo.';
      return;
    }

    data.forEach(item => {
      const div = document.createElement('div');
      div.textContent = `[${item.style}] ${item.topic}: ${item.text.slice(0, 50)}...`;
      div.title = 'Clique para exibir texto';

      div.addEventListener('click', () => {
        // Reset speech synthesis state when loading a new text
        stopSpeech();

        generatedTextContainer.style.display = 'block';
        const highlighted = item.text.split(/\s+/).map(word => {
          const clean = word.replace(/[.,!?;:"'()]/g, '');
          return `<span class="highlight" data-word="${clean}">${word}</span>`;
        }).join(' ');

        translationResult.innerHTML = `
          <h3>Inglês:</h3>
          <p id="englishText">${highlighted}</p>
          <h3>Português:</h3>
          <p>${item.translation}</p>
        `;
      });

      textsList.appendChild(div);
    });
  } catch {
    textsList.textContent = 'Erro ao carregar textos.';
  }
}

async function loadDifficultWords() {
  try {
    const res = await fetch('http://localhost:3001/words');
    const data = await res.json();

    difficultWordsList.innerHTML = '';
    if (!data.length) {
      difficultWordsList.textContent = 'Nenhuma palavra difícil salva.';
      return;
    }

    data.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item.word;
      div.addEventListener('click', () => {
        difficultModalWord.textContent = item.word;
        difficultModalContent.innerHTML = `
          <p><strong>Tradução:</strong> ${item.translation || 'Não disponível'}</p>
          <p><strong>Exemplos:</strong></p>
          <pre style="white-space:pre-wrap;">${item.examples || 'Nenhum exemplo disponível'}</pre>
        `;
        difficultWordModal.style.display = 'block';
      });
      difficultWordsList.appendChild(div);
    });
  } catch {
    difficultWordsList.textContent = 'Erro ao carregar palavras difíceis.';
  }
}

translationResult.addEventListener('click', async e => {
  if (e.target.dataset.word) {
    const word = e.target.dataset.word;
    modalWord.textContent = word;
    modalContent.innerHTML = '<p>Carregando tradução...</p>';
    modal.style.display = 'block';

    try {
      const translationRes = await fetch('http://localhost:5000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: word, source: 'en', target: 'pt' })
      });
      const translationData = await translationRes.json();
      modalContent.innerHTML = `<p><strong>Tradução:</strong> ${translationData.translatedText}</p>`;
      modal.dataset.translation = translationData.translatedText;
      modal.dataset.examples = '';
    } catch {
      modalContent.innerHTML = '<p>Erro ao obter tradução.</p>';
    }
  }
});

requestExamples.addEventListener('click', async () => {
  const word = modalWord.textContent;
  modalContent.innerHTML += '<p>Carregando exemplos...</p>';

  try {
    const prompt = `Retorne dois exemplos de uso simples da palavra "${word}" em inglês.`;
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama2", prompt, stream: false })
    });
    const data = await res.json();
    const examples = data.response || 'Nenhum exemplo gerado.';
    modalContent.innerHTML = `
      <p><strong>Tradução:</strong> ${modal.dataset.translation}</p>
      <p><strong>Exemplos:</strong></p>
      <pre style="white-space:pre-wrap;">${examples}</pre>
    `;
    modal.dataset.examples = examples;
  } catch {
    modalContent.innerHTML += '<p>Erro ao gerar exemplos.</p>';
  }
});

markDifficult.addEventListener('click', async () => {
  const word = modalWord.textContent;
  const translation = modal.dataset.translation || '';
  const examples = modal.dataset.examples || '';

  try {
    await fetch('http://localhost:3001/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, translation, examples })
    });
    alert('Palavra marcada como difícil!');
    modal.style.display = 'none';
    loadDifficultWords();
  } catch {
    alert('Erro ao marcar como difícil.');
  }
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

closeDifficultModal.addEventListener('click', () => {
  difficultWordModal.style.display = 'none';
});

// Prevenir bug de congelamento do speechSynthesis
window.addEventListener('beforeunload', () => {
  speechSynthesis.cancel();
});

loadSavedTexts();
loadDifficultWords();
