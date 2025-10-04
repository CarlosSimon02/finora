export type ColorOption = { label: ColorLabel; value: ColorValue };

export const COLOR_OPTIONS = [
  { label: "Green", value: "#277C78" },
  { label: "Yellow", value: "#F2CDAC" },
  { label: "Cyan", value: "#82C9D7" },
  { label: "Navy", value: "#626070" },
  { label: "Red", value: "#C94736" },
  { label: "Purple", value: "#826CB0" },
  { label: "Violet", value: "#AF81BA" },
  { label: "Turquoise", value: "#597C7C" },
  { label: "Brown", value: "#93674F" },
  { label: "Magenta", value: "#934F6F" },
  { label: "Blue", value: "#3F82B2" },
  { label: "Navy Grey", value: "#97A0AC" },
  { label: "Army Green", value: "#7F9161" },
  { label: "Gold", value: "#CAB361" },
  { label: "Orange", value: "#BE6C49" },
] as const;

export type ColorLabel = (typeof COLOR_OPTIONS)[number]["label"];
export type ColorValue = (typeof COLOR_OPTIONS)[number]["value"];

export const COLOR_MAP: Record<ColorLabel, ColorValue> = Object.fromEntries(
  COLOR_OPTIONS.map((c) => [c.label, c.value])
) as Record<ColorLabel, ColorValue>;

export const COLOR_MAP_REVERSE: Record<ColorValue, ColorLabel> =
  Object.fromEntries(COLOR_OPTIONS.map((c) => [c.value, c.label])) as Record<
    ColorValue,
    ColorLabel
  >;
