export const refresh = () => {
  window.location.reload()
}

/**
 * Get first segment of pathname
 * e.g, pathname=/domain/management/b4b17271-f6be-4801-8d6a-1c5a3e663e41,
 * getPath1stSegment(pathname) returns 'domain'
 * @param pathname
 */
export const parsePathSegments = (pathname: string) => {
  return (pathname.split('/').filter(segment => segment !== ''))
}