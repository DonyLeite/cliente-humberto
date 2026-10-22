/* ==========================================================================
   Clínica ESTOU BEM — landing page
   --------------------------------------------------------------------------
   • Fuso: tudo em America/Sao_Paulo (BRT / UTC-3 fixo desde 2019)
   • Agendamento: deep link do Google Calendar (eventedit)
   • Chat: assistente virtual local (sem backend) — fácil de trocar por IA
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.ESTOU_BEM || {};
  var CLINIC = CFG.clinic || {};
  var BOOKING = CFG.booking || {};
  var HOURS = CFG.hours || {};
  var SPECIALTIES = CFG.specialties || [];
  var PROOF = CFG.socialProof || {};

  /* ------------------------------------------------------------------ utils */
  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };
  var TZ = "America/Sao_Paulo";
  var WEEKDAY_LONG = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  var WEEKDAY_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  var WD_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function toMin(hhmm) {
    var p = String(hhmm).split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1] || 0, 10);
  }
  function fmtTime(hhmm) {
    var p = String(hhmm).split(":");
    return pad(p[0]) + "h" + pad(p[1] || 0);
  }

  /* ---------------------------------------------------------- data em BRT */
  function brtNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      weekday: "short",
    }).formatToParts(new Date());
    var get = function (t) {
      var f = parts.filter(function (p) {
        return p.type === t;
      })[0];
      return f ? f.value : "";
    };
    var hh = parseInt(get("hour"), 10) % 24;
    var mm = parseInt(get("minute"), 10);
    return {
      y: parseInt(get("year"), 10),
      m: parseInt(get("month"), 10),
      d: parseInt(get("day"), 10),
      hh: hh,
      mm: mm,
      minutes: hh * 60 + mm,
      wd: WD_MAP[get("weekday")] === undefined ? 0 : WD_MAP[get("weekday")],
    };
  }

  /* BRT é UTC-3 fixo: converte "hora de parede" em BRT para instante UTC */
  function brtWallToUtc(y, m, d, minutes) {
    var hh = Math.floor(minutes / 60);
    var mm = minutes % 60;
    return new Date(Date.UTC(y, m - 1, d, hh + 3, mm));
  }
  function weekdayOf(y, m, d) {
    return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  }
  function gcalStamp(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }
  function formatSlot(slot) {
    return (
      WEEKDAY_SHORT[slot.wd] +
      ", " +
      pad(slot.d) +
      "/" +
      pad(slot.m) +
      " às " +
      fmtTime(
        pad(Math.floor(slot.minutes / 60)) + ":" + pad(slot.minutes % 60)
      )
    );
  }

  /* ------------------------------------------------------------- horários */
  function periodsFor(wd) {
    return HOURS[wd] || [];
  }

  function statusNow() {
    var cur = brtNow();
    var periods = periodsFor(cur.wd);
    for (var i = 0; i < periods.length; i++) {
      if (cur.minutes >= toMin(periods[i][0]) && cur.minutes < toMin(periods[i][1])) {
        return {
          open: true,
          text:
            "Aberto agora · até " +
            fmtTime(periods[i][1]) +
            " (BRT)",
          dot: "bg-emerald-400",
        };
      }
    }
    var next = nextOpening(cur);
    return {
      open: false,
      text: "Fechado agora · " + next,
      dot: "bg-amber-400",
    };
  }

  function nextOpening(cur) {
    var periods = periodsFor(cur.wd);
    for (var i = 0; i < periods.length; i++) {
      if (cur.minutes < toMin(periods[i][0])) {
        return "abre hoje às " + fmtTime(periods[i][0]) + " (BRT)";
      }
    }
    for (var k = 1; k <= 7; k++) {
      var nd = new Date(Date.UTC(cur.y, cur.m - 1, cur.d + k));
      var wd = nd.getUTCDay();
      var p2 = periodsFor(wd);
      if (p2.length) {
        var label =
          k === 1 ? "amanhã" : WEEKDAY_LONG[wd];
        return "abre " + label + " às " + fmtTime(p2[0][0]) + " (BRT)";
      }
    }
    return "consulte a recepção";
  }

  function nextSlots(count, specialty) {
    var out = [];
    var cur = brtNow();
    var nowMs = Date.now();
    var minMs = (BOOKING.noticeHours || 4) * 3600000;
    var duration = BOOKING.durationMinutes || 40;
    var step = BOOKING.slotStepMinutes || 40;
    var maxDays = BOOKING.maxDaysAhead || 21;
    var y = cur.y;
    var m = cur.m;
    var d = cur.d;

    for (var i = 0; i < maxDays && out.length < count; i++) {
      var wd = weekdayOf(y, m, d);
      var periods = periodsFor(wd);
      for (var p = 0; p < periods.length && out.length < count; p++) {
        var start = toMin(periods[p][0]);
        var end = toMin(periods[p][1]);
        for (var t = start; t + duration <= end; t += step) {
          var utc = brtWallToUtc(y, m, d, t);
          if (utc.getTime() < nowMs + minMs) continue;
          out.push({
            y: y,
            m: m,
            d: d,
            wd: wd,
            minutes: t,
            utc: utc,
            utcEnd: new Date(utc.getTime() + duration * 60000),
            label: formatSlot({ y: y, m: m, d: d, wd: wd, minutes: t }),
            specialty: specialty || "Consulta",
          });
        }
      }
      var nd = new Date(Date.UTC(y, m - 1, d + 1));
      y = nd.getUTCFullYear();
      m = nd.getUTCMonth() + 1;
      d = nd.getUTCDate();
    }
    return out;
  }

  /* -------------------------------------------------------------- whatsapp */
  function waLink(message) {
    var phone = String(CLINIC.phoneE164 || "").replace(/\D/g, "");
    var msg = message || (CFG.whatsapp && CFG.whatsapp.defaultMessage) || "Olá!";
    return "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg);
  }

  function applyConfig() {
    $$("[data-phone]").forEach(function (el) {
      el.textContent = CLINIC.phoneLabel || "";
      el.setAttribute("href", "tel:+" + String(CLINIC.phoneE164 || "").replace(/\D/g, ""));
    });
    $$("[data-phone-link]").forEach(function (el) {
      el.setAttribute("href", "tel:+" + String(CLINIC.phoneE164 || "").replace(/\D/g, ""));
      if (!el.textContent.trim()) el.textContent = CLINIC.phoneLabel || "";
    });
    $$("[data-email]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + (CLINIC.email || ""));
    });
    $$("[data-email-text]").forEach(function (el) {
      el.textContent = CLINIC.email || "";
    });
    $$("[data-address]").forEach(function (el) {
      el.textContent = (CLINIC.address || "") + (CLINIC.addressExtra ? " - " + CLINIC.addressExtra : "");
    });
    $$("[data-zip]").forEach(function (el) {
      el.textContent = "CEP " + (CLINIC.zip || "");
    });
    $$("[data-cnpj]").forEach(function (el) {
      el.textContent = "CNPJ " + (CLINIC.cnpj || "00.000.000/0001-00");
    });
    $$("[data-crm]").forEach(function (el) {
      el.textContent = CLINIC.crm || "";
    });
    $$("[data-rqe]").forEach(function (el) {
      el.textContent = CLINIC.rqe || "";
    });
    $$("[data-instagram]").forEach(function (el) {
      el.textContent = CLINIC.instagram || "@estoubem";
    });
    $$("[data-years]").forEach(function (el) {
      el.textContent = PROOF.years || "15";
    });
    $$("[data-patients]").forEach(function (el) {
      el.textContent = Number(PROOF.patients || 0).toLocaleString("pt-BR");
    });
    $$("[data-rating]").forEach(function (el) {
      el.textContent = String(PROOF.rating || "4,9").replace(".", ",");
    });
    $$("[data-rating-count]").forEach(function (el) {
      el.textContent = String(PROOF.ratingCount || 0);
    });
    $$("[data-maps]").forEach(function (el) {
      el.setAttribute(
        "href",
        "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(CLINIC.mapsQuery || CLINIC.address || "")
      );
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
    $$("[data-wa]").forEach(function (el) {
      el.setAttribute("href", waLink(el.getAttribute("data-wa-msg") || undefined));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  /* ------------------------------------------- fallback SVG -> foto real */
  function photoFallback() {
    $$("img[data-photo]").forEach(function (img) {
      img.addEventListener(
        "error",
        function () {
          var fallback = img.getAttribute("data-photo");
          if (fallback && img.getAttribute("src") !== fallback) {
            img.setAttribute("src", fallback);
          }
        },
        { once: false }
      );
    });
  }

  /* ------------------------------------------------------------- menu/scan */
  function initHeader() {
    var toggle = $("#menu-toggle");
    var menu = $("#mobile-menu");
    var icon = $("#icon-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.classList.toggle("hidden") === false;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        if (icon) {
          icon.innerHTML = open
            ? '<path d="M6 6l12 12M18 6 6 18"/>'
            : '<path d="M4 7h16M4 12h16M4 17h16"/>';
        }
      });
      $$("#mobile-menu a").forEach(function (a) {
        a.addEventListener("click", function () {
          menu.classList.add("hidden");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    var header = $("#site-header");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("shadow-soft", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  function initReveal() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function initStickyCta() {
    var bar = $("#sticky-cta");
    if (!bar) return;
    var trigger = 560;
    var onScroll = function () {
      var show = window.scrollY > trigger;
      bar.classList.toggle("translate-y-full", !show);
      bar.classList.toggle("translate-y-0", show);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initStatus() {
    var text = $("#open-status");
    var dot = $("#open-status-dot");
    var slot = $("#next-slot");
    function render() {
      var st = statusNow();
      if (text) text.textContent = st.text;
      if (dot) dot.className = "inline-block h-2 w-2 rounded-full " + st.dot;
      if (slot) {
        var s = nextSlots(1)[0];
        slot.textContent = s
          ? s.label + " (BRT)"
          : "Consulte a recepção";
      }
    }
    render();
    setInterval(render, 60000);
  }

  /* --------------------------------------------------- modal de agendamento */
  var bookingState = { specialty: "", slot: null };

  function calendarUrl(specialty, slot) {
    var title = "Consulta — " + specialty + " — Clínica ESTOU BEM";
    var details =
      "Consulta de " +
      specialty +
      " na Clínica ESTOU BEM com " +
      (CLINIC.doctorName || "Dr. Humberto") +
      ".\n\nAgendado pelo site da clínica.";
    var location = (CLINIC.address || "") + (CLINIC.addressExtra ? " - " + CLINIC.addressExtra : "");
    var params = new URLSearchParams();
    params.set("text", title);
    params.set("details", details);
    params.set("location", location);
    params.set("ctz", TZ);
    if (slot) params.set("dates", gcalStamp(slot.utc) + "/" + gcalStamp(slot.utcEnd));
    return (BOOKING.eventUrl || "https://calendar.google.com/calendar/u/0/r/eventedit") + "?" + params.toString();
  }

  function renderSpecialtyChips() {
    var box = $("#booking-specialties");
    if (!box) return;
    box.innerHTML = "";
    SPECIALTIES.forEach(function (sp) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = sp.name;
      b.className =
        "rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors " +
        (bookingState.specialty === sp.name
          ? "border-brand-700 bg-brand-700 text-white"
          : "border-ink-200 bg-white text-ink-700 hover:border-brand-600 hover:text-brand-700");
      b.addEventListener("click", function () {
        bookingState.specialty = sp.name;
        bookingState.slot = null;
        renderSpecialtyChips();
        renderSlots();
        renderBookingLinks();
      });
      box.appendChild(b);
    });
  }

  function renderSlots() {
    var box = $("#booking-slots");
    if (!box) return;
    box.innerHTML = "";
    var slots = nextSlots(6, bookingState.specialty);
    if (!slots.length) {
      var p = document.createElement("p");
      p.className = "col-span-full rounded-xl bg-ink-50 p-4 text-sm text-ink-500";
      p.textContent = "Sem horários livres nos próximos dias. Fale com a recepção pelo WhatsApp.";
      box.appendChild(p);
      return;
    }
    slots.forEach(function (slot) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = slot.label;
      b.className =
        "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors " +
        (bookingState.slot && bookingState.slot.label === slot.label
          ? "border-brand-700 bg-brand-50 text-brand-800"
          : "border-ink-200 bg-white text-ink-700 hover:border-brand-600 hover:text-brand-700");
      b.addEventListener("click", function () {
        bookingState.slot = slot;
        renderSlots();
        renderBookingLinks();
      });
      box.appendChild(b);
    });
  }

  function renderBookingLinks() {
    var link = $("#booking-google");
    var page = $("#booking-page");
    var spec = bookingState.specialty || "Clínica médica";
    if (link) {
      link.setAttribute("href", calendarUrl(spec, bookingState.slot));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
      link.textContent = "";
      var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("class", "h-5 w-5");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("fill", "none");
      icon.setAttribute("stroke", "currentColor");
      icon.setAttribute("stroke-width", "2");
      icon.setAttribute("stroke-linecap", "round");
      icon.innerHTML = '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/>';
      var txt = document.createElement("span");
      txt.textContent = bookingState.slot
        ? "Confirmar " + bookingState.slot.label + " no Google Agenda"
        : "Abrir no Google Agenda";
      link.appendChild(icon);
      link.appendChild(txt);
    }
    if (page) {
      page.setAttribute("href", BOOKING.appointmentUrl || "#");
      page.setAttribute("target", "_blank");
      page.setAttribute("rel", "noopener");
    }
  }

  function openBooking(specialty) {
    var modal = $("#booking-modal");
    if (!modal) return;
    bookingState.specialty = specialty || bookingState.specialty || (SPECIALTIES[0] && SPECIALTIES[0].name) || "Clínica médica";
    bookingState.slot = null;
    renderSpecialtyChips();
    renderSlots();
    renderBookingLinks();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
    var focusable = modal.querySelector("button");
    if (focusable) focusable.focus();
  }

  function closeBooking() {
    var modal = $("#booking-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  function initBooking() {
    $$("[data-open-booking]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openBooking(el.getAttribute("data-specialty"));
      });
    });
    $$("[data-close-booking]").forEach(function (el) {
      el.addEventListener("click", closeBooking);
    });
    var modal = $("#booking-modal");
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeBooking();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeBooking();
        closeChat();
      }
    });
  }

  /* ------------------------------------------------------- chat assistente */
  var chatState = { open: false };

  function chatLog() {
    return $("#chat-log");
  }

  function addMessage(text, from, buttons) {
    var log = chatLog();
    if (!log) return;
    var wrap = document.createElement("div");
    wrap.className = "flex " + (from === "user" ? "justify-end" : "justify-start");
    var bubble = document.createElement("div");
    bubble.className = from === "user" ? "chat-bubble-out" : "chat-bubble-in";
    bubble.style.maxWidth = "86%";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    log.appendChild(wrap);

    if (buttons && buttons.length) {
      var row = document.createElement("div");
      row.className = "flex flex-wrap gap-2";
      buttons.forEach(function (b) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = b.label;
        btn.className =
          "rounded-full border border-brand-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-brand-800 transition-colors hover:bg-brand-50";
        btn.addEventListener("click", function () {
          row.remove();
          handleAction(b.action);
        });
        row.appendChild(btn);
      });
      log.appendChild(row);
    }
    log.scrollTop = log.scrollHeight;
  }

  function typing() {
    var log = chatLog();
    if (!log) return null;
    var el = document.createElement("div");
    el.className = "flex justify-start";
    el.innerHTML =
      '<div class="chat-bubble-in flex items-center gap-1"><span class="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400"></span><span class="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:120ms]"></span><span class="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:240ms]"></span></div>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function botSay(text, buttons, delay) {
    var t = typing();
    setTimeout(
      function () {
        if (t) t.remove();
        addMessage(text, "bot", buttons);
      },
      delay || 550
    );
  }

  function quickReplies() {
    var box = $("#chat-quick");
    if (!box) return;
    box.innerHTML = "";
    [
      { label: "Especialidades", action: "specialties" },
      { label: "Agendar", action: "booking" },
      { label: "Horários", action: "hours" },
      { label: "Preço da consulta", action: "price" },
      { label: "Onde fica?", action: "location" },
    ].forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = q.label;
      b.className =
        "rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-ink-700 transition-colors hover:border-brand-600 hover:text-brand-700";
      b.addEventListener("click", function () {
        addMessage(q.label, "user");
        handleAction(q.action);
      });
      box.appendChild(b);
    });
  }

  function answerPrice() {
    botSay(
      "O valor da consulta depende da especialidade e da cobertura do convênio. A primeira avaliação inclui anamnese completa, exame físico e plano de tratamento por escrito. A recepção confirma valores e convênios em minutos:",
      [{ label: "Falar com a recepção", action: "wa" }]
    );
  }

  function answerSpecialties() {
    var names = SPECIALTIES.map(function (s) {
      return s.name;
    });
    botSay(
      "Temos " +
        SPECIALTIES.length +
        " especialidades: " +
        names.join(", ") +
        ". Qual delas você procura?",
      [{ label: "Agendar", action: "booking" }]
    );
  }

  function answerHours() {
    var st = statusNow();
    var slots = nextSlots(3);
    var extra = slots.length
      ? " Próximos horários livres: " + slots.map(function (s) {
          return s.label;
        }).join(", ") + "."
      : "";
    botSay(
      st.text +
        ". Atendimento de segunda a sexta das 08h00 às 12h00 e das 13h30 às 18h00, e sábado das 08h00 às 12h00 (Brasília, GMT-3)." +
        extra
    );
  }

  function answerLocation() {
    botSay(
      "A clínica fica em " +
        (CLINIC.address || "São Paulo/SP") +
        ". Envie sua mensagem no WhatsApp que mandamos a localização completa e a melhor rota:",
      [{ label: "Abrir o WhatsApp", action: "wa" }]
    );
  }

  function answerInsurance() {
    botSay(
      "Trabalhamos com os principais convênios e também com atendimento particular. A lista é atualizada com frequência — confirme pelo WhatsApp antes da consulta para evitar transtorno na recepção:",
      [{ label: "Falar com a recepção", action: "wa" }]
    );
  }

  function answerDocuments() {
    botSay(
      "Leve documento com foto, cartão do convênio (se tiver), exames anteriores e a lista de medicamentos em uso. Se tiver exame de imagem recente, traga o resultado.",
      [{ label: "Agendar consulta", action: "booking" }]
    );
  }

  function answerBooking() {
    botSay(
      "Para agendar, escolha a especialidade e um horário livre. O botão abre o Google Agenda com tudo preenchido — você só confirma.",
      [{ label: "Abrir agenda", action: "open-booking" }]
    );
  }

  function handleAction(action) {
    switch (action) {
      case "specialties":
        answerSpecialties();
        break;
      case "booking":
        answerBooking();
        break;
      case "open-booking":
        botSay("Abrindo a agenda agora mesmo 👇");
        setTimeout(function () {
          openBooking();
        }, 400);
        break;
      case "hours":
        answerHours();
        break;
      case "price":
        answerPrice();
        break;
      case "location":
        answerLocation();
        break;
      case "insurance":
        answerInsurance();
        break;
      case "documents":
        answerDocuments();
        break;
      case "wa":
        botSay("Perfeito! Vou abrir o WhatsApp da clínica para você falar direto com a recepção:", [
          { label: "Abrir WhatsApp", action: "wa-link" },
        ]);
        break;
      case "wa-link":
        window.open(waLink(), "_blank", "noopener");
        break;
      case "doctor":
        botSay(
          "O responsável é " +
            (CLINIC.doctorName || "Dr. Humberto") +
            ", " +
            (CLINIC.crm || "CRM-SP 000.000") +
            " · " +
            (CLINIC.rqe || "RQE-SP 00.000") +
            ", com " +
            (PROOF.years || 15) +
            " anos de experiência e mais de " +
            Number(PROOF.patients || 0).toLocaleString("pt-BR") +
            " pacientes atendidos."
        );
        break;
      default:
        botSay(
          "Posso ajudar com: especialidades, horários, agendamento, valores, convênio, endereço e documentos. Se preferir falar com uma pessoa, é só pedir:",
          [{ label: "Falar com a recepção", action: "wa" }]
        );
    }
  }

  function normalizeText(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function interpret(text) {
    var t = normalizeText(text);
    if (/(^|\s)(oi|ola|bom dia|boa tarde|boa noite|hello|e ai|bem vindo|boa)(\s|$|[?!,.])/.test(t))
      return "hello";
    if (/(especialidade|especialidades|dermato|cardio|orto|neuro|pedi|endocrino|nutri|gineco|urolog|clinica medica)/.test(t))
      return "specialties";
    if (/(preco|precos|valor|quanto custa|custa|quanto|tabela|particular)/.test(t))
      return "price";
    if (/(convenio|plano de saude|cobertura|reembolso|seguro)/.test(t)) return "insurance";
    if (/(agendar|agenda|agendamento|marcar|vaga|vagas|disponib|horario livre|horarios livres|consulta)/.test(t))
      return "booking";
    if (/(horario|horarios|funciona|funcionamento|aberto|fecha|fechado|atendimento|abre)/.test(t))
      return "hours";
    if (/(endereco|onde fica|localiza|mapa|como chegar|chegar|local)/.test(t))
      return "location";
    if (/(documento|documentos|levar|exame|exames|receita|cpf|rg|vacina|medicamento)/.test(t))
      return "documents";
    if (/(doutor|dr\.? humberto|medico|quem e|responsavel)/.test(t)) return "doctor";
    if (/(whatsapp|telefone|falar|atendente|recepcao|pessoa|humana|alguem)/.test(t))
      return "wa";
    return "fallback";
  }

  function chatSayUser(text) {
    addMessage(text, "user");
    var intent = interpret(text);
    if (intent === "hello") {
      botSay(
        "Olá! Sou o assistente da Clínica ESTOU BEM 👋 Posso mostrar as especialidades, os horários livres, tirar dúvidas sobre consulta, convênio e endereço — ou te encaminhar para a recepção no WhatsApp. O que você precisa?",
        [{ label: "Ver especialidades", action: "specialties" }, { label: "Agendar", action: "booking" }]
      );
      return;
    }
    if (intent === "fallback") {
      botSay(
        "Ainda não entendi essa. Posso ajudar com:",
        [
          { label: "Especialidades", action: "specialties" },
          { label: "Horários", action: "hours" },
          { label: "Agendar", action: "booking" },
          { label: "Falar com a recepção", action: "wa" },
        ]
      );
      return;
    }
    handleAction(intent);
  }

  function openChat() {
    var panel = $("#chat-panel");
    var launcher = $("#chat-launcher");
    if (!panel) return;
    chatState.open = true;
    panel.classList.remove("hidden");
    if (launcher) launcher.setAttribute("aria-expanded", "true");
    if (!panel.dataset.init) {
      panel.dataset.init = "1";
      quickReplies();
      botSay(
        "Olá! Sou o assistente da Clínica ESTOU BEM 👋 Posso mostrar as especialidades, os horários livres, tirar dúvidas sobre consulta, convênio e endereço — ou te encaminhar para a recepção no WhatsApp. O que você precisa?",
        [
          { label: "Ver especialidades", action: "specialties" },
          { label: "Agendar", action: "booking" },
        ],
        300
      );
    }
  }

  function closeChat() {
    var panel = $("#chat-panel");
    var launcher = $("#chat-launcher");
    if (!panel) return;
    chatState.open = false;
    panel.classList.add("hidden");
    if (launcher) launcher.setAttribute("aria-expanded", "false");
  }

  function initChat() {
    var launcher = $("#chat-launcher");
    var close = $("#chat-close");
    if (launcher) {
      launcher.addEventListener("click", function () {
        if (chatState.open) closeChat();
        else openChat();
      });
    }
    if (close) close.addEventListener("click", closeChat);

    var panel = $("#chat-panel");
    if (panel) {
      panel.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && e.target.tagName === "INPUT") {
          e.preventDefault();
        }
      });
    }

    // caixinha de texto livre dentro do chat
    var quick = $("#chat-quick");
    if (quick) {
      var input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Escreva sua dúvida…";
      input.setAttribute("aria-label", "Escreva sua dúvida");
      input.className =
        "mt-2 w-full rounded-full border border-ink-200 px-4 py-2 text-sm outline-none focus:border-brand-600";
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && input.value.trim()) {
          chatSayUser(input.value.trim());
          input.value = "";
        }
      });
      var holder = document.createElement("div");
      holder.className = "w-full";
      holder.appendChild(input);
      quick.parentNode.appendChild(holder);
    }
  }

  /* ------------------------------------------------------------------ init */
  function init() {
    applyConfig();
    photoFallback();
    initHeader();
    initReveal();
    initStickyCta();
    initStatus();
    initBooking();
    initChat();
    var year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
