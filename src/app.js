document.addEventListener("DOMContentLoaded", function () {
  var url  = document.getElementById("url");
  var go   = document.getElementById("go");
  var stop = document.getElementById("stop");

  var browser = document.getElementsByTagName("iframe")[0];

  // This function is used to switch the Go and Stop button
  // If the browser is loading content, "Go" is disabled and "Stop" is enabled
  // Otherwise, "Go" is enabled and "Stop" is disabled
  function uiLoading(isLoading) {
      go.disabled =  isLoading;
    stop.disabled = !isLoading;
  }

  go.addEventListener("click", function () {
    browser.setAttribute("src", url.value);
  });

  stop.addEventListener("click", function () {
    browser.stop();
  });

  // When the browser starts loading content, we switch the "Go" and "Stop" buttons
  browser.addEventListener('mozbrowserloadstart', function () {
    uiLoading(true);
  });

  // When the browser finishes loading content, we switch back the "Go" and "Stop" buttons
  browser.addEventListener('mozbrowserloadend', function () {
    uiLoading(false);
  });

  // In case of error, we also switch back the "Go" and "Stop" buttons
  browser.addEventListener('mozbrowsererror', function (event) {
    uiLoading(false);
    alert("Loading error: " + event.detail);
  });

  // When a user follows a link, we make sure the new location is displayed in the address bar
  browser.addEventListener('mozbrowserlocationchange', function (event) {
    url.value = event.detail;
  });
});
