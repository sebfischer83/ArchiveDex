function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys.push(...flattenKeys(v as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

describe('i18n catalog parity', () => {
  let en: Record<string, unknown>;
  let de: Record<string, unknown>;
  let ru: Record<string, unknown>;
  let enKeys: string[];
  let deKeys: string[];
  let ruKeys: string[];

  beforeAll(async () => {
    [en, de, ru] = await Promise.all([
      fetch('/base/src/assets/i18n/en.json').then(r => r.json()),
      fetch('/base/src/assets/i18n/de.json').then(r => r.json()),
      fetch('/base/src/assets/i18n/ru.json').then(r => r.json()),
    ]);
    enKeys = flattenKeys(en);
    deKeys = flattenKeys(de);
    ruKeys = flattenKeys(ru);
  });

  it('has the same keys in English and German', () => {
    const onlyInEn = enKeys.filter(k => !deKeys.includes(k));
    const onlyInDe = deKeys.filter(k => !enKeys.includes(k));
    expect(onlyInEn).withContext('keys missing in German').toEqual([]);
    expect(onlyInDe).withContext('keys missing in English').toEqual([]);
  });

  it('has the same keys in English and Russian', () => {
    const onlyInEn = enKeys.filter(k => !ruKeys.includes(k));
    const onlyInRu = ruKeys.filter(k => !enKeys.includes(k));
    expect(onlyInEn).withContext('keys missing in Russian').toEqual([]);
    expect(onlyInRu).withContext('keys missing in English').toEqual([]);
  });

  it('has no empty translation values', () => {
    const allCatalogs = { en, de, ru } as const;
    const emptyKeys: string[] = [];
    for (const [lang, catalog] of Object.entries(allCatalogs)) {
      const keys = flattenKeys(catalog);
      const emptyInLang = keys.filter(k => {
        const parts = k.split('.');
        let current: unknown = catalog;
        for (const p of parts) {
          if (typeof current !== 'object' || current === null) return true;
          current = (current as Record<string, unknown>)[p];
        }
        return typeof current !== 'string' || current.trim().length === 0;
      });
      emptyKeys.push(...emptyInLang.map(k => `${lang}: ${k}`));
    }
    expect(emptyKeys).withContext('empty translation values').toEqual([]);
  });
});
