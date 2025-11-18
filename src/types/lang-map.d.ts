declare module 'lang-map' {
  interface LangMap {
    extensions(language: string): string[];
    languages(extension: string): string[];
  }

  const langMap: LangMap;
  export default langMap;
}

