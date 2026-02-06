export type LocalStrageKey = any;

export interface FavoriteColorCount {
  firstColor: string;
  firstColorName: string;
  secondColor: string;
  secondColorName: string;
  mixedColor: string;
  count: number;
}

export const setLocalStorageItem = (key: LocalStrageKey, value: string) => {
  window.localStorage.setItem(key, value);
};

export const removeLocalStorageItem = (key: LocalStrageKey) => {
  window.localStorage.removeItem(key);
};

export const getLocalStorageItem = (key: LocalStrageKey): string | null => {
  return window.localStorage.getItem(key);
};

export const preDefinedColors: Record<string, any> = {
  "#000000": "BLACK",
  "#FFFFFF": "WHITE",
  "#FF0000": "RED",
  "#00FF00": "GREEN",
  "#0000FF": "BLUE",
  "#FFFF00": "YELLOW",
  "#03FFFF": "CYAN",
  "#FFC1CB": "PINK",
  "#808080": "GREY",
  "#C0C0C0": "SILVER",
  "#3F3FA1": "NAVY",
  "#800000": "MAROON",
  "#800080": "PURPLE",
};
