/**
 * Tagged template literal function for CSS strings.
 * 主要目的是讓 VSCode 的 styled-components 套件能辨識並 highlight/format CSS 語法。
 * 實際上只是把 template literal 的字串和插值串接在一起。
 *
 * @example
 * const style = css`
 *   color: red;
 *   font-size: ${fontSize}px;
 * `;
 */
function css(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
}

export default css;
