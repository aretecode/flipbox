const child_process = require('child_process')
const spawn = child_process.spawnSync

// @TODO:
// - [ ] only install ones that are missing
// - [ ] build this script using commander
// - [ ]
module.exports = function(deps) {
  if (!Array.isArray(deps)) deps = [deps]
  console.log('flip: installing missing dependency!')

  const depsToInstall = []
  deps.forEach(dep => {
    try {
      require(dep)
    } catch (e) {
      console.log(e)
      console.log('installing ', dep)
      depsToInstall.push(dep)
    }
  })

  if (depsToInstall.length) {
    spawn('npm', ['install'].concat(depsToInstall), {
      stdio: 'inherit',
    })
  }
}
