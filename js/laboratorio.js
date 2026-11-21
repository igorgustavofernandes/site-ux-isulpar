const PHASES = ["missao", "diagnostico", "decisoes", "formulario", "resultado"];
const ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg"];
const MAX_JUSTIFICATION_LENGTH = 500;

const REFERENCES = {
  nielsen: "https://www.nngroup.com/articles/ten-usability-heuristics/",
  wcag332: "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
  wcag331: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html",
  wcag333: "https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html",
  wcag413: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
};

const DIAGNOSIS_ISSUES = [
  {
    id: "rotulos",
    label: "Rótulos “Tipo” e “Referência”",
    evidence: "Os nomes não distinguem disciplina de avaliação, embora essas sejam as opções exibidas.",
    refs: ["Nielsen H6 — reconhecimento em vez de memorização", "WCAG 3.3.2 — rótulos ou instruções"]
  },
  {
    id: "instrucoes",
    label: "Orientação para o motivo",
    evidence: "O campo “Motivo” não explica o que escrever nem informa um limite de texto.",
    refs: ["Nielsen H2 — correspondência com o mundo real", "WCAG 3.3.2 — rótulos ou instruções"]
  },
  {
    id: "obrigatorios",
    label: "Identificação de campos necessários",
    evidence: "A regra fictícia exige disciplina, avaliação e justificativa, mas o mockup não sinaliza essa exigência.",
    refs: ["Nielsen H6 — reconhecimento em vez de memorização", "WCAG 3.3.2 — rótulos ou instruções"]
  },
  {
    id: "anexo",
    label: "Instrução sobre o anexo",
    evidence: "A regra do exercício cita formatos aceitos, mas o controle original não os informa.",
    refs: ["Nielsen H5 — prevenção de erros", "WCAG 3.3.2 — rótulos ou instruções"]
  },
  {
    id: "feedback",
    label: "Retorno após tentar solicitar",
    evidence: "O botão não indica progresso nem confirma o resultado; o mockup demonstra essa ausência.",
    refs: ["Nielsen H1 — visibilidade do estado do sistema", "WCAG 4.1.3 — mensagens de estado (quando apresentadas sem mudança de contexto)"]
  }
];

const DIAGNOSIS_VALID_OBSERVATIONS = [
  {
    id: "ordem",
    label: "A sequência dos campos acompanha a tarefa",
    explanation: "Disciplina, avaliação, motivo e anexo seguem uma ordem compreensível neste cenário.",
    refs: ["Nielsen H2 — correspondência com o mundo real"]
  },
  {
    id: "anexo-opcional",
    label: "O anexo opcional respeita a regra do exercício",
    explanation: "O cenário declara o anexo opcional; não exigir o arquivo é coerente com essa regra fictícia.",
    refs: []
  }
];

const DECISIONS = [
  {
    id: "rotulos",
    title: "Rótulos e orientação",
    options: {
      especificos: {
        label: "Usar “Disciplina” e “Avaliação” e manter exemplos no texto de apoio.",
        preview: "Disciplina e Avaliação, com exemplos próximos dos controles.",
        interface: {
          disciplina: "Disciplina",
          avaliacao: "Avaliação",
          ajudaDisciplina: "Escolha a disciplina simulada em que ocorreu a avaliação.",
          ajudaAvaliacao: "Selecione a avaliação correspondente."
        },
        limitation: "Ocupa um pouco mais de espaço, mas os termos ficam explícitos.",
        rationale: "Nomes específicos favorecem reconhecimento; a orientação complementar pode esclarecer o formato esperado.",
        nielsen: ["H2 — correspondência com o mundo real", "H6 — reconhecimento em vez de memorização"],
        wcag: ["WCAG 3.3.2 — rótulos ou instruções"]
      },
      contexto: {
        label: "Manter nomes curtos e associar explicações diretamente aos controles.",
        preview: "Tipo (disciplina) e Referência (avaliação), com explicações associadas.",
        interface: {
          disciplina: "Tipo",
          avaliacao: "Referência",
          ajudaDisciplina: "Neste cenário, escolha a disciplina.",
          ajudaAvaliacao: "Neste cenário, escolha a avaliação."
        },
        limitation: "A explicação precisa permanecer claramente associada e disponível durante o preenchimento.",
        rationale: "A ajuda contextual reduz ambiguidade sem alongar os rótulos; ainda exige que a pessoa leia a explicação.",
        nielsen: ["H6 — reconhecimento em vez de memorização"],
        wcag: ["WCAG 3.3.2 — rótulos ou instruções"]
      }
    }
  },
  {
    id: "obrigatorios",
    title: "Campos necessários",
    options: {
      "por-campo": {
        label: "Sinalizar cada campo necessário e manter o estado obrigatório no controle.",
        preview: "Cada campo necessário aparece marcado e identificado como obrigatório.",
        interface: {
          requiredMarker: " *",
          requiredSummary: " * Campos com asterisco são obrigatórios nesta simulação."
        },
        limitation: "O significado do indicador deve ser explicado; não dependa apenas da cor ou do asterisco.",
        rationale: "A indicação junto ao campo dá contexto no momento da decisão e reduz a necessidade de memorizar uma regra geral.",
        nielsen: ["H6 — reconhecimento em vez de memorização"],
        wcag: ["WCAG 3.3.2 — rótulos ou instruções"]
      },
      resumo: {
        label: "Listar no início os campos necessários e manter essa regra consistente.",
        preview: "Aviso inicial lista os dados necessários; campos mantêm a regra no controle.",
        interface: {
          requiredMarker: "",
          requiredSummary: "Obrigatórios nesta simulação: disciplina, avaliação e justificativa."
        },
        limitation: "A pessoa pode precisar voltar ao aviso; a informação fica menos próxima do campo.",
        rationale: "Um resumo inicial é eficiente e visível, mas uma indicação local também ajuda a reconhecer a exigência durante o preenchimento.",
        nielsen: ["H6 — reconhecimento em vez de memorização"],
        wcag: ["WCAG 3.3.2 — rótulos ou instruções"]
      }
    }
  },
  {
    id: "anexo",
    title: "Requisitos do anexo",
    options: {
      junto: {
        label: "Informar os formatos junto ao controle e verificar a extensão ao escolher o arquivo.",
        preview: "PDF, PNG e JPG explicados junto ao controle; extensão verificada na escolha.",
        interface: {
          anexo: "Formatos previstos: PDF, PNG e JPG. A extensão é verificada ao escolher."
        },
        limitation: "A checagem por extensão não confirma o conteúdo nem a segurança do arquivo.",
        rationale: "A orientação aparece antes da ação e a validação antecipada evita avançar com uma extensão não prevista.",
        nielsen: ["H5 — prevenção de erros"],
        wcag: ["WCAG 3.3.2 — rótulos ou instruções"]
      },
      regras: {
        label: "Manter os formatos na área de regras e verificar a extensão durante a revisão.",
        preview: "Formatos listados nas regras; extensão verificada somente na revisão.",
        interface: {
          anexo: "Consulte as regras do cenário; a extensão será verificada na revisão."
        },
        limitation: "A regra pode passar despercebida até mais tarde; a verificação continua limitada à extensão.",
        rationale: "Centralizar regras pode reduzir repetição, mas afasta a orientação do controle e adia o retorno.",
        nielsen: ["H5 — prevenção de erros", "H6 — reconhecimento em vez de memorização"],
        wcag: ["WCAG 3.3.2 — rótulos ou instruções"]
      }
    }
  },
  {
    id: "erros",
    title: "Localização e correção de erros",
    options: {
      "campo-e-resumo": {
        label: "Mostrar instrução junto ao campo e um resumo com links para os campos afetados.",
        preview: "Orientação junto ao campo e resumo com links para cada erro.",
        interface: {
          justificationHelp: "A orientação aparece junto ao campo: descreva brevemente o motivo.",
          errorMessage: "Resumo: a justificativa precisa ser completada.",
          errorLink: "Ir para a justificativa"
        },
        limitation: "Mensagens locais e resumo precisam permanecer sincronizados para não contradizer-se.",
        rationale: "A pessoa recebe contexto no campo e pode localizar rapidamente todos os itens que precisam de atenção.",
        nielsen: ["H9 — ajudar a reconhecer, diagnosticar e recuperar-se de erros"],
        wcag: ["WCAG 3.3.1 — identificação de erros", "WCAG 3.3.3 — sugestão de correção (quando conhecida)"]
      },
      "resumo-com-links": {
        label: "Usar um resumo claro com links que levam diretamente aos campos afetados.",
        preview: "Resumo identifica os erros e oferece links aos controles correspondentes.",
        interface: {
          justificationHelp: "Limite: 500 caracteres. A mensagem de erro fica no resumo.",
          errorMessage: "Resumo: preencha a justificativa para continuar.",
          errorLink: "Ir para a justificativa"
        },
        limitation: "Sem instrução junto ao campo, a pessoa pode perder o contexto depois de seguir o link.",
        rationale: "Links no resumo ajudam a localizar os erros; instruções locais seriam um complemento útil para corrigi-los.",
        nielsen: ["H9 — ajudar a reconhecer, diagnosticar e recuperar-se de erros"],
        wcag: ["WCAG 3.3.1 — identificação de erros", "WCAG 3.3.3 — sugestão de correção (quando conhecida)"]
      }
    }
  },
  {
    id: "feedback",
    title: "Fluxo e confirmação",
    options: {
      revisao: {
        label: "Indicar a etapa e permitir revisar os dados antes da confirmação simulada.",
        preview: "Etapa atual visível, resumo revisável e confirmação após a ação.",
        interface: {
          progress: "Etapa 1 de 2 — preenchimento. Depois, revise os dados.",
          confirmation: "Após a revisão: “Solicitação simulada confirmada nesta página.”"
        },
        limitation: "Uma etapa extra pode alongar o fluxo; ela deve facilitar a revisão, não repetir dados sem propósito.",
        rationale: "A etapa de revisão mostra o estado do processo e dá oportunidade de conferir antes da confirmação.",
        nielsen: ["H1 — visibilidade do estado do sistema"],
        wcag: []
      },
      "pagina-unica": {
        label: "Manter o formulário em uma página, validar e apresentar confirmação clara.",
        preview: "Uma página; erros apontam os campos e uma mensagem confirma a ação simulada.",
        interface: {
          progress: "Formulário em uma página; corrija os campos indicados antes de continuar.",
          confirmation: "Ao concluir: “Solicitação simulada confirmada nesta página.”"
        },
        limitation: "Não há etapa separada para conferir o resumo antes de confirmar.",
        rationale: "Um fluxo curto pode ser eficiente, desde que erros e resultado da ação sejam claramente comunicados.",
        nielsen: ["H1 — visibilidade do estado do sistema"],
        wcag: ["WCAG 4.1.3 — mensagens de estado (para confirmação dinâmica sem mudança de contexto)"]
      }
    }
  }
];

function createState() {
  return {
    phase: "missao",
    diagnosisChecked: false,
    diagnosisAnswers: new Set(),
    diagnosisRationale: "",
    decisionsChecked: false,
    decisionAnswers: {},
    formReviewed: false,
    simulatedSubmission: false
  };
}

function replaceListItems(list, items) {
  list.replaceChildren();
  items.forEach((itemContent) => {
    const item = document.createElement("li");
    if (typeof itemContent === "string") {
      item.textContent = itemContent;
    } else {
      item.appendChild(itemContent);
    }
    list.appendChild(item);
  });
}

function addReferences(container, labels) {
  const groups = [
    { prefix: "Nielsen", title: "Heurísticas de Nielsen" },
    { prefix: "WCAG", title: "Critérios WCAG 2.2" }
  ];

  groups.forEach((group) => {
    const references = labels.filter((label) => label.startsWith(group.prefix));
    if (!references.length) {
      return;
    }

    const paragraph = document.createElement("p");
    paragraph.className = "referencias-laboratorio";
    const strong = document.createElement("strong");
    strong.textContent = `${group.title}: `;
    paragraph.appendChild(strong);

    references.forEach((label, index) => {
      if (index > 0) {
        paragraph.appendChild(document.createTextNode("; "));
      }

      const link = document.createElement("a");
      link.textContent = label.replace(/^Nielsen /, "");
      link.setAttribute("aria-label", `${label} (abre em nova aba)`);
      link.href = label.startsWith("Nielsen") ? REFERENCES.nielsen
        : label.startsWith("WCAG 3.3.2") ? REFERENCES.wcag332
          : label.startsWith("WCAG 3.3.1") ? REFERENCES.wcag331
            : label.startsWith("WCAG 3.3.3") ? REFERENCES.wcag333
              : REFERENCES.wcag413;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      paragraph.appendChild(link);
    });

    container.appendChild(paragraph);
  });
}

function createEvidenceItem(label, description, references) {
  const wrapper = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = label;
  const explanation = document.createElement("p");
  explanation.textContent = description;
  wrapper.append(title, explanation);
  addReferences(wrapper, references);
  return wrapper;
}

export function initLaboratorio() {
  const root = document.querySelector("[data-laboratorio]");
  if (!root) {
    return;
  }

  const phasePanels = Array.from(root.querySelectorAll("[data-lab-phase]"));
  const progressItems = Array.from(root.querySelectorAll("[data-lab-progress]"));
  const status = root.querySelector("[data-lab-status]");
  const previewStatus = root.querySelector("[data-lab-preview-status]");
  const diagnosisForm = root.querySelector("[data-lab-diagnosis-form]");
  const decisionsForm = root.querySelector("[data-lab-decisions-form]");
  const improvedForm = root.querySelector("[data-lab-improved-form]");
  const diagnosisFeedback = root.querySelector("[data-lab-diagnosis-feedback]");
  const decisionFeedback = root.querySelector("[data-lab-decision-feedback]");
  const review = root.querySelector("[data-lab-review]");
  const formErrorSummary = root.querySelector("[data-lab-form-errors]");
  let state = createState();

  function setStatus(message) {
    status.textContent = message;
  }

  function showPhase(phaseName) {
    const phaseIndex = PHASES.indexOf(phaseName);
    if (phaseIndex === -1) {
      return;
    }

    state.phase = phaseName;
    phasePanels.forEach((panel) => {
      panel.hidden = panel.dataset.labPhase !== phaseName;
    });
    progressItems.forEach((item, index) => {
      if (index === phaseIndex) {
        item.setAttribute("aria-current", "step");
      } else {
        item.removeAttribute("aria-current");
      }
      item.classList.toggle("etapa-concluida", index < phaseIndex);
    });

    const activePanel = phasePanels.find((panel) => panel.dataset.labPhase === phaseName);
    const heading = activePanel.querySelector("[data-lab-heading]");
    heading.focus();
    setStatus(`Fase ${phaseIndex + 1} de ${PHASES.length}: ${heading.textContent.trim()}.`);
  }

  function diagnosisRationaleError(message) {
    const rationale = root.querySelector("#lab-diagnostico-justificativa");
    const error = root.querySelector("#lab-diagnostico-erro");
    if (message) {
      rationale.setAttribute("aria-invalid", "true");
      error.textContent = message;
      rationale.focus();
      setStatus(message);
      return false;
    }
    rationale.removeAttribute("aria-invalid");
    error.textContent = "";
    return true;
  }

  function renderDiagnosisFeedback() {
    const summary = root.querySelector("[data-lab-diagnosis-summary]");
    const identifiedList = root.querySelector("[data-lab-diagnosis-identified]");
    const reviewList = root.querySelector("[data-lab-diagnosis-review]");
    const validList = root.querySelector("[data-lab-diagnosis-valid]");
    const identified = DIAGNOSIS_ISSUES.filter((issue) => state.diagnosisAnswers.has(issue.id));
    const missed = DIAGNOSIS_ISSUES.filter((issue) => !state.diagnosisAnswers.has(issue.id));
    const falsePositives = DIAGNOSIS_VALID_OBSERVATIONS.filter((observation) =>
      state.diagnosisAnswers.has(observation.id)
    );
    const acceptedFeatures = DIAGNOSIS_VALID_OBSERVATIONS.filter((observation) =>
      !state.diagnosisAnswers.has(observation.id)
    );

    summary.textContent =
      `Você marcou ${identified.length} das ${DIAGNOSIS_ISSUES.length} barreiras evidenciadas. ` +
      `${falsePositives.length} característica(s) coerente(s) com as regras foram marcada(s) como problema. ` +
      "A justificativa é retomada para apoiar sua reflexão; sua qualidade não é avaliada automaticamente.";
    replaceListItems(identifiedList, identified.map((issue) =>
      createEvidenceItem(issue.label, issue.evidence, issue.refs)
    ));

    const reconsiderations = [
      ...missed.map((issue) => createEvidenceItem(
        `Não identificada — ${issue.label}`,
        issue.evidence,
        issue.refs
      )),
      ...falsePositives.map((observation) => createEvidenceItem(
        `Reconsidere — ${observation.label}`,
        observation.explanation,
        observation.refs
      ))
    ];
    if (!reconsiderations.length) {
      reconsiderations.push("Nenhuma evidência prevista ficou pendente nesta leitura.");
    }
    replaceListItems(reviewList, reconsiderations);
    replaceListItems(validList, acceptedFeatures.map((observation) =>
      createEvidenceItem(observation.label, observation.explanation, observation.refs)
    ));
    root.querySelector("[data-lab-diagnosis-rationale]").textContent = state.diagnosisRationale;
    diagnosisFeedback.hidden = false;
    root.querySelector("#lab-diagnostico-feedback-titulo").focus();
  }

  function invalidateDiagnosis() {
    if (!state.diagnosisChecked) {
      return;
    }

    state.diagnosisChecked = false;
    diagnosisFeedback.hidden = true;
    root.querySelector('[data-lab-phase="diagnostico"] [data-lab-next]').disabled = true;
    setStatus("Sua resposta mudou. Reveja as evidências novamente.");
  }

  function evaluateDiagnosis() {
    const rationale = root.querySelector("#lab-diagnostico-justificativa");
    const text = rationale.value.trim();
    if (!text) {
      diagnosisRationaleError("Explique brevemente sua interpretação; não inclua dados pessoais.");
      return;
    }

    diagnosisRationaleError("");
    const checked = Array.from(
      diagnosisForm.querySelectorAll('input[name="lab-diagnostico"]:checked')
    );
    state.diagnosisAnswers = new Set(checked.map((input) => input.value));
    state.diagnosisRationale = text;
    state.diagnosisChecked = true;
    renderDiagnosisFeedback();
    root.querySelector('[data-lab-phase="diagnostico"] [data-lab-next]').disabled = false;
    setStatus("Leitura das evidências pronta. A justificativa foi registrada apenas nesta página.");
  }

  function renderPreview(announceDecision) {
    DECISIONS.forEach((decision) => {
      const selectedValue = state.decisionAnswers[decision.id];
      const value = root.querySelector(`[data-lab-preview-value="${decision.id}"]`);
      const limitation = root.querySelector(`[data-lab-preview-limit="${decision.id}"]`);
      const option = selectedValue && decision.options[selectedValue];

      value.textContent = option
        ? `${decision.title}: ${option.preview}`
        : `${decision.title}: aguardando decisão.`;
      limitation.textContent = option ? `Trade-off: ${option.limitation}` : "";
    });

    const labels = state.decisionAnswers.rotulos &&
      DECISIONS[0].options[state.decisionAnswers.rotulos].interface;
    const required = state.decisionAnswers.obrigatorios &&
      DECISIONS[1].options[state.decisionAnswers.obrigatorios].interface;
    const attachment = state.decisionAnswers.anexo &&
      DECISIONS[2].options[state.decisionAnswers.anexo].interface;
    const errors = state.decisionAnswers.erros &&
      DECISIONS[3].options[state.decisionAnswers.erros].interface;
    const flow = state.decisionAnswers.feedback &&
      DECISIONS[4].options[state.decisionAnswers.feedback].interface;

    root.querySelector('[data-lab-preview-label="disciplina"]').textContent =
      labels ? labels.disciplina : "Tipo";
    root.querySelector('[data-lab-preview-label="avaliacao"]').textContent =
      labels ? labels.avaliacao : "Referência";
    root.querySelector('[data-lab-preview-help="disciplina"]').textContent =
      labels ? labels.ajudaDisciplina : "Rótulo original do mockup.";
    root.querySelector('[data-lab-preview-help="avaliacao"]').textContent =
      labels ? labels.ajudaAvaliacao : "Rótulo original do mockup.";
    root.querySelector('[data-lab-preview-help="justificativa"]').textContent = errors
      ? errors.justificationHelp
      : "Sem instrução sobre o que escrever.";
    ["disciplina", "avaliacao", "justificativa"].forEach((field) => {
      root.querySelector(`[data-lab-preview-required="${field}"]`).textContent =
        required ? required.requiredMarker : "";
    });
    root.querySelector('[data-lab-preview-required-summary]').textContent = required
      ? required.requiredSummary
      : "O mockup não informa quais campos são obrigatórios.";
    root.querySelector('[data-lab-preview-help="anexo"]').textContent = attachment
      ? attachment.anexo
      : "Formatos não informados.";
    const previewError = root.querySelector("[data-lab-preview-errors]");
    previewError.replaceChildren();
    if (errors) {
      const message = document.createElement("p");
      message.textContent = errors.errorMessage;
      const link = document.createElement("a");
      link.href = "#lab-previa-justificativa";
      link.textContent = errors.errorLink;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        root.querySelector("#lab-previa-justificativa").focus();
      });
      previewError.append(message, link);
    } else {
      previewError.textContent =
        "Se houver erro, o mockup não identifica o campo nem oferece orientação de correção.";
    }
    root.querySelector("[data-lab-preview-progress]").textContent = flow
      ? flow.progress
      : "Aguardando decisões sobre o fluxo.";
    root.querySelector("[data-lab-preview-confirmation]").textContent = flow
      ? flow.confirmation
      : "Nenhuma confirmação visível após tentar solicitar.";

    if (announceDecision) {
      const decision = DECISIONS.find((item) => item.id === announceDecision);
      const choice = state.decisionAnswers[announceDecision];
      const option = decision.options[choice];
      previewStatus.textContent = `Prévia atualizada — ${decision.title}: ${option.preview}`;
    } else {
      previewStatus.textContent = "Nenhuma decisão aplicada à prévia ainda.";
    }
  }

  function createDecisionFeedback(decision) {
    const selectedValue = state.decisionAnswers[decision.id];
    const option = decision.options[selectedValue];
    const item = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = `${decision.title}: ${option.label}`;
    const rationale = document.createElement("p");
    rationale.textContent = option.rationale;
    const limitation = document.createElement("p");
    limitation.textContent = `Trade-off observado: ${option.limitation}`;

    item.append(title, rationale, limitation);
    addReferences(item, [...option.nielsen.map((entry) => `Nielsen ${entry}`), ...option.wcag]);
    return item;
  }

  function evaluateDecisions() {
    const missingDecision = DECISIONS.find((decision) => !state.decisionAnswers[decision.id]);
    if (missingDecision) {
      const group = root.querySelector(`[data-lab-decision="${missingDecision.id}"]`);
      setStatus("Escolha uma alternativa em cada situação antes de analisar as consequências.");
      group.focus();
      return;
    }

    state.decisionsChecked = true;
    replaceListItems(
      root.querySelector("[data-lab-decision-list]"),
      DECISIONS.map(createDecisionFeedback)
    );
    decisionFeedback.hidden = false;
    root.querySelector('[data-lab-phase="decisoes"] [data-lab-next]').disabled = false;
    decisionFeedback.querySelector("h4").focus();
    setStatus("Consequências e referências exibidas. A prévia reflete as cinco escolhas.");
  }

  function renderResults() {
    const identified = DIAGNOSIS_ISSUES.filter((issue) => state.diagnosisAnswers.has(issue.id));
    const missed = DIAGNOSIS_ISSUES.filter((issue) => !state.diagnosisAnswers.has(issue.id));
    const falsePositives = DIAGNOSIS_VALID_OBSERVATIONS.filter((observation) =>
      state.diagnosisAnswers.has(observation.id)
    );
    const recognizedFeatures = DIAGNOSIS_VALID_OBSERVATIONS.filter((observation) =>
      !state.diagnosisAnswers.has(observation.id)
    );
    const reviewItems = [
      ...missed.map((issue) => `${issue.label}: ${issue.evidence}`),
      ...falsePositives.map((observation) => `${observation.label}: ${observation.explanation}`)
    ];
    root.querySelector("[data-lab-result-summary]").textContent =
      state.simulatedSubmission
        ? "A confirmação ocorreu somente nesta simulação. O retorno abaixo reúne as evidências reconhecidas, os pontos a reconsiderar e os efeitos das decisões."
        : "O retorno abaixo reúne as evidências reconhecidas, os pontos a reconsiderar e os efeitos das decisões.";
    replaceListItems(
      root.querySelector("[data-lab-result-identified]"),
      identified.map((issue) => `${issue.label}: ${issue.evidence}`)
    );
    replaceListItems(
      root.querySelector("[data-lab-result-review]"),
      reviewItems.length ? reviewItems : ["Nenhuma evidência prevista ficou pendente nesta leitura."]
    );
    replaceListItems(
      root.querySelector("[data-lab-result-valid]"),
      recognizedFeatures.map((observation) => `${observation.label}: ${observation.explanation}`)
    );
    replaceListItems(
      root.querySelector("[data-lab-result-decisions]"),
      DECISIONS.map(createDecisionFeedback)
    );
    root.querySelector("[data-lab-result-rationale]").textContent = state.diagnosisRationale;
  }

  function addErrorLink(list, field, label, message) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${field.id}`;
    link.textContent = `${label}: ${message}`;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      field.focus();
    });
    item.appendChild(link);
    list.appendChild(item);
  }

  function getFormErrors() {
    const fields = [
      {
        control: root.querySelector("#lab-disciplina"),
        label: "Disciplina",
        message: "Selecione uma disciplina simulada."
      },
      {
        control: root.querySelector("#lab-avaliacao"),
        label: "Avaliação",
        message: "Selecione uma avaliação simulada."
      },
      {
        control: root.querySelector("#lab-justificativa"),
        label: "Justificativa",
        message: "Escreva um motivo fictício para continuar."
      }
    ];
    const errors = [];

    fields.forEach(({ control, label, message }) => {
      if (!control.value.trim()) {
        errors.push({ control, label, message });
      }
    });

    const fileInput = root.querySelector("#lab-anexo");
    const file = fileInput.files[0];
    if (file) {
      const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "";
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        errors.push({
          control: fileInput,
          label: "Anexo",
          message: "Escolha um arquivo com extensão PDF, PNG ou JPG."
        });
      }
    }

    return errors;
  }

  function clearFieldErrors() {
    improvedForm.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
      field.removeAttribute("aria-invalid");
    });
    root.querySelectorAll(".erro-campo-laboratorio").forEach((message) => {
      message.textContent = "";
    });
  }

  function validateImprovedForm() {
    clearFieldErrors();
    const errors = getFormErrors();
    const errorList = root.querySelector("[data-lab-form-error-list]");
    errorList.replaceChildren();

    if (errors.length) {
      errors.forEach(({ control, label, message }) => {
        control.setAttribute("aria-invalid", "true");
        root.querySelector(`#${control.id}-erro`).textContent = message;
        addErrorLink(errorList, control, label, message);
      });
      formErrorSummary.hidden = false;
      review.hidden = true;
      state.formReviewed = false;
      formErrorSummary.focus();
      setStatus(`${errors.length} campo(s) precisam de atenção. Use os links do resumo para ir aos controles.`);
      return false;
    }

    formErrorSummary.hidden = true;
    return true;
  }

  function showReview() {
    const course = root.querySelector("#lab-disciplina");
    const assessment = root.querySelector("#lab-avaliacao");
    const justification = root.querySelector("#lab-justificativa");
    const file = root.querySelector("#lab-anexo").files[0];

    root.querySelector("[data-lab-review-course]").textContent =
      course.options[course.selectedIndex].textContent;
    root.querySelector("[data-lab-review-assessment]").textContent =
      assessment.options[assessment.selectedIndex].textContent;
    root.querySelector("[data-lab-review-justification]").textContent = justification.value.trim();
    root.querySelector("[data-lab-review-file]").textContent = file
      ? file.name
      : "Nenhum anexo selecionado";
    state.formReviewed = true;
    review.hidden = false;
    root.querySelector("#lab-revisao-titulo").focus();
    setStatus("Revisão pronta. Confira as informações antes de confirmar a simulação.");
  }

  function updateCharacterCount(input, output, maxLength, announcement) {
    const remaining = Math.max(0, maxLength - input.value.length);
    output.textContent = `${remaining} ${remaining === 1 ? "caractere restante." : "caracteres restantes."}`;

    if (!announcement) {
      return;
    }

    const previousRemaining = Number(announcement.dataset.previousRemaining || maxLength);
    const announceThreshold =
      remaining === 0 || remaining % 50 === 0 || (remaining <= 20 && remaining % 5 === 0);
    if (announceThreshold && remaining !== previousRemaining) {
      announcement.textContent = `${remaining} ${remaining === 1 ? "caractere restante." : "caracteres restantes."}`;
    }
    announcement.dataset.previousRemaining = String(remaining);
  }

  function resetExperience() {
    diagnosisForm.reset();
    decisionsForm.reset();
    improvedForm.reset();
    state = createState();
    diagnosisFeedback.hidden = true;
    decisionFeedback.hidden = true;
    review.hidden = true;
    formErrorSummary.hidden = true;
    const originalObservation = root.querySelector("[data-lab-original-observation]");
    originalObservation.hidden = true;
    originalObservation.textContent = "";
    root.querySelector('[data-lab-phase="diagnostico"] [data-lab-next]').disabled = true;
    root.querySelector('[data-lab-phase="decisoes"] [data-lab-next]').disabled = true;
    root.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
    root.querySelectorAll(".erro-campo-laboratorio").forEach((message) => {
      message.textContent = "";
    });
    const diagnosisAnnouncement = root.querySelector("[data-lab-diagnosis-count-announcement]");
    const justificationAnnouncement = root.querySelector("[data-lab-justification-count-announcement]");
    diagnosisAnnouncement.textContent = "";
    justificationAnnouncement.textContent = "";
    diagnosisAnnouncement.dataset.previousRemaining = String(MAX_JUSTIFICATION_LENGTH);
    justificationAnnouncement.dataset.previousRemaining = String(MAX_JUSTIFICATION_LENGTH);
    updateCharacterCount(
      root.querySelector("#lab-diagnostico-justificativa"),
      root.querySelector("[data-lab-diagnosis-count]"),
      MAX_JUSTIFICATION_LENGTH,
      diagnosisAnnouncement
    );
    updateCharacterCount(
      root.querySelector("#lab-justificativa"),
      root.querySelector("[data-lab-justification-count]"),
      MAX_JUSTIFICATION_LENGTH,
      justificationAnnouncement
    );
    root.querySelector("#lab-diagnostico-erro").textContent = "";
    renderPreview();
    showPhase("missao");
  }

  diagnosisForm.addEventListener("change", () => {
    invalidateDiagnosis();
  });

  const diagnosisRationale = root.querySelector("#lab-diagnostico-justificativa");
  const diagnosisCount = root.querySelector("[data-lab-diagnosis-count]");
  const diagnosisAnnouncement = root.querySelector("[data-lab-diagnosis-count-announcement]");
  diagnosisRationale.addEventListener("input", () => {
    updateCharacterCount(
      diagnosisRationale,
      diagnosisCount,
      MAX_JUSTIFICATION_LENGTH,
      diagnosisAnnouncement
    );
    invalidateDiagnosis();
    if (diagnosisRationale.hasAttribute("aria-invalid")) {
      diagnosisRationaleError("");
    }
  });

  decisionsForm.addEventListener("change", (event) => {
    const input = event.target;
    if (!input.matches('input[type="radio"]')) {
      return;
    }

    const decision = DECISIONS.find((item) => item.id === input.name.replace("lab-decisao-", ""));
    if (!decision) {
      return;
    }

    state.decisionAnswers[decision.id] = input.value;
    state.decisionsChecked = false;
    decisionFeedback.hidden = true;
    root.querySelector('[data-lab-phase="decisoes"] [data-lab-next]').disabled = true;
    renderPreview(decision.id);
  });

  improvedForm.addEventListener("input", (event) => {
    if (event.target.id === "lab-justificativa") {
      updateCharacterCount(
        event.target,
        root.querySelector("[data-lab-justification-count]"),
        MAX_JUSTIFICATION_LENGTH,
        root.querySelector("[data-lab-justification-count-announcement]")
      );
    }
  });

  improvedForm.addEventListener("input", handleFormEdit);
  improvedForm.addEventListener("change", handleFormEdit);

  function handleFormEdit(event) {
    const field = event.target;
    if (field.matches("#lab-disciplina, #lab-avaliacao, #lab-justificativa, #lab-anexo")) {
      const error = root.querySelector(`#${field.id}-erro`);
      if (field.id === "lab-anexo") {
        const file = field.files[0];
        const extension = file && file.name.includes(".")
          ? file.name.split(".").pop().toLowerCase()
          : "";
        if (file && !ALLOWED_EXTENSIONS.includes(extension)) {
          field.setAttribute("aria-invalid", "true");
          error.textContent = "Escolha um arquivo com extensão PDF, PNG ou JPG.";
        } else {
          field.removeAttribute("aria-invalid");
          error.textContent = "";
        }
      } else if (field.value.trim()) {
        field.removeAttribute("aria-invalid");
        error.textContent = "";
      }

      if (!formErrorSummary.hidden) {
        const errors = getFormErrors();
        const errorList = root.querySelector("[data-lab-form-error-list]");
        errorList.replaceChildren();
        errors.forEach(({ control, label, message }) => {
          addErrorLink(errorList, control, label, message);
        });
        formErrorSummary.hidden = errors.length === 0;
      }
    }

    if (state.formReviewed) {
      state.formReviewed = false;
      review.hidden = true;
      setStatus("O formulário foi alterado. Revise as informações novamente.");
    }
  }

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const diagnosisButton = target.closest("[data-lab-check-diagnosis]");
    const decisionsButton = target.closest("[data-lab-check-decisions]");
    const nextButton = target.closest("[data-lab-next]");
    const previousButton = target.closest("[data-lab-previous]");
    const originalSubmitButton = target.closest("[data-lab-original-submit]");
    const reviewButton = target.closest("[data-lab-review-form]");
    const confirmButton = target.closest("[data-lab-confirm]");
    const editButton = target.closest("[data-lab-edit]");
    const restartButton = target.closest("[data-lab-restart]");

    if (diagnosisButton) {
      evaluateDiagnosis();
      return;
    }
    if (decisionsButton) {
      evaluateDecisions();
      return;
    }
    if (originalSubmitButton) {
      const observation = root.querySelector("[data-lab-original-observation]");
      observation.textContent =
        "O botão não apresenta confirmação, erro ou próximo passo. Nenhuma solicitação foi enviada.";
      observation.hidden = false;
      return;
    }
    if (nextButton) {
      const currentIndex = PHASES.indexOf(state.phase);
      const nextPhase = PHASES[currentIndex + 1];
      const canProceed =
        (state.phase !== "diagnostico" || state.diagnosisChecked) &&
        (state.phase !== "decisoes" || state.decisionsChecked);

      if (nextPhase && canProceed) {
        showPhase(nextPhase);
      } else if (!canProceed) {
        setStatus(state.phase === "diagnostico"
          ? "Confira sua leitura das evidências antes de avançar."
          : "Analise suas cinco decisões antes de avançar.");
      }
      return;
    }
    if (previousButton) {
      const previousPhase = PHASES[PHASES.indexOf(state.phase) - 1];
      if (previousPhase) {
        showPhase(previousPhase);
      }
      return;
    }
    if (reviewButton) {
      if (validateImprovedForm()) {
        showReview();
      }
      return;
    }
    if (confirmButton && state.formReviewed) {
      state.simulatedSubmission = true;
      renderResults();
      showPhase("resultado");
      return;
    }
    if (editButton) {
      state.formReviewed = false;
      review.hidden = true;
      root.querySelector("[data-lab-review-form]").focus();
      setStatus("Edite as informações e revise novamente.");
      return;
    }
    if (restartButton) {
      resetExperience();
    }
  });

  renderPreview();
  showPhase("missao");
}
