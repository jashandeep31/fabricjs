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
        label: "Rectangle",
        path: "/docs/html/objects/rectangle",
      },
      {
        label: "Element",
        path: "/docs/html/element",
      },
    ],
  },
] as const;
