
export function getBoundingBox(e) {
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