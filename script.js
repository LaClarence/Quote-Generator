
const quoteGenerator = document.getElementById('quote-generator');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const translateBtn = document.getElementById('translate');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

const sourceLangQuotes = 'en';
let targetLangQuotes = 'en';
let sourceLangText = '';
let targetLangtext = '';
let isTranslated = false;
let quotes = [];

function showLoadingSpinner() {
  loader.hidden = false;
  quoteGenerator.hidden = true;
}

function removeLoadingSpinner() {
  quoteGenerator.hidden = false;
  loader.hidden = true;
}

function showNewQuoteAmongQuotes() {
  showLoadingSpinner();
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  authorText.textContent = !quote.author ? 'Unknow' : quote.author;
  if (quote.text.length > 120) {
    quoteText.classList.add('long-quote')
  } else {
    quoteText.classList.remove('long-quote')
  }
  quoteText.textContent = quote.text;
  removeLoadingSpinner();
}

async function loadQuotesFromAPI() {
  showLoadingSpinner();
  const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';
  try {
    const response = await fetch(apiUrl);
    quotes = await response.json();
  } catch (error) {
    alert("Failed to load quotes from API: " + error);
    quotes = localQuotes;
  }
  //removeLoadingSpinner();
  showNewQuoteAmongQuotes();
}

function initializeLangForTranslateBtn() {
  targetLangQuotes = navigator.language.substring(0, 2);
  translateBtn.hidden = sourceLangQuotes === targetLangQuotes;
}

async function translateQuote() {
  if (isTranslated) {
    quoteText.textContent = sourceLangText;
    isTranslated = false;
  } else {
    if (sourceLangText === quoteText.textContent) {
      quoteText.textContent = targetLangtext;
    } else {
      // Thanks to https://codepen.io/junior-abd-almaged/pen/gQEbRv
      sourceLangText = quoteText.textContent;
      const translateUrl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLangQuotes + "&tl=" + targetLangQuotes + "&dt=t&q=" + encodeURI(sourceLangText);
      try {
        const response = await fetch(translateUrl);
        showLoadingSpinner();
        const translated = await response.json();
        targetLangtext = translated[0].reduce((acc, line) => acc + line[0], '',);
        quoteText.textContent = targetLangtext;

      } catch (error) {
        alert("Failed to translate quote: " + error);
      }
    }
    isTranslated = true;
  }
  removeLoadingSpinner();
}

newQuoteBtn.addEventListener('click', showNewQuoteAmongQuotes);
translateBtn.addEventListener('click', translateQuote);

initializeLangForTranslateBtn();
loadQuotesFromAPI();

