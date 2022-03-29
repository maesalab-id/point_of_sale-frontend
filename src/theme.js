export const colors = {
  "black": "#1b1f23",
  "white": "#fff",
  "gray": ["#fafbfc", "#f6f8fa", "#e1e4e8", "#d1d5da", "#959da5", "#6a737d", "#586069", "#444d56", "#2f363d", "#24292e"],
  "blue": ["#f1f8ff", "#dbedff", "#c8e1ff", "#79b8ff", "#2188ff", "#0366d6", "#005cc5", "#044289", "#032f62", "#05264c"],
  "green": ["#f0fff4", "#dcffe4", "#bef5cb", "#85e89d", "#34d058", "#28a745", "#22863a", "#176f2c", "#165c26", "#144620"],
  "yellow": ["#fffdef", "#fffbdd", "#fff5b1", "#ffea7f", "#ffdf5d", "#ffd33d", "#f9c513", "#dbab09", "#b08800", "#735c0f"],
  "orange": ["#fff8f2", "#ffebda", "#ffd1ac", "#ffab70", "#fb8532", "#f66a0a", "#e36209", "#d15704", "#c24e00", "#a04100"],
  "red": ["#ffeef0", "#ffdce0", "#fdaeb7", "#f97583", "#ea4a5a", "#d73a49", "#cb2431", "#b31d28", "#9e1c23", "#86181d"],
  "purple": ["#f5f0ff", "#e6dcfd", "#d1bcf9", "#b392f0", "#8a63d2", "#6f42c1", "#5a32a3", "#4c2889", "#3a1d6e", "#29134e"],
  "pink": ["#ffeef8", "#fedbf0", "#f9b3dd", "#f692ce", "#ec6cb9", "#ea4aaa", "#d03592", "#b93a86", "#99306f", "#6d224f"]
}

export const spacing = [
  0,
  4,
  8,
  16,
  24,
  32,
  40,
  48
]

export const typography = {
  "fontSizes": [
    12,
    14,
    16,
    20,
    24,
    32,
    40,
    48
  ],
  "lineHeights": {
    "condensedUltra": 1,
    "condensed": 1.25,
    "default": 1.5
  }
}

export const fonts = {
  "body": '-apple-system, "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", "Icons16", "Montserrat", sans-serif',
  "monospace": 'Menlo, monospace'
}

export const breakpoints = ['40em', '52em', '64em', '80em'];

export const container = ["100%", breakpoints[0], breakpoints[1], breakpoints[2], breakpoints[3]];
container.fluid = container[0];
container.sm = container[1];
container.md = container[2];
container.lg = container[3];
container.xl = container[4];

export default { // eslint-disable-line import/no-anonymous-default-export
  breakpoints,
  colors,
  spacing,
  typography,
  fonts,
  container
}