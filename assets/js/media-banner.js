// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function MediaBanner (element) {
  this.element = element;
  this.element.classList.add("media-banner");

  // Styles (added later)
  // this.styleElement = document.createElement("style");
  // this.styleElement.type = "text/css";
  // this.styleElement.appendChild(document.createTextNode(".media-banner { overflow: hidden; position: relative; } .media-banner iframe.video {display: block; height: 100%; width: 200%; position: relative; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0); z-index: 0; } .media-banner iframe.audio { position: absolute; z-index: -1; visibility: hidden; left: 0; top: 0; right: 0; bottom: 0; width: 100%; height: 100%; overflow: hidden; } .media-banner .copyright { position: absolute; bottom: 0.5rem; color: rgba(255,255,255,0.5); font-weight: bold; text-decoration: none; font-size: x-small; z-index: 1; } .media-banner .copyright.video { right: 0.5rem} .media-banner .copyright.audio { left: 0.5rem; } .media-banner .copyright i { margin-right: 0.5em; } .media-banner:after { content: ' '; display: block; position: absolute; left: 0; top: 0; right: 0; bottom: 0; } .media-banner .volume { position: fixed; z-index: 1; right: 3rem; top: 2rem; color: rgba(255,255,255,0.75); cursor: pointer; font-size: xx-large; } .media-banner .volume:before { content: ' '; position: absolute; top: 50%; margin-top: -4px; height: 3px; width: 150%; left: -10%; transform: rotate(20deg); background-color: rgba(255,255,255,0.75); font-size: small; } .media-banner .volume.active:before { content: none; }"));
  // this.element.appendChild(this.styleElement);

  // Add http://fontawesome.io/ icons
  if (!document.querySelector("link[href*='font-awesome']")) {
    document.head.appendChild(this.createLink("stylesheet", "http://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"));
  }

  // responsive
  window.addEventListener("resize", this.cover.bind(this));
}

MediaBanner.prototype.setMix = function (options) {
  if (options.audio) {
    this.setAudio(options.audio);
  }
  if (options.video) {
    options.video.muted = options.video.muted ? true : false;
    this.setVideo(options.video);
    this.element.querySelector(".volume.video").style.display = "none";
    this.element.setAttribute("video-type", options.video.type);
  }
}

MediaBanner.prototype.setVideo = function (options) {
  this.remove("video");
  options.media = "video";
  this.add(options);
  setTimeout(function () {
    this.cover();
  }.bind(this),10);
}

MediaBanner.prototype.setAudio = function (options) {
  this.remove("audio");
  options.media = "audio";
  this.add(options);
}

MediaBanner.prototype.add = function (options) {
  if (options.media == "audio" && options.type == "youtube") {
    options.stopped = (localStorage.getItem("MediaBannerVolume") == "false");
  } else if (options.media == "audio" && options.type == "coub") {
    options.muted = (localStorage.getItem("MediaBannerVolume") == "false");
  }
  this.element.appendChild(this.embed(options));
}

MediaBanner.prototype.remove = function (media) {
  Array.prototype.slice.call(this.element.querySelectorAll("." + media), 0).forEach(function (element) {
    element.remove();
  });
}

MediaBanner.prototype.embed = function (options) {
  var options = options || {};
  var src = "";
  var wrapper = document.createDocumentFragment();

  var iframe = document.createElement("iframe");
  iframe.setAttribute("frameborder", 0);
  iframe.classList.add(options.media);
  iframe.id = 'media-banner-video-' + parseInt(Math.random()*1000000, 10);
  wrapper.appendChild(iframe);

  var copyright = document.createElement("a");
  copyright.classList.add("copyright", options.media);
  copyright.innerHTML = "<i class='fa'></i>";

  if (options.media == "video") {
    copyright.querySelector("i.fa").classList.add("fa-video-camera");
    copyright.title = "Источник видео: ";
  } else if (options.media == "audio") {
    copyright.querySelector("i.fa").classList.add("fa-music");
    copyright.title = "Источник аудио: ";
  }
  copyright.target = "_blank";
  wrapper.appendChild(copyright);

  var sound = document.createElement("a");
  sound.classList.add("volume", options.media);
  sound.title = "Звук вкл/выкл";
  if (!options.muted && !options.stopped) {
    sound.classList.add("active");
  }
  sound.innerHTML = "<i class='fa fa-music'></i>";
  var self = this;
  sound.addEventListener("click", function (event) {
    MediaBanner.prototype.volumeToggle.call(this, sound);
  }.bind(this));
  wrapper.appendChild(sound);

  switch (options.type) {
    case "youtube":
      // console.log("youtube video", self.element, self);
      // Listen to ready and remove placeholder image
      if (options.media == "video") {
        window.onYouTubeIframeAPIReady = function () {
          // console.log("READY");
          var player = new YT.Player(iframe.id, {
            videoId: options.key,
            events: {
              onReady: function (event) {
                if (options.muted) {
                  event.target.mute();
                }
                // console.log("ready", event.target, self.element);
              },
              onStateChange: function (event) {
                // console.log("state", event.data, event.target, self.element);
                if (event.data == YT.PlayerState.PLAYING) {
                  // console.log("playing",  event.target, self.element);
                  self.element.classList.add("loaded");
                } else if (event.data == YT.PlayerState.ENDED) {
                  // console.log("ended", event.target, self.element);
                  self.element.classList.remove("loaded");
                }
              }
            }
          });
          window.youtube = window.youtube || {};
          window.youtube[iframe.id] = player;
        }
      }
      iframe.setAttribute("src", "https://www.youtube.com/embed/" + options.key + "?rel=0&controls=0&showinfo=0&loop=1&enablejsapi=1&autoplay=" + (options.stopped ? "0" : "1") + "&playlist=" + options.key);
      copyright.href = "https://youtu.be/" + options.key;
      copyright.innerHTML += copyright.href;
      copyright.title += copyright.href;
      sound.setAttribute("type", "youtube");
      break;
    case "coub":
      iframe.setAttribute("src", "//coub.com/embed/" + options.key + "?muted=" + (options.muted ? "true" : "false") + "&autostart=" + (options.stopped ? "false" : "true") + "&originalSize=true&hideTopBar=true&startWithHD=true");
      if (options.media == "video") {
        console.log(iframe);
        // iframe.contentWindow.addEventListener('message', function (event, data) {
        //   console.log(event, data);
        // });
      }
      copyright.href = "http://coub.com/view/" + options.key;
      copyright.innerHTML += copyright.href;
      copyright.title += copyright.href;
      var script = document.createElement("script");
      script.setAttribute("async", "");
      script.setAttribute("src", "//c-cdn.coub.com/embed-runner.js");
      // wrapper.appendChild(script);
      sound.setAttribute("type", "coub");
      break;
  }

  return wrapper;
}

MediaBanner.prototype.cover = function () {
  var rect = this.element.getBoundingClientRect(),
      parentWidth = rect.width,
      iframe = this.element.querySelector("iframe.video");
  if (!iframe) {
    return;
  }
  if (parentWidth > rect.height * 1.7778) {
    iframe.style.width = "100.2%";
    iframe.style.height = (rect.width / 1.7778) + 5 + "px";
  } else {
    iframe.style.height = "100.2%";
    iframe.style.width = (rect.height * 1.7778) + 5 + "px";
  }
  return this;
}

MediaBanner.prototype.createLink = function (rel, href) {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  return link;
}

MediaBanner.prototype.volumeToggle = function (element, force) {
  var audio = this.element.querySelector("iframe.audio") || this.element.querySelector("iframe.video"),
    src = audio.getAttribute("src");

  switch (element.getAttribute("type")) {
    case "coub":
      if (force === true) {
        element.classList.add("active");
        if (src.match(/muted=true/g)) {
          audio.setAttribute("src", src.replace("muted=true", "muted=false"));
        }
        localStorage.setItem("MediaBannerVolume", true);
      } else if (force === false) {
        element.classList.remove("active");
        if (!src.match(/muted=true/g)) {
          audio.setAttribute("src", src.replace("muted=false", "muted=true"));
        }
        localStorage.setItem("MediaBannerVolume", false);
      } else {
        element.classList.toggle("active");
        if (src.match(/muted=true/g)) {
          audio.setAttribute("src", src.replace("muted=true", "muted=false"));
          localStorage.setItem("MediaBannerVolume", true);
        } else {
          audio.setAttribute("src", src.replace("muted=false", "muted=true"));
          localStorage.setItem("MediaBannerVolume", false);
        }
      }
      break;
    case "youtube":
      if (force === true) {
        element.classList.add("active");
        if (src.match(/autoplay=0/g)) {
          audio.setAttribute("src", src.replace("autoplay=0", "autoplay=1"));
        }
        localStorage.setItem("MediaBannerVolume", true);
      } else if (force === false) {
        element.classList.remove("active");
        if (!src.match(/autoplay=1/g)) {
          audio.setAttribute("src", src.replace("autoplay=1", "autoplay=0"));
        }
        localStorage.setItem("MediaBannerVolume", false);
      } else {
        element.classList.toggle("active");
        if (src.match(/autoplay=1/g)) {
          audio.setAttribute("src", src.replace("autoplay=1", "autoplay=0"));
          localStorage.setItem("MediaBannerVolume", false);
        } else {
          audio.setAttribute("src", src.replace("autoplay=0", "autoplay=1"));
          localStorage.setItem("MediaBannerVolume", true);
        }
      }
  }
}