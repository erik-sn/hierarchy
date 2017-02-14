
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

export function detectIE() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }
  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }
  return false;
}