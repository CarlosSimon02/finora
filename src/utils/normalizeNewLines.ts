const normalizeNewLines = (key: string) => {
  return key.replace(/\\n/g, "\n");
};

export default normalizeNewLines;
