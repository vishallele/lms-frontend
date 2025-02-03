const dictionaries: any = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  hi: () => import('../dictionaries/hi.json').then((module) => module.default)
};

export const getDictionary = async (locale: any) => dictionaries[locale]();