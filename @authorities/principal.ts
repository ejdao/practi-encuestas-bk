const codeModules = {
  gen: '001',
  enc: '002',
};

export const MODULES = {
  GENERAL: {
    CODE: codeModules.gen,
    SUBS: {
      SEGURIDAD: `${codeModules.gen}001`,
    },
  },
  ENCUESTAS: {
    CODE: codeModules.enc,
    SUBS: {
      BASICO: `${codeModules.enc}001`,
    },
  },
};
