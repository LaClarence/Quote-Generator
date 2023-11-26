
const quoteGenerator = document.getElementById('quote-generator');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const translateBtn = document.getElementById('translate');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// There is an alternative option for this project 
// that does not require an API key - https://zenquotes.io/
// Sample Requests
// https://zenquotes.io/api/quotes - Generate a JSON array of 50 random quotes on each request
// https://zenquotes.io/api/today - Generate the quote of the day on each request
// https://zenquotes.io/api/random - Generate a random quote on each request

let quotes = [];

// Show loading
function loading() {
  loader.hidden = false;
  quoteGenerator.hidden = true;
}

// Hide loading
function loaded() {
  quoteGenerator.hidden = false;
  loader.hidden = true;
}

// Show new quote
function newQuote() {
  loading();
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  // console.log(quote);
  authorText.textContent = !quote.author ? 'Unknow' : quote.author;
  if (quote.text.length > 120) {
    quoteText.classList.add('long-quote')
  } else {
    quoteText.classList.remove('long-quote')
  }
  quoteText.textContent = quote.text;
  loaded();
}

// Get Quotes From API
async function getQuotes() {
  loading();
  const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';
  try {
    const response = await fetch(apiUrl);
    quotes = await response.json();
  } catch (error) {
    alert("Failed to load quotes from API: " + error);
    quotes = localQuotes;
  }
  newQuote();
}

// Translate Quote
// Thanks to https://codepen.io/junior-abd-almaged/pen/gQEbRv
async function translateQuote() {
  var sourceText = quoteText.textContent;
  var sourceLang = 'en';
  var targetLang = navigator.language.substring(0, 2);

  const translateUrl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

  try {
    const response = await fetch(translateUrl);
    loading();
    translated = await response.json();
    quoteText.textContent = translated[0][0][0];
  } catch (error) {
    console.log("Failed to translate quote: " + error);
  }
  loaded();
}

// Event Listeners
newQuoteBtn.addEventListener('click', newQuote);
translateBtn.addEventListener('click', translateQuote);

//On load
getQuotes();

