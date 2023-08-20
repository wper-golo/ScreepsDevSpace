import {Harvest_advance} from "@/roles/motion/harvest_advance";
import {Unused_Move} from "@/roles/motion/unused_move";

export class roleRepairer  {

    /** @param {Creep} creep *
     * @param targets structure obj list
     * creep.memory.repairing 用于标识creep是否可以 进行 repair 操作
     */
    public static repair = function (creep) {

        // 选择合适对象
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)
                || (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax)
                || (structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax/100),
        })

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
                creep.memory.target_id = targets[0].id
                // targets[0].repairing = true
                const target = Game.getObjectById(creep.memory.target_id)
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff99'}});
                }
            }
        } else if (creep.memory.repairing && creep.memory.target_id ){
            creep.say('RP:🛠 ');
            const target = Game.getObjectById<Structure>(creep.memory.target_id)
            // 判断目标是否存在
            if (target == undefined){
                creep.memory.target_id = null
                return
            }


            // 判断目标是否被修好了
            if (target.hits == target.hitsMax){
                creep.memory.target_id = null
            }else {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff99'}});
                }
            }

        }

        // harvest
        if (!creep.memory.repairing){
            creep.say('RP:🔄 ');
            Harvest_advance(creep)
        }
        // Unused_Move(creep)
    }

}
