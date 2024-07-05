let modules = [];
if (import.meta && import.meta?.glob) {
  modules = import.meta?.glob('./**/*.ts');
}

export default modules.map((o) => o.default);
