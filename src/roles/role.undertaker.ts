
export class roleUndertaker {

    /** @param {Creep} creep **/
    public static run = function (creep) {
        // const tombs = creep.room.find(FIND_TOMBSTONES)
        const tomb = creep.pos.findClosestByRange(FIND_TOMBSTONES);
        if (creep.store.getFreeCapacity() > 0 && tomb) {
            for(const resource in tomb.store) {
                creep.say("UT:🔜")
                if(creep.withdraw(tomb, resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tomb, {visualizePathStyle: {stroke: '#000000'}});
                }
            }
        } else {
            const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_STORAGE
                    ) && structure.store.getFreeCapacity() > 0;
                }
            })
            // 将能量传输回大本营
            for(const resource in creep.store) {
                creep.say("UT:🔙")
                if(creep.transfer(storage, resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#000000'}});
                }
            }
        }
        // Unused_Move(creep)
    }
}