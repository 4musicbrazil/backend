export enum CatalogProviderType {
  UAPPI = 'uappi',
  OLIST = 'olist',
}

export const getDefaultCatalogProvider = (): CatalogProviderType => {
  const provider = process.env.DEFAULT_CATALOG_PROVIDER?.toLowerCase();

  if (provider === CatalogProviderType.UAPPI) {
    return CatalogProviderType.UAPPI;
  }

  return CatalogProviderType.OLIST;
};
