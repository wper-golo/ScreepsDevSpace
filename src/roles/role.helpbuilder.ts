import {Harvest_advance} from "@/roles/motion/harvest_advance";
import {Unused_Move} from "@/roles/motion/unused_move";
import {roleUpgrader} from "@/roles/role.upgrader";
import {roleRepairer} from "@/roles/role.repairer";

export class roleHelpBuilder  {

    /** @param {Creep} creep **/
    public static build = function (creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }
        // con1sole.log("DEBUG:", creep.pos.roomName)
        if (creep.pos.roomName != Game.flags.Flag1.pos.roomName){
            creep.say("HpBd:🏃")
            creep.moveTo(Game.flags.Flag1, {visualizePathStyle: {stroke: '#ffffff'}});
        }else{
            if (creep.memory.building) {
                const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

                if (target) {
                    creep.say('HpBd:🚧');
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else {
                creep.say('HpBd:🔄');
                Harvest_advance(creep)
            }
            // Unused_Move(creep)
        }


    }

    public static upgrade = function(creep) {
        if (creep.pos.roomName != Game.flags.Flag1.pos.roomName){
            creep.say("HpBd:🏃")
            creep.moveTo(Game.flags.Flag1, {visualizePathStyle: {stroke: '#ffffff'}});
        }else{
            roleUpgrader.upgrade(creep)
        }
    }

    public static repair = function (creep) {
        if (creep.pos.roomName != Game.flags.Flag1.pos.roomName){
            creep.say("HpBd:🏃")
            creep.moveTo(Game.flags.Flag1, {visualizePathStyle: {stroke: '#ffffff'}});
        }else{
            roleRepairer.repair(creep)
        }
    }
};