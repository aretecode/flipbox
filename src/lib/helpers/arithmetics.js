const ArithmeticStringParser = require('fuse-box/dist/commonjs/ArithmeticStringParser.js')

// handle if there are multiple bundles
// translate into arithmetics
// translate into webpack

// > index.js [**/*.js] - Bundle everything without dependencies, and execute index.js
// [lib/*.js] +path +fs - Bundle all files in lib folder, ignore node modules except for path and fs
// [**/*.js] - Bundle everything without dependencies
// **/*.js - Bundle everything with dependencies
// **/*.js -path - Bundle everything with dependencies except for module path

class FluentBundle {
  // public array cmds
  // public string name
  // public string str
  // public object instr

  constructor(name, arithmetics) {
    this.noDeps = false
    this.cmds = []
    this.instr = {}
    this.str = ``
    this.name = name
    this.arithmetics = arithmetics
  }

  finishBundle() {
    return this.arithmetics
  }
  addCmd(cmd, bundle) {
    this.cmds.push({
      bundle,
      cmd: 'execute',
    })
    return this
  }

  // raw cmd
  and(cmd) {
    this.str += cmd
    return this
  }

  // should add support to make it not need to take in the bundle
  execute(bundle) {
    this.addCmd('execute', bundle)
    this.str = `>` + bundle
    return this
  }
  add(bundle) {
    this.addCmd('add', bundle)
    if (this.noDeps)
      this.str += `\n +[${bundle}]`
    else
      this.str += `\n +${bundle}`

    return this
  }
  include(dep) {
    this.str += `\n +${dep}`
    return this
  }
  exclude(dep) {
    this.str += `\n -${dep}`
    return this
  }
  ignore(dep) {
    this.str += `\n -${dep}`
    return this
  }

  // same
  ignoreDeps() {
    this.noDeps = true
    return this
  }
  excludeDeps() {
    this.noDeps = true
    return this
  }
  deps(bool) {
    // if true, we do not ignore
    // if false, we do ignore
    this.noDeps = !bool
    return this
  }
  includeDeps() {
    this.noDeps = false
    return this
  }
}

class FluentArithmetics {
  constructor() {
    this.bundled = {}
  }

  // name is also output place if multiple
  startBundle(name) {
    this.bundled[name] = new FluentBundle(name, this)
    return this.bundled[name]
  }

  finish() {
    const keys = Object.keys(this.bundled)
    let instructions = {}
    if (keys.length > 1) {
      keys.forEach(key => {
        const instruction = this.bundled[key]
        instructions[key] = instruction.str
      })
    } else {
      instructions = this.bundled[keys[0]].str
    }
    return instructions
  }
}

const fuse = new FluentArithmetics()

const result = fuse
  .startBundle('coolbundle')
  .ignoreDeps()
  .and('>ooo.js')
  .add('ahhhh.js')
  .add('fuse.magic.ts')
  .add('*/**.js')
  .include('path')
  .include('fs')
  .finishBundle()

const singleBundle = result.finish()

const multipleBundles = result
  .startBundle('webworker')
  .includeDeps()
  .execute('/src/eh.js')
  .add('webworkerfile.js')
  .exclude('fs')
  .finishBundle()
  .finish()

// console.log(result, singleBundle, multipleBundles)
console.assert(typeof singleBundle === 'string', 'result with single is string')
console.assert(typeof multipleBundles === 'object', 'result with multi isobj')

// console.log(ArithmeticStringParser)
const parser = new ArithmeticStringParser.PropParser(singleBundle)
const parsed = parser.parse(singleBundle)
// console.log(parser)
console.log(parsed)

module.exports = {
  ArithmeticStringParser,
  FluentArithmetics,
  FluentBundle,
}
