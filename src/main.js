const exposed = {};

if (location.search) {
  var a = document.createElement("a");
  a.href = location.href;
  a.search = "";
  history.replaceState(null, null, a.href);
}

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

function tweet_(url) {
  open(
    "https://twitter.com/intent/tweet?url=" + encodeURIComponent(url),
    "_blank"
  );
}
function tweet(anchor) {
  tweet_(anchor.getAttribute("href"));
}
expose("tweet", tweet);

function share(anchor) {
  var url = anchor.getAttribute("href");
  event.preventDefault();
  if (navigator.share) {
    navigator.share({
      url: url,
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    message("Article URL copied to clipboard.");
  } else {
    tweet_(url);
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

if (window.ResizeObserver && document.querySelector("header nav #nav")) {
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
      document.querySelector("#comments,footer").getBoundingClientRect().top;
    winHeight = window.innerHeight;
    scroll();
  }).observe(document.body);
}

// There is a race condition here if an image loads faster than this JS file. But
// - that is unlikely
// - it only means potentially more costly layouts for that image.
// - And so it isn't worth the querySelectorAll it would cost to synchronously check
//   load state.
document.body.addEventListener(
  "load",
  (e) => {
    if (e.target.tagName != "IMG") {
      return;
    }
    // Ensure the browser doesn't try to draw the placeholder when the real image is present.
    e.target.style.backgroundImage = "none";
  },
  /* capture */ "true"
);