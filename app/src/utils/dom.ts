import * as axios from 'axios';


/**
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
  let ua;
  try {
    ua = window.navigator.userAgent;
  } catch (e) {
      return true;
  }
  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }
  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }
  return false;
}

export function imagePreload() {
  const images: string[] = [
    'https://res.cloudinary.com/dvr87tqip/image/upload/v1487601495/host_small_cxc5vr.png',
    'https://res.cloudinary.com/dvr87tqip/image/upload/v1487601514/host_small_hover_cfpel5.png',
    'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860428/host_br_klz6yq.svg',
    'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860496/host_br_fill_r9lbq4.svg',
    'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860532/host_tab_odxix3.svg',
    'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860569/host_tab_selected_xkl3d4.svg',
    'https://res.cloudinary.com/dvr87tqip/image/upload/v1486860597/host_tab_fill_nrjy2l.svg',
  ];
  images.forEach((image) => {
    const preloadImage = new Image();
    preloadImage.src = image;
  });
}
