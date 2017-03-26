"use strict";

module.exports = class PresetDefaultsRollup {
  setArgs(args) {
    if (args) this.args = args;
    return this;
  }
  // this would also need to check if it has already been added...
  decorate(context, workflow) {
    context.presets.useAll({
      target: null,
      library: null,
      progress: null
    });
  }
};