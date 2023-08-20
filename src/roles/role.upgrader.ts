import {Harvest_advance} from "@/roles/motion/harvest_advance";
import {Unused_Move} from "@/roles/motion/unused_move";

export class roleUpgrader {

    /** @param {Creep} creep **/
    public static upgrade = function(creep) {
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            // creep.say('🔄');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            // creep.say("🆙");
        }

        if(creep.memory.upgrading) {
            creep.say("UG:🆙");
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            creep.say('UG:🔄');
            Harvest_advance(creep)
        }
        // Unused_Move(creep)
    }
};
