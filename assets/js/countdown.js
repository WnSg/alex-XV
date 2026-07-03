(function () {
  "use strict";

  // XV de Alejandra: viernes 31 de julio de 2026, 7:00 p.m. UTC-06:00.
  // Se usa UTC numérico para evitar fallos de parseo de fechas en Safari/iPhone/Android.
  var EVENT_UTC_MS = Date.UTC(2026, 7, 1, 1, 0, 0);

  var timerId = null;
  var retryId = null;
  var SECOND = 1000;
  var MINUTE = 60 * SECOND;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;

  function byId(id) {
    return document.getElementById(id);
  }

  function getCountdownNodes() {
    return {
      days: byId("dias") || byId("days"),
      hours: byId("horas") || byId("hours"),
      minutes: byId("minutos") || byId("minutes"),
      seconds: byId("segundos") || byId("seconds"),
      container: byId("contador-contenedor") || document.querySelector(".countdown")
    };
  }

  function pad(value) {
    var n = Math.max(0, Math.floor(Number(value) || 0));
    return n < 10 ? "0" + n : String(n);
  }

  function write(node, value) {
    if (!node) return;
    var text = pad(value);
    if (node.textContent !== text) node.textContent = text;
  }

  function updateCountdown() {
    var nodes = getCountdownNodes();

    if (!nodes.days || !nodes.hours || !nodes.minutes || !nodes.seconds) {
      return false;
    }

    var remaining = EVENT_UTC_MS - Date.now();

    if (!isFinite(remaining) || remaining <= 0) {
      write(nodes.days, 0);
      write(nodes.hours, 0);
      write(nodes.minutes, 0);
      write(nodes.seconds, 0);

      if (nodes.container && !nodes.container.getAttribute("data-finished")) {
        nodes.container.setAttribute("data-finished", "true");
        nodes.container.innerHTML = "<div class='countdown-finished'>¡Llegó el día esperado!</div>";
      }

      stopCountdown();
      return true;
    }

    var days = Math.floor(remaining / DAY);
    var hours = Math.floor((remaining % DAY) / HOUR);
    var minutes = Math.floor((remaining % HOUR) / MINUTE);
    var seconds = Math.floor((remaining % MINUTE) / SECOND);

    write(nodes.days, days);
    write(nodes.hours, hours);
    write(nodes.minutes, minutes);
    write(nodes.seconds, seconds);

    document.documentElement.setAttribute("data-countdown-active", "true");
    return true;
  }

  function stopCountdown() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
    if (retryId) {
      window.clearTimeout(retryId);
      retryId = null;
    }
  }

  function startCountdown() {
    stopCountdown();

    if (!updateCountdown()) {
      retryId = window.setTimeout(startCountdown, 180);
      return;
    }

    timerId = window.setInterval(updateCountdown, 1000);

    // Refuerzos de arranque para WebViews y teléfonos lentos.
    window.setTimeout(updateCountdown, 80);
    window.setTimeout(updateCountdown, 350);
    window.setTimeout(updateCountdown, 1000);
  }

  function boot() {
    try {
      startCountdown();
    } catch (error) {
      retryId = window.setTimeout(boot, 250);
    }
  }

  window.alexXVStartCountdown = boot;
  window.alexXVUpdateCountdown = updateCountdown;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, false);
  } else {
    boot();
  }

  window.addEventListener("load", boot, false);
  window.addEventListener("pageshow", boot, false);
  window.addEventListener("focus", boot, false);
  window.addEventListener("orientationchange", function () {
    window.setTimeout(boot, 250);
  }, false);

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) boot();
  }, false);

  try {
    document.addEventListener("touchstart", updateCountdown, { passive: true });
  } catch (error) {
    document.addEventListener("touchstart", updateCountdown, false);
  }
  document.addEventListener("click", updateCountdown, false);
})();
