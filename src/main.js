const exposed = {};

// Google Analytics 4 (gtag.js is loaded from base.njk).
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", document.documentElement.getAttribute("ga-id"));

// Seasonal leaf border, picked from the visitor's date rather than the build
// date. Seasons start on the (approximate) equinoxes and solstices.
(function () {
  var now = new Date();
  var y = now.getFullYear();
  var leap = y % 4 === 0;
  var season = "winter";
  [
    ["spring", 2, leap ? 19 : 20],
    ["summer", 5, leap ? 20 : 21],
    ["autumn", 8, leap ? 22 : 23],
    ["winter", 11, leap ? 20 : 21],
  ].forEach(function (s) {
    if (new Date(y, s[1], s[2]) <= now) season = s[0];
  });
  document.body.classList.add(season);
})();

function expose(name, fn) {
  exposed[name] = fn;
}

addEventListener("click", (e) => {
  const handler = e.target.closest("[on-click]");
  if (!handler) {
    return;
  }
  e.preventDefault();
  const name = handler.getAttribute("on-click");
  const fn = exposed[name];
  if (!fn) {
    throw new Error("Unknown handler" + name);
  }
  fn(handler);
});

function share(anchor) {
  var url = anchor.getAttribute("href");
  if (navigator.share) {
    navigator.share({
      url: url,
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    message("Article URL copied to clipboard.");
  } else {
    open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(url), "_blank");
  }
}
expose("share", share);

function message(msg) {
  var dialog = document.getElementById("message");
  dialog.textContent = msg;
  dialog.setAttribute("open", "");
  setTimeout(function () {
    dialog.removeAttribute("open");
  }, 3000);
}

if (window.ResizeObserver && document.getElementById("reading-progress")) {
  var progress = document.getElementById("reading-progress");

  var timeOfLastScroll = 0;
  var requestedAniFrame = false;
  function scroll() {
    if (!requestedAniFrame) {
      requestAnimationFrame(updateProgress);
      requestedAniFrame = true;
    }
    timeOfLastScroll = Date.now();
  }
  addEventListener("scroll", scroll);

  var winHeight = 1000;
  var bottom = 10000;
  function updateProgress() {
    requestedAniFrame = false;
    var percent = Math.min(
      (document.scrollingElement.scrollTop / (bottom - winHeight)) * 100,
      100
    );
    progress.style.transform = `translate(-${100 - percent}vw, 0)`;
    if (Date.now() - timeOfLastScroll < 3000) {
      requestAnimationFrame(updateProgress);
      requestedAniFrame = true;
    }
  }

  new ResizeObserver(() => {
    bottom =
      document.scrollingElement.scrollTop +
      document.querySelector("footer").getBoundingClientRect().top;
    winHeight = window.innerHeight;
    scroll();
  }).observe(document.body);
}

function removeBlurredImage(img) {
  // Ensure the browser doesn't try to draw the placeholder when the real image is present.
  img.style.backgroundImage = "none";
}

document.body.addEventListener(
  "load",
  (e) => {
    if (e.target.tagName != "IMG") {
      return;
    }
    // Ensure the browser doesn't try to draw the placeholder when the real image is present.
    removeBlurredImage(e.target);
  },
  /* capture */ "true"
);
for (let img of document.querySelectorAll("img")) {
  if (img.complete) {
    removeBlurredImage(img);
  }
}