
/**
 * 
 * 
 * @export
 * @param {*} e
 * @returns
 */
export default function getBoundingBox(e: any) {
  const dropdownRight = e.target.getBoundingClientRect().right;
  const dropdownX = e.target.getBoundingClientRect().left;
  return {
    dropdownX,
    dropdownRight,
    dropdownY: e.target.getBoundingClientRect().bottom,
    windowWidth: window.innerWidth,
    elementWidth: dropdownRight - dropdownX,
  };
}



export function getCookie(name: string): string {
  // add type check for document so test environment can
  // be run successfully on server side
  const doc: any = typeof document === 'undefined' ? '' : document;
  if (doc && doc.cookie && doc.cookie !== '') {
    for (const cookie of doc.cookie.split(';')) {
      // Does this cookie string begin with the name we want?
      if (cookie.trim().substring(0, name.length + 1) === (name + '=')) {
          return decodeURIComponent(cookie.trim().substring(name.length + 1));
      }
    }
  }
}