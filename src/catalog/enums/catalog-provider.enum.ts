export enum CatalogProviderType {
  UAPPI = 'uappi',
  OLIST = 'olist',
}

export const DEFAULT_CATALOG_PROVIDER =
  (process.env.DEFAULT_CATALOG_PROVIDER as CatalogProviderType) ??
  CatalogProviderType.UAPPI;

