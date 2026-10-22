/* ==========================================================================
   ESTOU BEM — configuração central da landing page
   --------------------------------------------------------------------------
   >>> 1. TROQUE todos os valores marcados com "TROCAR" <<<
   >>> 2. O fuso é sempre America/Sao_Paulo (BRT / UTC-3, sem horário de verão
          desde 2019). Qualquer horário exibido na página usa este fuso. <<<
   ========================================================================== */

window.ESTOU_BEM = {
  /* ---------------------------------------------------------------- clínica */
  clinic: {
    name: "Clínica ESTOU BEM",
    legalName: "Clínica ESTOU BEM", // TROCAR: razão social
    doctorName: "Dr. Humberto",
    doctorTitle: "Clínica médica", // TROCAR: especialidade do responsável
    crm: "CRM-SP 000.000", // TROCAR
    rqe: "RQE-SP 00.000", // TROCAR
    address: "Rua Exemplo, 000 - Bairro, São Paulo/SP", // TROCAR
    addressExtra: "", // TROCAR: complemento (sala, bloco)
    zip: "00000-000", // TROCAR
    neighborhood: "Bairro", // TROCAR
    phoneE164: "5511900000000", // TROCAR: formato internacional, só números
    phoneLabel: "(11) 90000-0000", // TROCAR
    email: "contato@estoubem.com.br", // TROCAR
    instagram: "", // TROCAR: @perfil
    mapsQuery: "Clínica ESTOU BEM São Paulo", // TROCAR: endereço para o mapa
  },

  /* ---------------------------------------------------------- agendamento */
  booking: {
    /* Evento novo no Google Agenda do médico (link oficial do Google Calendar) */
    eventUrl: "https://calendar.google.com/calendar/u/0/r/eventedit",
    /* Página de agendamento (Google Calendar "Horário de funcionamento" /
       link "Agendar" do perfil) — TROCAR pelo link real da clínica */
    appointmentUrl: "https://calendar.google.com/calendar/u/0/", // TROCAR
    durationMinutes: 40, // duração padrão da consulta (minutos)
    slotStepMinutes: 40, // intervalo entre o início de uma consulta e a outra
    maxDaysAhead: 21,
    noticeHours: 4, // agendamento mínimo com antecedência
  },

  /* -------------------------------------------------------------- horários */
  /* chaves = dia da semana (0 = domingo ... 6 = sábado)
     null = fechado | [["08:00","12:00"],["13:30","18:00"]] = períodos (BRT) */
  hours: {
    0: null,
    1: [
      ["08:00", "12:00"],
      ["13:30", "18:00"],
    ],
    2: [
      ["08:00", "12:00"],
      ["13:30", "18:00"],
    ],
    3: [
      ["08:00", "12:00"],
      ["13:30", "18:00"],
    ],
    4: [
      ["08:00", "12:00"],
      ["13:30", "18:00"],
    ],
    5: [
      ["08:00", "12:00"],
      ["13:30", "18:00"],
    ],
    6: [["08:00", "12:00"]],
  },

  /* -------------------------------------------------------------- reviews */
  socialProof: {
    rating: 4.9, // TROCAR: nota real (Google/Wmaps)
    ratingCount: 187, // TROCAR: quantidade real de avaliações
    patients: 12000, // TROCAR: número real de pacientes atendidos
    years: 15, // TROCAR: anos de experiência
  },

  /* --------------------------------------------------- WhatsApp (mensagem) */
  whatsapp: {
    defaultMessage:
      "Olá! Vim pelo site da Clínica ESTOU BEM e gostaria de agendar uma consulta.",
    bySpecialty: {}, // TROCAR (opcional): mensagem específica por especialidade
  },

  /* ------------------------------------------------------------- palavras */
  specialties: [
    {
      id: "clinica-medica",
      name: "Clínica médica",
      short: "Avaliação geral, prevenção e acompanhamento da sua saúde.",
      icon: "clinica",
    },
    {
      id: "dermatologia",
      name: "Dermatologia",
      short: "Pele, cabelo e unhas com avaliação especializada e tratamento.",
      icon: "dermatologia",
    },
    {
      id: "cardiologia",
      name: "Cardiologia",
      short: "Coração e pressão: exames, risco cardiovascular e acompanhamento.",
      icon: "cardiologia",
    },
    {
      id: "ortopedia",
      name: "Ortopedia",
      short: "Ossos, articulações, coluna e-trauma: dor, postura e mobilidade.",
      icon: "ortopedia",
    },
    {
      id: "neurologia",
      name: "Neurologia",
      short: "Dor de cabeça, dormência, AVC e sintomas do sistema nervoso.",
      icon: "neurologia",
    },
    {
      id: "pediatria",
      name: "Pediatria",
      short: "Cuidado da criança em todas as fases, com acompanhamento do vacinal.",
      icon: "pediatria",
    },
    {
      id: "endocrinologia",
      name: "Endocrinologia",
      short: "Tireoide, diabetes, peso e metabolismo com plano de tratamento.",
      icon: "endocrinologia",
    },
    {
      id: "nutricao",
      name: "Nutrição",
      short: "Reeducação alimentar com acompanhamento prático e sustentável.",
      icon: "nutricao",
    },
    {
      id: "ginecologia",
      name: "Ginecologia",
      short: "Saúde da mulher, hormonal, preventivo e acompanhamento contínuo.",
      icon: "ginecologia",
    },
    {
      id: "urologia",
      name: "Urologia",
      short: "Trato urinário, pedra, função e saúde do homem.",
      icon: "urologia",
    },
  ],
};
