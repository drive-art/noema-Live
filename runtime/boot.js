const { evolve } = require("./evolve");

function act(context) {
  // пример реакции на состояние
  if (context.mode === "live" && context.integrity === "verified") {
    return evolve({
      note: "agent activated",
      state: "active"
    });
  }
}

module.exports = { act };
