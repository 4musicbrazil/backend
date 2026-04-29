export enum CatalogProviderType {
  UAPPI = 'uappi',
  OLIST = 'olist',
}

export const getDefaultCatalogProvider = (): CatalogProviderType => {
  const provider = process.env.DEFAULT_CATALOG_PROVIDER?.toLowerCase();

  if (provider === CatalogProviderType.OLIST) {
    return CatalogProviderType.OLIST;
  }

  return CatalogProviderType.UAPPI;
};
