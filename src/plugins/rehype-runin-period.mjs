// @ts-check
import { visit } from 'unist-util-visit';

/** Append "." to run-in headings (h2/h3) that don't end with "." or "?". */
export default function rehypeRuninPeriod() {
  return function (tree) {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      const last = node.children.at(-1);
      if (!last || last.type !== 'text') return;
      const t = last.value.trimEnd();
      if (t && !t.endsWith('.') && !t.endsWith('?')) {
        last.value = t + '.';
      }
    });
  };
}
