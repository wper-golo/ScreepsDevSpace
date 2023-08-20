export function createRole(creep_mode: string, count: number, bodyPart: BodyPartConstant[], spawnName: string | number) {
    const creeps = _.filter(Game.creeps, (creep) => creep.memory.role == creep_mode);
    console.log('' + creep_mode + ': ' + creeps.length);
    if(creeps.length < count) {
        const newName = creep_mode + Game.time;
        console.log('Spawning new ' + creep_mode + ': ' + newName);
        Game.spawns[spawnName].spawnCreep(bodyPart, newName,
            {memory: {role: creep_mode}});
        const roomName = Game.spawns[spawnName].room.name
        Game.rooms[roomName].memory.FullyEnergy = false
    }
}

export function calcBodyPart(bodySet: BodySet): BodyPartConstant[] {

// 把身体配置项拓展成如下形式的二维数组
// [ [ TOUGH ]，[ WORK，WORK ]，[ MOVE， MOVE，MOVE ] ]
    const bodys = Object.keys(bodySet).map(type => Array(bodySet[type]).fill(type))// 把二维数组展平
    return [].concat(...bodys)
}