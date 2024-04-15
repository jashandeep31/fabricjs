export type SimplePropertyTableRow = {
  name: string;
  type: string;
  attribute: string;
  hasTable: false;
  description: string;
};

export type ComplexPropertyTableRow = {
  name: string;
  type: string;
  attribute: string;
  hasTable: true;
  description: ComplexPropertyTableRow[];
};

export type PropertyTableRow = SimplePropertyTableRow | ComplexPropertyTableRow;

export type Property = {
  name: string;
  uniqueId: string;
  completeUrl: string;
  prevUrl: string;
  description: string;
  table: PropertyTableRow[];
};
