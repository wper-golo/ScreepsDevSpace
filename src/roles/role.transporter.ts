import {Get_container} from "@/structure/container";
import {Unused_Move} from "@/roles/motion/unused_move";
import {Harvest_advance, Harvest_Transporter} from "@/roles/motion/harvest_advance";

function Charge_tower (creep){
    if (creep.store.getFreeCapacity() > 0) {

        // console.log("Transporter: ")

        const container = Get_container(creep)
        creep.say("🔜")
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        });
        // 将能量传输回大本营
        if (targets.length > 0) {
            creep.say("🔙")
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }else{
            creep.room.memory.FullyEnergy = true
        }
    }

}


export class roleTransporter {

    /** @param {Creep} creep **/
    public static run = function (creep) {
        // 如果没有能量获取能量，如果有能量就去运输
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.say("TS:🔜")
            Harvest_Transporter(creep)
        } else {
            // 获取最佳的 target
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION
                        || structure.structureType == STRUCTURE_SPAWN
                        || structure.structureType == STRUCTURE_TOWER
                        // || structure.structureType == STRUCTURE_STORAGE
                    ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            })
            creep.say("TS:🔙")
            // console.log("DEBUG0:",target)
            if (target != null) {
                creep.room.memory.FullyEnergy = false
            }else{
                // console.log("DEBUG1:",target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_STORAGE
                        ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                })
                // console.log("DEBUG2:",target)
                if (target == null){
                    creep.room.memory.FullyEnergy = true
                }

            }
            // 传输能量
            if(target!= null){
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }else if (target.structureType == "storage" && creep.transfer(target, RESOURCE_ENERGY) == OK ){
                    // 房间能量已满，转换为 tower 修墙模式
                    creep.room.memory.FullyEnergy = true
                }
            }

        }
        // Unused_Move(creep)
    }

}