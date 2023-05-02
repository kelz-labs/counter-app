const body = document.body;
const btnPlus = document.getElementById("plus-button");
const btnMinus = document.getElementById("minus-button");
const btnSwitchTheme = document.getElementById("switch-theme-button");
const counterValue = document.getElementById("counter-value");
const joke = document.getElementById("joke");
const btnGenerateJoke = document.getElementById("generate-joke-button");
const copyButton = document.getElementById("copy-button");

function setTheme(themeName) {
  localStorage.setItem("theme", themeName);
  body.className = themeName;
}

function setCounterValue(value) {
  localStorage.setItem("counter-value", value.toString());
}

function plus() {
  // Convert the value from localStorage to number first, because datatype of HTML text are string
  const result = Number(localStorage.getItem("counter-value")) + 1;

  counterValue.innerText = result;
  setCounterValue(result);
}

function minus() {
  const value = Number(localStorage.getItem("counter-value"));
  const result = value - 1;

  if (value <= 0) return;

  counterValue.innerText = result;
  setCounterValue(result);
}

function resetCounterValue() {
  counterValue.innerText = 0;
  setCounterValue(0);
}

function switchTheme() {
  if (localStorage.getItem("theme") === "dark") {
    setTheme("light");
    btnSwitchTheme.innerText = "Light Mode";
  } else {
    setTheme("dark");
    btnSwitchTheme.innerText = "Dark Mode";
  }
}

/*
Using fetch API
async function generateJoke() {
  const response = await fetch(
    "https://candaan-api.vercel.app/api/text/random",
    { method: "GET" }
  );
  const result = await response.json();

  jokes.innerText = result.data;
}
*/

// XML HTTP Request
function sendRequest(method, url) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    // set response type to json
    xhr.responseType = "json";

    xhr.onload = () => {
      if (xhr.status >= 400) reject(xhr.response);
      resolve(xhr.response);
    };

    xhr.send();
  });

  return promise;
}

let tempResult = "";

async function generateJoke() {
  try {
    const response = await sendRequest(
      "GET",
      "https://candaan-api.vercel.app/api/text/random"
    );

    joke.innerText = response.data;
    tempResult = response.data;
  } catch (err) {
    console.error(err);
  }
}

// Copy feature
async function copyToClipboard() {
  try {
    if (tempResult.length === 0) {
      setTimeout(() => {
        btnGenerateJoke.innerText = "Random Joke";
      }, 1000);

      btnGenerateJoke.innerText = "Belum ada joke!";
      return;
    }

    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(joke.innerText);

      setTimeout(() => {
        btnGenerateJoke.innerText = "Random Joke";
      }, 1000);

      btnGenerateJoke.innerText = "Copied!";
    } else {
      document.execCommand("copy", true, joke.innerText);
    }
  } catch (err) {
    console.error(err);
  }
}

// Run the functions on first load
function initialTheme() {
  if (localStorage.getItem("theme") === "dark") {
    setTheme("dark");
    btnSwitchTheme.innerText = "Dark Mode";
  } else {
    setTheme("light");
    btnSwitchTheme.innerText = "Light Mode";
  }
}

function initialCounterValue() {
  counterValue.innerText = localStorage.getItem("counter-value");
}

initialCounterValue();
initialTheme();
