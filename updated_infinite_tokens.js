const stateNode = (function findReactNode(r = document.querySelector("body > div")) {
    if (!r) return null;

    for (const v of Object.values(r)) {
        const node = v?.children?.[0]?._owner?.stateNode;
        if (node) return node;
    }

    const next = r.querySelector(":scope > div");
    return next ? findReactNode(next) : null;
})();

if (!stateNode) {
    console.log("❌ No stateNode found — likely hooks or different React structure");
} else {
    console.log("✅ Found stateNode:", stateNode);

    if (!stateNode.state) {
        console.log("⚠️ Component uses hooks — no .state available");
    } else {
        const tokens = stateNode.state.tokens ?? 0;
        const cost = stateNode.state.cost ?? 1;

        console.log({ tokens, cost, canOpen: Math.floor(tokens / cost) });

        stateNode.setState(prev => ({
            tokens: (prev.tokens ?? 0) + 100000
        }));
    }
}
