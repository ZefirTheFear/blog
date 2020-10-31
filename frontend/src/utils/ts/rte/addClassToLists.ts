const addClassToLists = (html: string, position = 0): string => {
  const targetULStr = "<ul";
  const targetOLStr = "<ol";
  const newPrefixULStr = ' class="content-ul"';
  const newPrefixOLStr = ' class="content-ol"';

  let newHtml = html;
  let ulIndex = position;
  while (true) {
    const targetULIndex = newHtml.indexOf(targetULStr, ulIndex);
    if (targetULIndex === -1) break;
    let tempArray = newHtml.split("");
    tempArray.splice(targetULIndex + targetULStr.length, 0, newPrefixULStr);
    newHtml = tempArray.join("");
    ulIndex = targetULIndex + newPrefixULStr.length + 1;
  }

  let olIndex = position;
  while (true) {
    const targetOLIndex = newHtml.indexOf(targetOLStr, olIndex);
    if (targetOLIndex === -1) break;
    let tempArray = newHtml.split("");
    tempArray.splice(targetOLIndex + targetOLStr.length, 0, newPrefixOLStr);
    newHtml = tempArray.join("");
    olIndex = targetOLIndex + newPrefixOLStr.length + 1;
  }

  return newHtml;
};

export default addClassToLists;
