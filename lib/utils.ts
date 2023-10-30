import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function camelToSnake(input: any): any {
  if (Array.isArray(input)) {
    return input.map((item) => camelToSnake(item));
  } else if (typeof input === "object" && input !== null) {
    const newObject: { [key: string]: any } = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const newKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`,
        );
        newObject[newKey] = camelToSnake(input[key]);
      }
    }
    return newObject;
  }
  return input;
}

export function snakeToCamel(input: any): any {
  if (Array.isArray(input)) {
    return input.map((item) => snakeToCamel(item));
  } else if (typeof input === "object" && input !== null) {
    const newObject: { [key: string]: any } = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const newKey = key.replace(/_([a-z])/g, (match, letter) =>
          letter.toUpperCase(),
        );
        newObject[newKey] = snakeToCamel(input[key]);
      }
    }
    return newObject;
  }
  return input;
}
