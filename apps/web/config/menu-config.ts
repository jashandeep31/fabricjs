export const htmlDocsLinks: {
  title: string;
  links: {
    label: string;
    path: string;
  }[];
}[] = [
  {
    title: "Getting Started",
    links: [
      {
        label: "Introduction",
        path: "/docs/html",
      },
      {
        label: "Installation",
        path: "/docs/html/installation",
      },
    ],
  },

  {
    title: "Objects",
    links: [
      {
        label: "Intro to Objects",
        path: "/docs/html/objects/intro",
      },
      {
        label: "Rectangle",
        path: "/docs/html/objects/rectangle",
      },
      {
        label: "Circle",
        path: "/docs/html/objects/circle",
      },
      {
        label: "Image",
        path: "/docs/html/objects/image",
      },
      {
        label: "Filters",
        path: "/docs/html/objects/filters",
      },
    ],
  },
] as const;
