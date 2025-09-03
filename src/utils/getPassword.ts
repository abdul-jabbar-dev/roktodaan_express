const getPasswordFromObject = (
  doc: Record<string, unknown>
): [string, string] => {
  const getPasswordField = (
    obj: Record<string, unknown>,
    currentPath: string[] = []
  ): [string, string] | undefined => {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (key.toLowerCase() === "password") {
        return [[...currentPath, key].join("."), value as string];
      }

      if (value && typeof value === "object" && !Array.isArray(value)) {
        const nested = getPasswordField(value as Record<string, unknown>, [
          ...currentPath,
          key,
        ]);
        if (nested !== undefined) {
          return nested;
        }
      }
    }
    return undefined;
  };

  if (!doc || Object.keys(doc).length < 1) {
    throw new Error("No Data Inserted");
  }

  const result = getPasswordField(doc);

  if (!result || typeof result[1] !== "string" || result[1].trim() === "") {
    throw new Error("Password Required!");
  }

  return result;
};
export const setPasswordInStringPath = (
  obj: Record<string, unknown>,
  path: string,
  newValue: string
): Record<string, unknown> => {
  const keys = path.split(".");
  let curr: any = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!(k in curr)) curr[k] = {};
    curr = curr[k];
  }

  curr[keys[keys.length - 1]] = newValue;
  return obj;
};
export default getPasswordFromObject;
