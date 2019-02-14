export function deepFreeze<T extends object>(object: T): T {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  for (const name of propNames) {
    const value = object[name];

    object[name] =
      value && typeof value === "object" ? deepFreeze(value) : value;
  }

  return Object.freeze(object);
}
