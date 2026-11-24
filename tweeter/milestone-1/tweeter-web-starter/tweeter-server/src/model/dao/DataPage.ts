// AI-assisted: see AI-ATTRIBUTION.md

export class DataPage<T> {
  readonly values: T[];
  readonly hasMorePages: boolean;

  constructor(values: T[], hasMorePages: boolean) {
    this.values = values;
    this.hasMorePages = hasMorePages;
  }

  get items(): T[] {
    return this.values;
  }

  get hasMore(): boolean {
    return this.hasMorePages;
  }
}
