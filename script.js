const body = document.body;
const btnPlus = document.getElementById("plus-button");
const btnMinus = document.getElementById("minus-button");
const btnSwitchTheme = document.getElementById("switch-theme-button");
const counterValue = document.getElementById("counter-value");
const jokes = document.getElementById("joke");
const btnGenerateJoke = document.getElementById("generate-joke-button");
const copyButton = document.getElementById("copy-button");
const content = document.querySelector(".content");

/**
 * Implement encrypt and decrypt data localStorage using cryptojs
 * @see https://github.com/brix/crypto-js
 * @see https://www.youtube.com/watch?v=OsTTC41YWaE
 */

// required
const secret = "1qir241MJiW@";

class SecureData {
  encrypt(string) {
    return CryptoJS.AES.encrypt(string, secret).toString();
  }

  decryptedDataToUtf8(encrypted) {
    const bytes = CryptoJS.AES.decrypt(encrypted, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

const secureData = new SecureData();

class Theme {
  static set(themeName) {
    localStorage.setItem("theme", secureData.encrypt(themeName));
    body.className = themeName;
  }

  switchTheme() {
    if (
      secureData.decryptedDataToUtf8(localStorage.getItem("theme")) === "dark"
    ) {
      this.set("light");
      btnSwitchTheme.innerText = "Light Mode";
    } else {
      this.set("dark");
      btnSwitchTheme.innerText = "Dark Mode";
    }
  }

  initialTheme() {
    if (
      secureData.decryptedDataToUtf8(localStorage.getItem("theme")) === "dark"
    ) {
      this.set("dark");
      btnSwitchTheme.innerText = "Dark Mode";
    } else {
      this.set("light");
      btnSwitchTheme.innerText = "Light Mode";
    }
  }
}

const theme = new Theme();
theme.initialTheme();

class Counter {
  static set(value) {
    localStorage.setItem("counter-value", secureData.encrypt(value.toString()));
  }

  plus() {
    const result =
      Number(
        secureData.decryptedDataToUtf8(localStorage.getItem("counter-value"))
      ) + 1;

    counterValue.innerText = result;
    this.set(result);
  }

  minus() {
    const value = Number(
      secureData.decryptedDataToUtf8(localStorage.getItem("counter-value"))
    );
    const result = value - 1;

    if (value <= 0) return;

    counterValue.innerText = result;
    this.set(result);
  }

  resetCounterValue() {
    counterValue.innerText = 0;
    this.set(0);
  }

  initialCounterValue() {
    counterValue.innerText = secureData.decryptedDataToUtf8(
      localStorage.getItem("counter-value")
    );
  }
}

const counter = new Counter();
counter.initialCounterValue();

let tempResult = "";
let elementAdded = false;

class Joke {
  static sendRequest(method, url) {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      xhr.responseType = "json";
      xhr.onload = () => {
        if (xhr.status >= 400) reject(xhr.response);
        resolve(xhr.response);
      };

      xhr.send();
    });

    return promise;
  }

  async generateJoke() {
    try {
      const response = await this.sendRequest(
        "GET",
        "https://candaan-api.vercel.app/api/text/random"
      );

      jokes.innerText = response.data;
      tempResult = response.data;

      if (!elementAdded) {
        const newCopyButton = document.createElement("button");

        newCopyButton.setAttribute("id", "copy-button");
        newCopyButton.innerText = "Copy";
        newCopyButton.addEventListener("click", () => {
          clipboard.copyToClipboard();
        });

        elementAdded = true;
        content.appendChild(newCopyButton);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

const joke = new Joke();

// copy feature
class Clipboard {
  async copyToClipboard() {
    try {
      /**
       * Check if user was generate the joke or not.
       * - if length of the result === 0, then set btnGenerateJoke innerText to custom text
       */
      if (tempResult.length === 0) {
        setTimeout(() => {
          btnGenerateJoke.innerText = "Random Joke";
        }, 1000);

        btnGenerateJoke.innerText = "Belum ada joke";
        return;
      }

      /**
       * Copy to clipboard
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
       */
      if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(jokes.innerText);

        setTimeout(() => {
          btnGenerateJoke.innerText = "Random Joke";
        }, 1000);

        btnGenerateJoke.innerText = "Copied!";
      } else {
        document.execCommand("copy", true, jokes.innerText);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

const clipboard = new Clipboard();
