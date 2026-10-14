import { visit } from "unist-util-visit";

export default function rehypeFigure() {
  return function (tree) {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName !== "p" ||
        !parent ||
        index === undefined ||
        node.children.length !== 1
      )
        return;

      const img = node.children[0];
      if (img.type !== "element" || img.tagName !== "img") return;

      const next = parent.children[index + 1];
      if (!next || next.tagName !== "p" || next.children.length !== 1) return;

      const em = next.children[0];
      if (em.type !== "element" || em.tagName !== "em") return;

      const caption = em.children[0];
      if (!caption || caption.type !== "text") return;

      const figure = {
        type: "element",
        tagName: "figure",
        properties: {},
        children: [
          img,
          {
            type: "element",
            tagName: "figcaption",
            properties: {},
            children: [caption],
          },
        ],
      };

      parent.children.splice(index, 2, figure);
      return index;
    });
  };
}
