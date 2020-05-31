import Mark from "./Mark";

export default class Hidden extends Mark {
  get name() {
    return "hidden";
  }

  get schema() {
    return {
      parseDOM: [{ tag: "hidden" }],
      toDOM: () => ["hidden"],
    };
  }
}
