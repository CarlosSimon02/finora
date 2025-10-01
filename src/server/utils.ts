export const treeToFieldErrors = (
  tree: any,
  path: string = "",
  acc: Record<string, string | undefined> = {}
): Record<string, string | undefined> => {
  const firstError: string | undefined = Array.isArray(tree?.errors)
    ? tree.errors[0]
    : undefined;
  if (path && firstError) {
    acc[path] = firstError;
  }
  if (tree?.properties && typeof tree.properties === "object") {
    for (const key of Object.keys(tree.properties)) {
      treeToFieldErrors(
        tree.properties[key],
        path ? `${path}.${key}` : key,
        acc
      );
    }
  }
  if (Array.isArray(tree?.items)) {
    tree.items.forEach((item: any, index: number) => {
      if (!item) return;
      const nextPath = path ? `${path}[${index}]` : `[${index}]`;
      treeToFieldErrors(item, nextPath, acc);
    });
  }
  return acc;
};
