// Interacciones locales equivalentes a la web original. No se guardan datos.
document.documentElement.classList.add('js');

function element<T extends Element>(selector: string): T {
  const found = document.querySelector<T>(selector);
  if (!found) throw new Error(`Falta el elemento requerido: ${selector}`);
  return found;
}

function closest(target: EventTarget | null, selector: string): Element | null {
  return target instanceof Element ? target.closest(selector) : null;
}

const menuToggle = element<HTMLButtonElement>('.menu-toggle');
const navigation = element<HTMLElement>('#main-nav');
const header = element<HTMLElement>('.site-header');
const mobileContactBar = element<HTMLElement>('.mobile-contact-bar');

function updateFixedSpacing(): void {
  const headerBottom = header.getBoundingClientRect().bottom;
  document.documentElement.style.setProperty(
    '--header-offset',
    `${Math.ceil(headerBottom + 16)}px`,
  );
  const barStyle = getComputedStyle(mobileContactBar);
  const contactSpace =
    barStyle.display === 'none'
      ? 0
      : mobileContactBar.getBoundingClientRect().height +
        (parseFloat(barStyle.bottom) || 0) +
        12;
  document.documentElement.style.setProperty(
    '--mobile-cta-space',
    `${Math.ceil(contactSpace)}px`,
  );
}

const fixedElementsObserver = new ResizeObserver(updateFixedSpacing);
fixedElementsObserver.observe(header);
fixedElementsObserver.observe(mobileContactBar);
window.addEventListener('resize', updateFixedSpacing, { passive: true });
void document.fonts.ready.then(updateFixedSpacing);
updateFixedSpacing();
const updateHeaderShadow = (): void => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
};
window.addEventListener('scroll', updateHeaderShadow, { passive: true });
updateHeaderShadow();

function closeMenu(restoreFocus = false): void {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  navigation.classList.remove('is-open');
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navigation.classList.toggle('is-open', open);
});
navigation
  .querySelectorAll('a')
  .forEach((link) => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    menuToggle.getAttribute('aria-expanded') === 'true'
  )
    closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!closest(event.target, '.nav-shell')) closeMenu();
});
window.matchMedia('(min-width: 1051px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

const whatsappNumber = element<HTMLMetaElement>(
  'meta[name="whatsapp-number"]',
).content.replace(/\D/g, '');
function whatsappURL(message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
function contactMessage(link: HTMLAnchorElement): string {
  if (link.dataset.treatment === 'Quiero orientación')
    return 'Hola, Brisa Dental. Me gustaría recibir orientación para saber qué tratamiento necesito.';
  if (link.dataset.treatment)
    return `Hola, Brisa Dental. Me interesa ${link.dataset.treatment.toLowerCase()}. Quisiera solicitar una valoración y conocer su disponibilidad.`;
  if (link.dataset.whatsapp === 'team')
    return 'Hola, Brisa Dental. Me gustaría hablar con su equipo y conocer más sobre su atención.';
  if (link.dataset.whatsapp === 'question')
    return 'Hola, Brisa Dental. Tengo una pregunta antes de agendar mi valoración. ¿Me pueden orientar?';
  return 'Hola, Brisa Dental. Me gustaría agendar una valoración. ¿Me pueden compartir su disponibilidad?';
}
document
  .querySelectorAll<HTMLAnchorElement>('[data-whatsapp]')
  .forEach((link) => {
    link.href = whatsappURL(contactMessage(link));
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const label =
      link.getAttribute('aria-label') ||
      link.textContent?.trim() ||
      'Contactar';
    link.setAttribute(
      'aria-label',
      `${label}${label.includes('WhatsApp') ? '' : ' por WhatsApp'} (abre una nueva pestaña)`,
    );
  });

const fieldSelector = '.field input, .field textarea, .field select';
document.addEventListener('focusin', (event) => {
  document.body.classList.toggle(
    'is-editing-form',
    Boolean(closest(event.target, fieldSelector)),
  );
});
document.addEventListener('focusout', () => {
  requestAnimationFrame(() => {
    document.body.classList.toggle(
      'is-editing-form',
      Boolean(document.activeElement?.closest(fieldSelector)),
    );
  });
});

document
  .querySelectorAll<HTMLInputElement>('.comparison-slider')
  .forEach((slider) => {
    slider.addEventListener('input', () => {
      slider
        .closest<HTMLElement>('.comparison')
        ?.style.setProperty('--position', `${slider.value}%`);
      slider.setAttribute(
        'aria-valuetext',
        `${slider.value}% de la imagen antes visible`,
      );
    });
  });

const testimonialSlides = [
  ...document.querySelectorAll<HTMLElement>('.testimonial-slide'),
];
let activeTestimonial = 0;
document
  .querySelectorAll<HTMLButtonElement>('[data-testimonial]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const step = button.dataset.testimonial === 'next' ? 1 : -1;
      activeTestimonial =
        (activeTestimonial + step + testimonialSlides.length) %
        testimonialSlides.length;
      testimonialSlides.forEach((slide, index) => {
        slide.hidden = index !== activeTestimonial;
      });
      element<HTMLElement>('#testimonial-position').textContent =
        `${String(activeTestimonial + 1).padStart(2, '0')} / ${String(testimonialSlides.length).padStart(2, '0')}`;
    });
  });

const faqItems = [
  ...document.querySelectorAll<HTMLDetailsElement>('.accordion details'),
];
faqItems.forEach((item) =>
  item.addEventListener('toggle', () => {
    if (item.open)
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
  }),
);

type FormField = HTMLInputElement | HTMLSelectElement;
const form = element<HTMLFormElement>('#appointment-form');
const result = element<HTMLElement>('#form-result');
const fields = ['name', 'phone', 'email', 'date', 'treatment'].map((id) =>
  element<FormField>(`#${id}`),
);
const fullName = element<HTMLInputElement>('#name');
const phone = element<HTMLInputElement>('#phone');
const email = element<HTMLInputElement>('#email');
const treatment = element<HTMLSelectElement>('#treatment');
const date = element<HTMLInputElement>('#date');
const note = element<HTMLTextAreaElement>('#message');
const today = new Date();
date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
element<HTMLFieldSetElement>('#appointment-form fieldset').disabled = false;

function validationMessage(field: FormField): string {
  const value = field.value.trim();
  if (field.id === 'name' && value.length < 2)
    return 'Escribe tu nombre, con al menos 2 caracteres.';
  if (field.id === 'phone') {
    const digits = value.replace(/\D/g, '');
    const valid = /^\d{10}$/.test(digits) || /^52\d{10}$/.test(digits);
    if (!valid || !/^[\d\s()+.-]+$/.test(value))
      return 'Escribe 10 dígitos o +52 seguido de 10 dígitos.';
  }
  if (field.id === 'email' && value && field.validity.typeMismatch)
    return 'Revisa que tu correo incluya un nombre y un dominio.';
  if (
    field.id === 'date' &&
    (!value || field.validity.badInput || value < date.min)
  )
    return 'Elige hoy o una fecha posterior.';
  if (field.id === 'treatment' && !value)
    return 'Selecciona un tratamiento o “Quiero orientación”.';
  return '';
}
function validate(field: FormField): boolean {
  const message = validationMessage(field);
  element<HTMLElement>(`#${field.id}-error`).textContent = message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
  return !message;
}
fields.forEach((field) => {
  field.addEventListener('blur', () => {
    if (field.value || field.hasAttribute('aria-invalid')) validate(field);
  });
  field.addEventListener('input', () => {
    if (field.hasAttribute('aria-invalid')) validate(field);
    result.hidden = true;
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const invalid = fields.filter((field) => !validate(field));
  result.hidden = false;
  result.classList.toggle('error', invalid.length > 0);
  if (invalid.length) {
    result.textContent =
      'Revisa los campos indicados para preparar tu solicitud.';
    invalid[0]?.focus();
    return;
  }
  const preferredDay = new Date(`${date.value}T12:00:00`).toLocaleDateString(
    'es-MX',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );
  const message = [
    'Hola, Brisa Dental. Quiero solicitar una valoración.',
    '',
    `Nombre: ${fullName.value.trim()}`,
    `Teléfono: ${phone.value.trim()}`,
    `Tratamiento: ${treatment.value}`,
    `Día de preferencia: ${preferredDay}`,
  ];
  if (email.value.trim()) message.push(`Correo: ${email.value.trim()}`);
  if (note.value.trim()) message.push('', `Mensaje: ${note.value.trim()}`);
  const url = whatsappURL(message.join('\n'));
  const fallback = document.createElement('a');
  fallback.href = url;
  fallback.target = '_blank';
  fallback.rel = 'noopener noreferrer';
  fallback.textContent = 'Abrir WhatsApp';
  result.replaceChildren(
    document.createTextNode(
      'Tu mensaje está preparado. Revísalo y envíalo desde WhatsApp. La cita se confirma con la clínica. ',
    ),
    fallback,
  );
  window.open(url, '_blank', 'noopener,noreferrer');
  result.focus();
});

export {};
