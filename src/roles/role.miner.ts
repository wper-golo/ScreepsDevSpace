export class roleMiner {

    /** @param {Creep} creep **/
    public static run = function (creep) {
        let minerals = creep.room.find(FIND_MINERALS);
        if (creep.store.getFreeCapacity() > 0) {
            creep.say("MN:⛏")
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
                creep.say("MN:🔄")
                if (creep.transfer(target,minerals[0].mineralType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
}
