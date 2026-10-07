// Contenido conservado de la web HTML original.

export interface TreatmentsItem {
  image: string;
  width: number;
  height: number;
  alt: string;
  title: string[];
  description: string;
  treatment: string;
  ariaLabel: string;
}
export const treatments: TreatmentsItem[] = [
  {
    image: '/assets/images/service-image-1.webp',
    width: 1200,
    height: 800,
    alt: 'Revisión dental en el consultorio',
    title: ['Limpieza y prevención'],
    description:
      'Dale a tu sonrisa un espacio de cuidado con una revisión y atención preventiva personalizada.',
    treatment: 'Limpieza y prevención',
    ariaLabel: 'Solicitar valoración de limpieza y prevención',
  },
  {
    image: '/assets/images/service-image-2.webp',
    width: 1200,
    height: 800,
    alt: 'Profesional realizando una valoración dental',
    title: ['Brackets y alineadores'],
    description:
      'Conoce las opciones de ortodoncia y encuentra, junto con el equipo, la alternativa indicada para ti.',
    treatment: 'Brackets y alineadores',
    ariaLabel: 'Solicitar valoración de brackets y alineadores',
  },
  {
    image: '/assets/images/service-image-3.webp',
    width: 1200,
    height: 800,
    alt: 'Dentista atendiendo a una paciente',
    title: ['Implantes dentales'],
    description:
      'Platiquemos sobre tus necesidades y las alternativas para reemplazar piezas dentales.',
    treatment: 'Implantes dentales',
    ariaLabel: 'Solicitar valoración de implantes dentales',
  },
  {
    image: '/assets/images/service-image-4.webp',
    width: 1200,
    height: 800,
    alt: 'Paciente acompañada por una profesional dental',
    title: ['Extracciones dentales'],
    description:
      'Recibe una valoración y una explicación clara de los pasos de tu atención.',
    treatment: 'Extracciones dentales',
    ariaLabel: 'Solicitar valoración de extracciones dentales',
  },
];

export interface TeamItem {
  image: string;
  width: number;
  height: number;
  alt: string;
  title: string[];
  description: string;
}
export const team: TeamItem[] = [
  {
    image: '/assets/images/team-image-1.webp',
    width: 400,
    height: 365,
    alt: 'Retrato ilustrativo del primer integrante del equipo dental',
    title: ['Dr. Andrés Navarro'],
    description: 'Odontología integral',
  },
  {
    image: '/assets/images/team-image-2.webp',
    width: 400,
    height: 365,
    alt: 'Retrato ilustrativo de una integrante del equipo dental',
    title: ['Dra. Mariana Ríos'],
    description: 'Ortodoncia',
  },
  {
    image: '/assets/images/team-image-3.webp',
    width: 400,
    height: 365,
    alt: 'Retrato ilustrativo del tercer integrante del equipo dental',
    title: ['Dr. Diego Salazar'],
    description: 'Rehabilitación oral',
  },
];

export interface StoriesItem {
  image: string;
  width: number;
  height: number;
  alt: string;
  title: string[];
  description: string;
  label: string;
}
export const stories: StoriesItem[] = [
  {
    image: '/assets/images/case-study-image-1.webp',
    width: 1200,
    height: 800,
    alt: 'Paciente recibiendo atención en el consultorio',
    title: ['Volver a sonreír', 'con confianza'],
    description:
      'Una conversación sobre necesidades, expectativas y opciones de atención.',
    label: 'CONFIANZA',
  },
  {
    image: '/assets/images/case-study-image-2.webp',
    width: 1200,
    height: 800,
    alt: 'Dentista realizando una revisión a su paciente',
    title: ['Dar el', 'primer paso'],
    description: 'Una valoración para entender por dónde empezar.',
    label: 'ACOMPAÑAMIENTO',
  },
  {
    image: '/assets/images/case-study-image-3.webp',
    width: 1200,
    height: 800,
    alt: 'Profesional concentrado durante una consulta dental',
    title: ['Cuidar', 'a largo plazo'],
    description:
      'Acompañamiento para mantener el cuidado de tu sonrisa presente.',
    label: 'CONTINUIDAD',
  },
];

export interface JournalItem {
  image: string;
  width: number;
  height: number;
  alt: string;
  title: string[];
  description: string;
  label: string;
}
export const journal: JournalItem[] = [
  {
    image: '/assets/images/post-1.webp',
    width: 1366,
    height: 768,
    alt: 'Dentista acompañando a una paciente en su valoración',
    title: ['Tu primera valoración: qué puedes preguntar'],
    description:
      'Prepara tus dudas sobre el proceso, las opciones y el presupuesto.',
    label: 'TU PRIMERA VISITA',
  },
  {
    image: '/assets/images/post-2.webp',
    width: 1366,
    height: 768,
    alt: 'Revisión ilustrativa en una consulta dental',
    title: ['Brackets o alineadores: empieza por una valoración'],
    description:
      'Una conversación con el equipo puede ayudarte a entender tus opciones.',
    label: 'CONOCE TUS OPCIONES',
  },
  {
    image: '/assets/images/post-3.webp',
    width: 1366,
    height: 768,
    alt: 'Paciente conversando con el profesional durante su consulta',
    title: ['El cuidado de tu sonrisa también es una conversación'],
    description:
      'Habla de tus hábitos, inquietudes y expectativas durante tu visita.',
    label: 'CUIDADO CERCANO',
  },
];
