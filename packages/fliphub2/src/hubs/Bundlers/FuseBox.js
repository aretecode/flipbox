const ChainedMapExtendable = require('flipchain/ChainedMapExtendable')
const timer = require('fliptime')
const Config = require('./Config')

module.exports = class FuseBox extends ChainedMapExtendable {
  constructor(parent, context) {
    super(parent)
    this.context = context
    this.config = new Config(this)
  }
  toConfig() { return this.config.toConfig() }

  // @TODO: this should be in a `.toFuseBox`
  build() {
    timer.start('fusebox')
    const config = this.config.toConfig()
    const {FuseBox, HTMLPlugin} = require('fsbx')
    const {name, root} = this.context

    const entry = config.entry.replace('./', '')
    const {plugins} = config

    config.output = 'dist/$name.js'
    config.log = config.debug = true
    config.homeDir = root
    // config.cache = false

    const fuse = FuseBox.init(config)

    fuse.bundle(name)
      // .sourceMaps(true)
      // .watch('server/**') // watch only server related code.. bugs up atm
      .instructions(`> [${entry}]`)
      // .instructions(`*.js`)
      // Execute process right after bundling is completed
      // launch and restart express
      // .completed(proc => proc.start())
      .completed(proc => {
        timer.stop('fusebox').log('fusebox')
      })
    return fuse.run()
  }
}
