/* Hero console: types a short PowerShell / Microsoft Graph session line by line.
   The finished session is already in the HTML, so without JS nothing is hidden. */
(() => {
  const box = document.querySelector("[data-console]");
  if (!box) return;

  const lines = [...box.querySelectorAll(".ln")];
  const replay = box.querySelector(".con-replay");
  const finalHTML = lines.map((l) => l.innerHTML);
  let run = 0;

  const wait = (ms, id) => new Promise((res, rej) => setTimeout(() => (id === run ? res() : rej()), ms));
  const show = (l) => { l.classList.remove("hide"); l.classList.add("show"); };

  function reset() {
    lines.forEach((l) => { l.classList.remove("show"); l.classList.add("hide"); });
  }

  async function play() {
    const id = ++run;
    replay.setAttribute("aria-disabled", "true");
    reset();
    try {
      await wait(300, id);
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        const pause = +l.dataset.wait || 0;

        if (!l.classList.contains("cmd")) {
          // Output: streams in, with an extra pause where a real command would take time
          await wait(pause || 70, id);
          show(l);
          continue;
        }

        await wait(pause, id);
        if (l.classList.contains("idle")) {
          l.innerHTML = finalHTML[i];
          show(l);
          break;
        }

        // Prompt appears with a caret, then the command is typed and "entered"
        const text = l.dataset.t;
        l.innerHTML = l.querySelector(".ps").outerHTML + " ";
        const node = document.createTextNode("");
        const caret = document.createElement("span");
        caret.className = "caret";
        l.append(node, caret);
        show(l);
        await wait(l.classList.contains("cont") ? 120 : 450, id);
        for (let c = 0; c < text.length; c++) {
          node.data += text[c];
          await wait(24 + Math.random() * 38, id);
        }
        await wait(220, id);
        l.innerHTML = finalHTML[i];
      }
    } catch (e) {
      return; // a newer run took over
    }
    replay.setAttribute("aria-disabled", "false");
  }

  replay.addEventListener("click", () => {
    if (replay.getAttribute("aria-disabled") !== "true") play();
  });

  // Start when the console is on screen and the page has settled
  const start = () => {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { io.disconnect(); play(); }
      }, { threshold: 0.3 });
      io.observe(box);
    } else play();
  };
  if (document.readyState === "complete") setTimeout(start, 300);
  else addEventListener("load", () => setTimeout(start, 300), { once: true });
})();
