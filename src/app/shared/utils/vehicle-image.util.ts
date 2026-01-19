const AVAILABLE_IMAGES = [
  'chevrolet_camaro',
  'fiat_doblo',
  'fiat_fiorino',
  'ford_ka',
  'ford_ka_sedan',
  'jeep_compass',
  'mini_cooper',
  'nissan_versa',
  'peugeot_partner',
  'renault_duster',
  'vw_jetta',
  'vw_tcross',
];

const MODEL_TO_IMAGE: Record<string, string> = {
  camaro: 'chevrolet_camaro',
  doblo: 'fiat_doblo',
  fiorino: 'fiat_fiorino',
  ka: 'ford_ka',
  ka_sedan: 'ford_ka_sedan',
  compass: 'jeep_compass',
  mini_cooper: 'mini_cooper',
  versa: 'nissan_versa',
  partner: 'peugeot_partner',
  duster: 'renault_duster',
  jetta: 'vw_jetta',
  tcross: 'vw_tcross',
};

function normalizeModel(model: string): string {
  return model
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s_-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

export function getVehicleImageUrl(modelName: string): string | undefined {
  const key = normalizeModel(modelName);

  const mapped = MODEL_TO_IMAGE[key];
  if (mapped) return `img/${mapped}.png`;

  const matched = AVAILABLE_IMAGES.find(
    (img) =>
      img.endsWith(`_${key}`) ||
      img.includes(`_${key}_`) ||
      img.includes(key),
  );

  return matched ? `img/${matched}.png` : undefined;
}
