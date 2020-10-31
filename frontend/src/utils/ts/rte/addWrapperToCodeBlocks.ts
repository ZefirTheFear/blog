const addWrapperToCodeBlock = (html: string, position = 0): string => {
  const targetPrefixStr = "<pre><code";
  const targetPostfixStr = "</code></pre>";
  const newPrefixStr = "<div class='content-code-block-wrapper'>" + String.fromCharCode(10);
  const newPostfixStr = "</div>" + String.fromCharCode(10);
  const targetIntermediateStr = targetPostfixStr + String.fromCharCode(10) + targetPrefixStr;

  const targetPrefixIndex = html.indexOf(targetPrefixStr, position);
  if (targetPrefixIndex < 0) return html;

  let tempArray = html.split("");
  tempArray.splice(targetPrefixIndex, 0, newPrefixStr);
  let newHtml = tempArray.join("");

  let index = targetPrefixIndex;
  while (true) {
    const targetIntermediateIndex = newHtml.indexOf(targetIntermediateStr, index);
    const targetPostfixIndex = newHtml.indexOf(targetPostfixStr, index);
    index = targetPostfixIndex + 1;
    if (targetPostfixIndex !== targetIntermediateIndex) break;
  }
  tempArray = newHtml.split("");
  tempArray.splice(index + targetPostfixStr.length, 0, newPostfixStr);
  newHtml = tempArray.join("");

  index += targetPostfixStr.length + newPostfixStr.length - 1;
  const nextTargetPrefixIndex = newHtml.indexOf(targetPrefixStr, index);
  if (nextTargetPrefixIndex === -1) {
    return newHtml;
  } else {
    return addWrapperToCodeBlock(newHtml, index);
  }
};

export default addWrapperToCodeBlock;
