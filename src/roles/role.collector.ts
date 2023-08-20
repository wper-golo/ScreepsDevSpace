// function Source_Not_Fully_Using (source) : boolean {
//     // source.pos
//     // console.log(source)
//     let count = 0
//     for(let creep in Game.creeps) {
//         const distance = Math.abs(Game.creeps[creep].pos.x - source.pos.x) + Math.abs(Game.creeps[creep].pos.y - source.pos.y);
//         if (distance <=3 ){
//             console.log(Game.creeps[creep].name + " using " + source.name)
//             count += 1
//         }
//     }
//     let maxUser = 2
//     if (count < maxUser) {
//         return true
//     }else {
//         return false
//     }
// }
//

import {Harvest_org} from "@/roles/motion/harvest_advance";

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
function Init_Source_Cache(room:Room):void {
    let sources = room.find(FIND_SOURCES)
    if(Object.keys(room.memory.sourceCache).length != sources.length){
        room.memory.sourceCache = {}
        for(let source of sources){
            room.memory.sourceCache[source.id] = false
        }
    }
}

// Find Idle source
function Find_Idle_Source(creep:Creep): Source{
    Init_Source_Cache(creep.room)
    let sources = creep.room.find(FIND_SOURCES)
    for(let source of sources){
        if(creep.room.memory.sourceCache[source.id] == false){
            creep.memory.dst = source.id
            return source
        }
    }

}

// Bind creep with room.memory.sourceCache
function Binding_Collector(creep:Creep): void{
    if(creep.memory.dst == undefined) {
        if (Find_Idle_Source(creep) == undefined){
            console.log("Debug CL : IDLE Sources can't be found !")
            // 处理sourceCache缓存 未正确赋值的问题
            let collectorDst = []
            // 获取当前的 collector dst
            for(let name in Game.creeps) {
                const creep = Game.creeps[name];
                if (creep.memory.role == "collector"){
                    if (creep.memory.dst){
                        collectorDst.push(creep.memory.dst)
                    }
                }
            }
            // 改正sourceCache
            for (const sourceCacheKey in creep.room.memory.sourceCache) {
                    creep.room.memory.sourceCache[sourceCacheKey] = collectorDst.includes(sourceCacheKey)
            }
        }
        // 可以找到空闲的资源就直接 赋值dst 并绑定
        else{
            creep.memory.dst = Find_Idle_Source(creep).id;
            creep.room.memory.sourceCache[creep.memory.dst] = true;
        }
    }
}


export class roleCollector {

    /** @param {Creep} creep **/
    public static run = function (creep) {

        Binding_Collector(creep)
        if (creep.memory.dst == undefined){
            console.log("Error SourceCache Amends Failed !")
        }
        // ttl = 1 解除占用资源
        if(creep.ticksToLive < 10){
            console.log("I will die!")
            creep.say("DIE!!")
            creep.room.memory.sourceCache[creep.memory.dst] = false
        }

        // move to container
        creep.moveTo(Game.getObjectById(creep.memory.dst), {visualizePathStyle: {stroke: '#ffaa00'}});

        // repair container
        const local_container = creep.room.lookAt(creep.pos)
        while (creep.memory.repaired!=undefined) {
            if (local_container.type == STRUCTURE_CONTAINER ) {
                if (local_container.hits == local_container.hitsMax){
                    creep.memory.repaired = true
                    break
                }
                Harvest_org(creep)
                creep.say(creep.memory.role[0]+":🚧repair")
                creep.repair(local_container)
            }
            break
        }

        // harvest
        creep.say("CL:🔄")
        const res = creep.harvest(Game.getObjectById(creep.memory.dst))
        if (res == ERR_NOT_IN_RANGE) {
            creep.say("CL: E ❗")
        }
    }

};
