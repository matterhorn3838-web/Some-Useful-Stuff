const { stateNode } = Object.values(
                    (function react(r = document.querySelector("body>div")) {
                        return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div"));
                    })()
const canOpen = Math.floor(stateNode.state.tokens / cost)
const tokens = stateNode.state.tokens
tokens = tokens + 100000
