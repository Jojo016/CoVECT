const recast = require('./build/Release/RecastCLI');
console.log("h9")
recast.loadFile('./nav_test.obj');
console.log("i9")
recast.build(0.166, 0.1, 1.7, 0.5, 0.3, 45);
console.log("j10")
recast.save("./navmesh.obj");
console.log("k10")