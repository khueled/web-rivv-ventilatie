import { selfCheckUrl } from '../utils/whatsapp.js';

export function initSelfCheck() {
  const form = document.querySelector('[data-check]');
  if (!form) return;

  const boxes = [...form.querySelectorAll('input[type="checkbox"]')];
  const verdict = form.querySelector('[data-verdict]');
  const cta = form.querySelector('[data-check-cta]');
  if (!verdict || !cta) return;

  // The self-check sends answers through its link, without submitting a form.
  form.addEventListener('submit', (event) => event.preventDefault());

  const update = () => {
    const symptoms = boxes.filter((box) => box.checked).map((box) => box.value);
    cta.href = selfCheckUrl(symptoms);
    verdict.classList.toggle('is-alert', symptoms.length > 0);

    if (!symptoms.length) {
      verdict.textContent = 'Vink aan wat je herkent.';
      return;
    }

    const count = document.createElement('b');
    count.textContent = `${symptoms.length} ${symptoms.length === 1 ? 'teken' : 'tekens'}`;
    verdict.replaceChildren(
      count,
      ' dat je ventilatie aan een reiniging toe is.',
    );
  };

  form.addEventListener('change', update);
  update();
}
