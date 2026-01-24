const stateNode = (function findReactNode(r = document.querySelector("body > div")) {
    if (!r) return null;

    const values = Object.values(r);

    for (const v of values) {
        if (v?.children?.[0]?._owner?.stateNode) {
            return v.children[0]._owner.stateNode;
        }
    }

    return findReactNode(r.querySelector(":scope > div"));
})();

if (!stateNode || !stateNode.state) {
    console.log("React stateNode not found");
} else {
    const tokens = stateNode.state.tokens ?? 0;
    const cost = stateNode.state.cost ?? 1; // fallback to avoid NaN

    const canOpen = Math.floor(tokens / cost);
    const newTokens = stateNode.setState({tokens: tokens + 100000})
}
