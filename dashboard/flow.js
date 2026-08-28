window.Flow = (function () {
  function renderStageFlow(container, stages) {
    const tr = window.I18N.tr;
    container.innerHTML = "";

    stages.forEach((stage, i) => {
      const el = document.createElement("div");
      el.className = "stage";
      el.innerHTML = `
        <span class="stage-num">${stage.num}</span>
        <span class="stage-name">${tr(stage.label)}</span>
        <span class="stage-metric">${tr(stage.metric)} · —</span>
      `;
      el.dataset.stage = stage.id;
      container.appendChild(el);

      if (i < stages.length - 1) {
        const link = document.createElement("span");
        link.className = "stage-link";
        link.innerHTML = `<span class="packet" style="animation-delay:${(i * 0.22).toFixed(2)}s"></span>`;
        container.appendChild(link);
      }
    });
  }

  function updateStageFlow(container, readings) {
    readings.forEach((r) => {
      const el = container.querySelector(`[data-stage="${r.stage.id}"] .stage-metric`);
      if (!el) return;
      const tr = window.I18N.tr;
      el.textContent = `${tr(r.stage.metric)} · ${r.value}${r.stage.unit}`;
      const node = el.closest(".stage");
      if (r.bad) {
        node.classList.add("is-alert");
      } else {
        node.classList.remove("is-alert");
      }
    });
  }

  return { renderStageFlow, updateStageFlow };
})();
