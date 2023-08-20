'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// choose a best container
function Get_container(creep) {
    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER; }
    });
    // console.log("DEBUG:",creep.memory.role, "//", containers)
    // 找到不到containers 返回 undefined
    if (containers == null) {
        return undefined;
    }
    const closest_container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER; }
    });
    // 找不到 closest_container 返回 undefined
    if (closest_container == null) {
        return undefined;
    }
    if (closest_container.store.getFreeCapacity() < (CONTAINER_CAPACITY * 3 / 4)) {
        return closest_container;
    }
    // 返回储量最大的container
    let cap_dic = {};
    for (let container of containers) {
        cap_dic[container.id] = container.store.getFreeCapacity();
    }
    const keys = Object.keys(cap_dic);
    const lowest = Math.min.apply(null, keys.map(function (x) {
        return cap_dic[x];
    }));
    const min_cont_keys = keys.filter(function (y) {
        return cap_dic[y] === lowest;
    });
    for (const min_cont_key of min_cont_keys) {
        // console.log("Best Container's id:"+ min_cont_key)
        return Game.getObjectById(min_cont_key);
    }
}

function findClosestSourceWithEnergy(creep) {
    const sourcesWithEnergy = creep.room.find(FIND_SOURCES, {
        filter: (source) => source.energy > 0
    });
    if (sourcesWithEnergy.length > 0) {
        const closestSource = creep.pos.findClosestByRange(sourcesWithEnergy);
        return closestSource;
    }
    return null;
}
function Harvest_From_Container(creep) {
    const container = Get_container(creep);
    if (container == undefined || container.store[RESOURCE_ENERGY] == 0) {
        return false;
    }
    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
}
function Harvest_from_energy(creep) {
    // return false
    if (creep.memory.dst == null) {
        const energy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (energy == null || energy.pos.roomName != creep.pos.roomName) {
            console.log("Can't find Energy!");
            return false;
        }
        // console.log("Debug:",energy)
        creep.memory.dst = energy.id;
    }
    const energy = Game.getObjectById(creep.memory.dst);
    if (energy == undefined) {
        // console.log("Can't find creep.dst Energy!")
        return false;
    }
    // if (energy.pos != creep.pos) {
    //     creep.moveTo(energy, {visualizePathStyle: {stroke: '#ffaa00'}});
    // }
    // if(energy.pos == creep.pos){
    //     creep.memory.dst = null
    // }
    creep.say("Egy🤤");
    if (creep.pickup(energy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(energy, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
}
function Harvest_From_Storage(creep) {
    const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_STORAGE &&
                structure.store.getCapacity() > 0;
        }
    });
    console.log("DEBUG:trans", storage);
    if (storage == undefined || storage.store[RESOURCE_ENERGY] == 0) {
        return false;
    }
    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
}
// 原始 Harvest 模式
function Harvest_org(creep) {
    // const source = creep.pos.findClosestByRange(FIND_SOURCES);
    const source = findClosestSourceWithEnergy(creep);
    if (source == undefined || source.energy == 0) {
        return false;
    }
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
    return true;
}
/**

 *  Harvest 具有优先级
 *  先收集 掉落的energy
 *  再收集 container
 *  最后防止出问题，对resource本身直接harvest

 * **/
function Harvest_advance(creep) {
    if (Harvest_from_energy(creep) == false) {
        if (Harvest_From_Container(creep) == false) {
            if (Harvest_org(creep)) {
                // 触发原始harvest模式 , 报警
                creep.say("❗Warning❗");
                console.log(creep.memory.role, "Warning❗: 触发原始harvest模式");
            }
            // 无法收集资源报错
            creep.say("❗❗ERROR❗❗");
            console.log(creep.memory.role, "Error❗❗: 资源无法获取");
        }
    }
}
function Harvest_Transporter(creep) {
    if (Harvest_from_energy(creep) == false) {
        if (Harvest_From_Container(creep) == false) {
            if (Harvest_From_Storage(creep) == false) {
                if (Harvest_org(creep) == false) {
                    // 触发原始harvest模式 , 报警
                    creep.say("❗Warning❗");
                    console.log(creep.memory.role, "Warning❗: 触发原始harvest模式");
                }
            }
            // 无法收集资源报错
            creep.say("❗❗ERROR❗❗");
            console.log(creep.memory.role, "Error❗❗: 资源无法获取");
        }
    }
}

class roleBuilder {
}
/** @param {Creep} creep **/
roleBuilder.run = function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.building = false;
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
        creep.memory.building = true;
    }
    if (creep.memory.building) {
        const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (target) {
            creep.say('Bd:🚧');
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
    else {
        creep.say('Bd:🔄');
        Harvest_advance(creep);
    }
    // Unused_Move(creep)
};

class roleHarvester {
}
/** @param {Creep} creep **/
roleHarvester.run = function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
    else {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};
// module.exports = roleHarvester;

class roleUpgrader {
}
/** @param {Creep} creep **/
roleUpgrader.upgrade = function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.upgrading = false;
        // creep.say('🔄');
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
        creep.memory.upgrading = true;
        // creep.say("🆙");
    }
    if (creep.memory.upgrading) {
        creep.say("UG:🆙");
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
    else {
        creep.say('UG:🔄');
        Harvest_advance(creep);
    }
    // Unused_Move(creep)
};

function createRole(creep_mode, count, bodyPart, spawnName) {
    const creeps = _.filter(Game.creeps, (creep) => creep.memory.role == creep_mode);
    console.log('' + creep_mode + ': ' + creeps.length);
    if (creeps.length < count) {
        const newName = creep_mode + Game.time;
        console.log('Spawning new ' + creep_mode + ': ' + newName);
        Game.spawns[spawnName].spawnCreep(bodyPart, newName, { memory: { role: creep_mode } });
        const roomName = Game.spawns[spawnName].room.name;
        Game.rooms[roomName].memory.FullyEnergy = false;
    }
}
function calcBodyPart(bodySet) {
    // 把身体配置项拓展成如下形式的二维数组
    // [ [ TOUGH ]，[ WORK，WORK ]，[ MOVE， MOVE，MOVE ] ]
    const bodys = Object.keys(bodySet).map(type => Array(bodySet[type]).fill(type)); // 把二维数组展平
    return [].concat(...bodys);
}

// function Source_Not_Fully_Using (source) : boolean {
// function Have_Container(creep):boolean{
//     const range = 1
//     const containers = creep.room.find(FIND_STRUCTURES, {
//         filter: (structure) => {
//             return (structure.structureType === STRUCTURE_CONTAINER &&
//                 structure.pos.x >= creep.memory.dst.x - range &&
//                 structure.pos.x <= creep.memory.dst.x + range &&
//                 structure.pos.y >= creep.memory.dst.y - range &&
//                 structure.pos.y <= creep.memory.dst.y + range);
//         }
//     })
//     if (containers){
//         return true
//     }else{
//         return false
//     }
// }
// Init room.memory.sourceCache if undefined
function Init_Source_Cache(room) {
    let sources = room.find(FIND_SOURCES);
    if (Object.keys(room.memory.sourceCache).length != sources.length) {
        room.memory.sourceCache = {};
        for (let source of sources) {
            room.memory.sourceCache[source.id] = false;
        }
    }
}
// Find Idle source
function Find_Idle_Source(creep) {
    Init_Source_Cache(creep.room);
    let sources = creep.room.find(FIND_SOURCES);
    for (let source of sources) {
        if (creep.room.memory.sourceCache[source.id] == false) {
            creep.memory.dst = source.id;
            return source;
        }
    }
}
// Bind creep with room.memory.sourceCache
function Binding_Collector(creep) {
    if (creep.memory.dst == undefined) {
        if (Find_Idle_Source(creep) == undefined) {
            console.log("Debug CL : IDLE Sources can't be found !");
            // 处理sourceCache缓存 未正确赋值的问题
            let collectorDst = [];
            // 获取当前的 collector dst
            for (let name in Game.creeps) {
                const creep = Game.creeps[name];
                if (creep.memory.role == "collector") {
                    if (creep.memory.dst) {
                        collectorDst.push(creep.memory.dst);
                    }
                }
            }
            // 改正sourceCache
            for (const sourceCacheKey in creep.room.memory.sourceCache) {
                creep.room.memory.sourceCache[sourceCacheKey] = collectorDst.includes(sourceCacheKey);
            }
        }
        // 可以找到空闲的资源就直接 赋值dst 并绑定
        else {
            creep.memory.dst = Find_Idle_Source(creep).id;
            creep.room.memory.sourceCache[creep.memory.dst] = true;
        }
    }
}
class roleCollector {
}
/** @param {Creep} creep **/
roleCollector.run = function (creep) {
    Binding_Collector(creep);
    if (creep.memory.dst == undefined) {
        console.log("Error SourceCache Amends Failed !");
    }
    // ttl = 1 解除占用资源
    if (creep.ticksToLive < 10) {
        console.log("I will die!");
        creep.say("DIE!!");
        creep.room.memory.sourceCache[creep.memory.dst] = false;
    }
    // move to container
    creep.moveTo(Game.getObjectById(creep.memory.dst), { visualizePathStyle: { stroke: '#ffaa00' } });
    // repair container
    const local_container = creep.room.lookAt(creep.pos);
    while (creep.memory.repaired != undefined) {
        if (local_container.type == STRUCTURE_CONTAINER) {
            if (local_container.hits == local_container.hitsMax) {
                creep.memory.repaired = true;
                break;
            }
            Harvest_org(creep);
            creep.say(creep.memory.role[0] + ":🚧repair");
            creep.repair(local_container);
        }
        break;
    }
    // harvest
    creep.say("CL:🔄");
    const res = creep.harvest(Game.getObjectById(creep.memory.dst));
    if (res == ERR_NOT_IN_RANGE) {
        creep.say("CL: E ❗");
    }
};

class roleTransporter {
}
/** @param {Creep} creep **/
roleTransporter.run = function (creep) {
    // 如果没有能量获取能量，如果有能量就去运输
    if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.say("TS:🔜");
        Harvest_Transporter(creep);
    }
    else {
        // 获取最佳的 target
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION
                    || structure.structureType == STRUCTURE_SPAWN
                    || structure.structureType == STRUCTURE_TOWER
                // || structure.structureType == STRUCTURE_STORAGE
                ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        creep.say("TS:🔙");
        // console.log("DEBUG0:",target)
        if (target != null) {
            creep.room.memory.FullyEnergy = false;
        }
        else {
            // console.log("DEBUG1:",target)
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            // console.log("DEBUG2:",target)
            if (target == null) {
                creep.room.memory.FullyEnergy = true;
            }
        }
        // 传输能量
        if (target != null) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
            else if (target.structureType == "storage" && creep.transfer(target, RESOURCE_ENERGY) == OK) {
                // 房间能量已满，转换为 tower 修墙模式
                creep.room.memory.FullyEnergy = true;
            }
        }
    }
    // Unused_Move(creep)
};

class roleRepairer {
}
/** @param {Creep} creep *
 * @param targets structure obj list
 * creep.memory.repairing 用于标识creep是否可以 进行 repair 操作
 */
roleRepairer.repair = function (creep) {
    // 选择合适对象
    let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)
            || (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax)
            || (structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax / 100),
    });
    // 对 creep.memory.repairing 进行判断和赋值
    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
        creep.memory.repairing = true;
    }
    // 修复建筑逻辑
    if (creep.memory.repairing && creep.memory.target_id == undefined) {
        // const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            creep.say("RP:🛠 New");
            creep.memory.target_id = targets[0].id;
            // targets[0].repairing = true
            const target = Game.getObjectById(creep.memory.target_id);
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff99' } });
            }
        }
    }
    else if (creep.memory.repairing && creep.memory.target_id) {
        creep.say('RP:🛠 ');
        const target = Game.getObjectById(creep.memory.target_id);
        // 判断目标是否存在
        if (target == undefined) {
            creep.memory.target_id = null;
            return;
        }
        // 判断目标是否被修好了
        if (target.hits == target.hitsMax) {
            creep.memory.target_id = null;
        }
        else {
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff99' } });
            }
        }
    }
    // harvest
    if (!creep.memory.repairing) {
        creep.say('RP:🔄 ');
        Harvest_advance(creep);
    }
    // Unused_Move(creep)
};

function Spawn_banner(SpawnName) {
    if (Game.spawns[SpawnName].spawning) {
        Game.spawns[SpawnName].room.visual.text('🛠️' + Game.creeps[Game.spawns[SpawnName].spawning.name].memory.role, Game.spawns[SpawnName].pos.x + 1, Game.spawns[SpawnName].pos.y, { align: 'left', opacity: 0.8 });
    }
}

class Tower {
}
/**
 * mode 1 :
 * mode 2 :
 * mode 3 :
**/
Tower.run = function (Tower_id) {
    // "63e49ffa6d5c1786ccea8513"
    // const id = Tower.id
    const tower = Game.getObjectById(Tower_id);
    if (tower) {
        // 攻击敌人
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            console.log("Tower Warning❗: Hostile detected!!");
            tower.attack(closestHostile);
        }
        // 修复建筑
        else {
            let closestDamagedStructure = null;
            // 房间满能量修墙 , 否则只修建筑
            if (tower.room.memory.FullyEnergy) {
                closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_CONTAINER)
                        || (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_ROAD)
                        || (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_STORAGE)
                        || (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_SPAWN)
                        || (structure.hits < structure.hitsMax / 20 && structure.structureType == STRUCTURE_WALL)
                        || (structure.hits < structure.hitsMax / 8 && structure.structureType == STRUCTURE_RAMPART)
                });
            }
            // 只修理非墙建筑
            else {
                closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_CONTAINER)
                        || (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_ROAD)
                        || (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_STORAGE)
                        || (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_SPAWN)
                        || (structure.hits < structure.hitsMax / 10000 && structure.structureType == STRUCTURE_WALL)
                        || (structure.hits < structure.hitsMax / 1000 && structure.structureType == STRUCTURE_RAMPART)
                });
            }
            if (closestDamagedStructure) {
                console.log("Tower Info: Repairing...");
                tower.repair(closestDamagedStructure);
            }
        }
    }
    else {
        console.log("Debug: No Tower..");
    }
};

// 签名大师
class roleSigner {
}
roleSigner.run = function (creep) {
    if (creep.room.controller) {
        if (creep.signController(creep.room.controller, "No offence! Don't attack me pLZ😭") == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
};

class roleUndertaker {
}
/** @param {Creep} creep **/
roleUndertaker.run = function (creep) {
    // const tombs = creep.room.find(FIND_TOMBSTONES)
    const tomb = creep.pos.findClosestByRange(FIND_TOMBSTONES);
    if (creep.store.getFreeCapacity() > 0 && tomb) {
        for (const resource in tomb.store) {
            creep.say("UT:🔜");
            if (creep.withdraw(tomb, resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tomb, { visualizePathStyle: { stroke: '#000000' } });
            }
        }
    }
    else {
        const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity() > 0;
            }
        });
        // 将能量传输回大本营
        for (const resource in creep.store) {
            creep.say("UT:🔙");
            if (creep.transfer(storage, resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, { visualizePathStyle: { stroke: '#000000' } });
            }
        }
    }
    // Unused_Move(creep)
};

class roleExplorer {
}
/** @param {Creep} creep **/
roleExplorer.run = function (creep, position) {
    if (position) {
        creep.say("EP:🚩");
        // console.log("DEBUG:",position.x, position.y, position.roomName)
        creep.moveTo(new RoomPosition(position.x, position.y, position.roomName), { visualizePathStyle: { stroke: '#ffffff' } });
    }
};

class roleMiner {
}
/** @param {Creep} creep **/
roleMiner.run = function (creep) {
    let minerals = creep.room.find(FIND_MINERALS);
    if (creep.store.getFreeCapacity() > 0) {
        creep.say("MN:⛏");
        if (creep.harvest(minerals[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(minerals[0]);
        }
    }
    else {
        const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE &&
                    structure.store.getFreeCapacity() > 0;
            }
        });
        // console.log("DEBUG MN :",target)
        if (target) {
            creep.say("MN:🔄");
            if (creep.transfer(target, minerals[0].mineralType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

class roleAttacker {
}
/** @param {Creep} creep **/
// Attack Only Invader
roleAttacker.run = function (creep, room) {
    if (room) {
        // const enemies = room.find(FIND_HOSTILE_STRUCTURES, {
        //     filter: (obj) => {
        //         return !obj.my;
        //     }
        // });
        const enemies = room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
                return structure.owner && structure.owner.username === 'Invader';
            }
        });
        if (enemies.length != 0) {
            creep.say("AT:👊");
            if (creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemies[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};
// Attack everything if it is not owned by me !!!
roleAttacker.clearNewRoom = function (creep, room) {
    if (room) {
        const enemies = room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (obj) => {
                return !obj.my;
            }
        });
        if (enemies.length != 0) {
            creep.say("AT:👊");
            if (creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemies[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
function stateScanner() {
    // 每 20 tick 运行一次
    if (Game.time % 20)
        return;
    if (!Memory.stats)
        Memory.stats = {};
    // 统计 GCL / GPL 的升级百分比和等级
    Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100;
    Memory.stats.gclLevel = Game.gcl.level;
    Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100;
    Memory.stats.gplLevel = Game.gpl.level;
    // CPU 的当前使用量
    Memory.stats.cpu = Game.cpu.getUsed();
    // bucket 当前剩余量
    Memory.stats.bucket = Game.cpu.bucket;
}

function InitStructureCache(room) {
    const structures = room.find(FIND_STRUCTURES);
    // 为每个子对象分配空间
    if (!room.memory.structures) {
        room.memory.structures = {};
    }
    for (const structure of structures) {
        let structureName = structure.structureType + "X" + structure.pos.x + "Y" + structure.pos.y;
        // 为每个子对象分配空间
        if (!room.memory.structures[structureName]) {
            room.memory.structures[structureName] = {};
        }
        // 分配 type 和 id 值
        room.memory.structures[structureName].type = structure.structureType;
        room.memory.structures[structureName].id = structure.id;
    }
}
function StructureManager(roomName) {
    let room = Game.rooms[roomName];
    let SCAN_INTERVAL = 100;
    if (Game.time - room.memory.lastScanTime >= SCAN_INTERVAL || room.memory.lastScanTime == null) {
        // 扫描并添加新的建筑
        InitStructureCache(room);
        room.memory.lastScanTime = Game.time;
        // 遍历删除不存在的建筑
        for (const structureName in room.memory.structures) {
            const structureId = room.memory.structures[structureName].id;
            if (Game.getObjectById(structureId) == null) {
                delete room.memory.structures[structureName];
            }
        }
    }
    // // 删除毁坏的建筑
    // const ruins = room.find(FIND_RUINS)
    // for (const ruin of ruins){
    //     const ruinName = ruin.structure.structureType + "X" + ruin.structure.pos.x + "Y" + ruin.structure.pos.y
    //     for(const structureName in room.memory.structures){
    //         if (ruinName == structureName){
    //             delete room.memory.structures[structureName]
    //         }
    //     }
    // }
    // // 添加新 build 的建筑
}

class roleClaimer {
}
/** @param {Creep} creep **/
roleClaimer.claim = function (creep, room) {
    let controller;
    try {
        controller = room.controller;
    }
    catch (error) {
        return false;
    }
    if (controller) {
        // console.log("DEBUG:", creep.claimController(controller))
        if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
            creep.say("Claim:🚩");
            creep.moveTo(controller);
        }
        creep.reserveController(controller);
    }
    if (controller) {
        if (creep.signController(controller, "No offence! Don't attack me pLZ😭") == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
        }
    }
};

class roleHelpBuilder {
}
/** @param {Creep} creep **/
roleHelpBuilder.build = function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.building = false;
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
        creep.memory.building = true;
    }
    // con1sole.log("DEBUG:", creep.pos.roomName)
    if (creep.pos.roomName != Game.flags.Flag1.pos.roomName) {
        creep.say("HpBd:🏃");
        creep.moveTo(Game.flags.Flag1, { visualizePathStyle: { stroke: '#ffffff' } });
    }
    else {
        if (creep.memory.building) {
            const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target) {
                creep.say('HpBd:🚧');
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
        else {
            creep.say('HpBd:🔄');
            Harvest_advance(creep);
        }
        // Unused_Move(creep)
    }
};
roleHelpBuilder.upgrade = function (creep) {
    if (creep.pos.roomName != Game.flags.Flag1.pos.roomName) {
        creep.say("HpBd:🏃");
        creep.moveTo(Game.flags.Flag1, { visualizePathStyle: { stroke: '#ffffff' } });
    }
    else {
        roleUpgrader.upgrade(creep);
    }
};
roleHelpBuilder.repair = function (creep) {
    if (creep.pos.roomName != Game.flags.Flag1.pos.roomName) {
        creep.say("HpBd:🏃");
        creep.moveTo(Game.flags.Flag1, { visualizePathStyle: { stroke: '#ffffff' } });
    }
    else {
        roleRepairer.repair(creep);
    }
};

// 计算Operator的位置函数
function GetOpPos(creep, factory, terminal, storage) {
    // const factory = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return (
    //             structure.structureType == STRUCTURE_FACTORY
    //         )
    //     }
    // })
    // const terminal = creep.room.terminal
    // const storage = creep.room.storage
    // const terminal = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return (
    //             structure.structureType == STRUCTURE_TERMINAL
    //         )
    //     }
    // })
    // const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return (
    //             structure.structureType == STRUCTURE_STORAGE
    //         )
    //     }
    // })
    let X = [];
    let Y = [];
    X.push(factory.pos.x);
    X.push(terminal.pos.x);
    X.push(storage.pos.x);
    Y.push(factory.pos.y);
    Y.push(terminal.pos.y);
    Y.push(storage.pos.y);
    let OpX = 0;
    let OpY = 0;
    for (let x of X) {
        OpX += x;
    }
    OpX = Math.round(OpX / 3);
    for (let y of Y) {
        OpY += y;
    }
    OpY = Math.round(OpY / 3);
    const position = new RoomPosition(OpX, OpY, creep.pos.roomName);
    return position;
}
class roleOperator {
}
/** @param {Creep} creep **/
// 生产生成物 eg: Produce(creep,{Z:500, energy:200}, {zynthium_bar:100})
//Tips: 一定要按公式填写反应物和生成物
roleOperator.runProduction = function (creep, reactants, products) {
    // 移动到指定位置
    const factory = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_FACTORY);
        }
    });
    const terminal = creep.room.terminal;
    const storage = creep.room.storage;
    creep.moveTo(GetOpPos(creep, factory, terminal, storage), { visualizePathStyle: { stroke: '#ffffff' } });
    //factory produce 试运行，看错误码
    // const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return (
    //             structure.structureType == STRUCTURE_STORAGE
    //         )
    //     }
    // })
    // const factory = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return (
    //             structure.structureType == STRUCTURE_FACTORY
    //         )
    //     }
    // })
    // 异常状态1：反应物不足
    const product = Object.keys(products)[0];
    // console.log("DEBUG:", factory.produce(product))
    if (factory.produce(product) == ERR_NOT_ENOUGH_RESOURCES) {
        for (let reactant in reactants) {
            // factory 存储资源小于需求
            if (factory.store[reactant] < reactants[reactant]) {
                creep.say("OP:pd✋");
                creep.memory.working = true;
                // Step1 : 检查creep身上是否有资源，有的话丢到工厂里
                if (storage != null) {
                    for (let res in creep.store) {
                        creep.transfer(factory, res);
                    }
                }
                // Step2 : creep 按照需求从 storage 取资源
                creep.withdraw(storage, reactant, (reactants[reactant] - factory.store[reactant]));
            }
        }
    }
    // 正常状态： 成功生产
    if (factory.produce(product) == OK) {
        creep.withdraw(factory, product);
        creep.memory.working = false;
    }
    if (creep.memory.working == false) {
        for (let res in creep.store) {
            creep.transfer(storage, res);
        }
    }
    //     // 异常状态2： 工厂满了
    // if (factory.produce(product) == ERR_FULL){
    //     for (let res in factory.store) {
    //         creep.withdraw(factory,res)
    //     }
    // }
    // 第二步 搬运指定数量反应物到factory中
    // 第三步
};

// import { errorMapper } from "./utils/ErrorMapper";
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
// export const loop = errorMapper(() => {
/**
 * main 函数
 */
const loop = function () {
    // Get current time
    console.log(`Current game tick is ${Game.time}`);
    // gene Pixel
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    // print Energy
    for (let name in Game.rooms) {
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
    }
    // Spawns banner
    Spawn_banner('Spawn1');
    // 房间 Structure 缓存管理
    StructureManager("E15N7");
    // Spawn1 Create screeps
    createRole('harvester', 0, calcBodyPart({ [MOVE]: 1, [WORK]: 1, [CARRY]: 1 }), "Spawn1");
    createRole('collector', 2, calcBodyPart({ [MOVE]: 4, [WORK]: 6, [CARRY]: 0 }), "Spawn1");
    createRole('upgrader', 1, calcBodyPart({ [MOVE]: 2, [WORK]: 1, [CARRY]: 1 }), "Spawn1");
    createRole('builder', 0, calcBodyPart({ [MOVE]: 10, [WORK]: 10, [CARRY]: 10 }), "Spawn1");
    createRole('helpbuilder', 1, calcBodyPart({ [MOVE]: 20, [WORK]: 10, [CARRY]: 10 }), "Spawn1");
    createRole('repairer', 1, calcBodyPart({ [MOVE]: 2, [WORK]: 2, [CARRY]: 2 }), "Spawn1");
    createRole('transporter', 4, calcBodyPart({ [MOVE]: 4, [CARRY]: 4 }), "Spawn1");
    // createRole('transporter',4,calcBodyPart({[MOVE]:2,[CARRY]:2}),"E15N7")
    createRole('undertaker', 1, calcBodyPart({ [MOVE]: 3, [CARRY]: 3 }), "Spawn1");
    createRole('signer', 0, calcBodyPart({ [MOVE]: 1 }), "Spawn1");
    createRole('explorer', 0, calcBodyPart({ [MOVE]: 1 }), "Spawn1");
    createRole('miner', 1, calcBodyPart({ [MOVE]: 3, [WORK]: 5, [CARRY]: 5 }), "Spawn1");
    createRole('attacker', 0, calcBodyPart({ [MOVE]: 20, [ATTACK]: 20, [TOUGH]: 0 }), "Spawn1");
    createRole('claimer', 0, calcBodyPart({ [MOVE]: 1, [CLAIM]: 1 }), "Spawn1");
    createRole('operator', 1, calcBodyPart({ [MOVE]: 5, [CARRY]: 10 }), "Spawn1");
    // Spawn2 Create screeps
    // createRole('upgrader',1,calcBodyPart({[MOVE]:2,[WORK]:1,[CARRY]:1}),"Spawn2")
    // createRole('repairer',1,calcBodyPart({[MOVE]:2,[WORK]:2,[CARRY]:2}),"Spawn1")
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
    // run role
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        //// 运行harvest
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.repair(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.upgrade(creep);
        }
        if (creep.memory.role == 'collector') {
            roleCollector.run(creep);
        }
        if (creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
        if (creep.memory.role == 'signer') {
            roleSigner.run(creep);
        }
        if (creep.memory.role == 'undertaker') {
            roleUndertaker.run(creep);
        }
        if (creep.memory.role == 'explorer') {
            const position = new RoomPosition(25, 25, "E16N8");
            roleExplorer.run(creep, position);
        }
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if (creep.memory.role == 'attacker') {
            roleAttacker.clearNewRoom(creep, Game.rooms['E16N7']);
        }
        if (creep.memory.role == 'claimer') {
            roleClaimer.claim(creep, Game.rooms['E16N8']);
        }
        // 插旗指定帮助哪里（Flag1）
        if (creep.memory.role == 'helpbuilder') {
            // creep.suicide()
            // const position = new RoomPosition(14, 14, "E16N7");
            // creep.moveTo(position)
            // roleHelpBuilder.build(creep);
            // roleHelpBuilder.repair(creep)
            roleHelpBuilder.upgrade(creep);
        }
        if (creep.memory.role == 'operator') {
            const reactants = { Z: 500, energy: 200 };
            const product = { zynthium_bar: 100 };
            roleOperator.runProduction(creep, reactants, product);
        }
    }
    //  run structure
    for (const structureName in Game.rooms["E15N7"].memory.structures) {
        let MemStructure = Game.rooms["E15N7"].memory.structures[structureName];
        if (MemStructure.type == "tower") {
            Tower.run(MemStructure.id);
        }
    }
    // 全局资源监控
    stateScanner();
};

exports.loop = loop;
//# sourceMappingURL=main.js.map
