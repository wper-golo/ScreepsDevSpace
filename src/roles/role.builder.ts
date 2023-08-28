import {Harvest_advance, Harvest_From_Storage} from "@/roles/motion/harvest_advance";
import {Unused_Move} from "@/roles/motion/unused_move";

export class roleBuilder  {

    /** @param {Creep} creep **/
    public static run = function (creep) {

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
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            creep.say('Bd:🔄');
            Harvest_From_Storage(creep)
        }
        // Unused_Move(creep)
    }

};