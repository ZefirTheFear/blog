export default (html: string, position: number): string => {
  if (!html.includes("<pre><code") || position < 0) {
    return html;
  }

  const firstEntry = html.indexOf("<pre><code");
  const tempArray = html.split("");
  tempArray.splice(firstEntry, 0, "<div className='rte-code-block-wrapper'>");
  const newHtml = tempArray.join("");

  return newHtml;
};
