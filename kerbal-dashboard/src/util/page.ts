import { toast } from "./toast";

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

export const copyToClipboard = (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  try {
    document.execCommand('copy')
    toast({
      title: 'Address Copied Successfully',
      status: 'success',
      duration: 2000,
      position: 'top',
      isClosable: true
    })
  } catch (err) {
    toast({
      title: `Unable to copy: ${err}`,
      status: 'error',
      duration: 2000,
      position: 'top',
      isClosable: true
    })
  }
  document.body.removeChild(textarea)
}