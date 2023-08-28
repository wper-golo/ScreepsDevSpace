import {Unused_Move} from "@/roles/motion/unused_move";

export class roleUndertaker {

    /** @param {Creep} creep **/
    public static run = function (creep) {
        const storage = creep.room.storage
        //如果身上还有能量，就先把能量全部放到storage里
        if (creep.store.getUsedCapacity() > 0) {
            for(const resource in creep.store) {
                creep.say("UT:🔙")
                if(creep.transfer(storage, resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#000000'}});
                }
            }
        }
        const tombs = creep.room.find(FIND_TOMBSTONES)
        for(const tomb of tombs) {
            // const tomb = creep.pos.findClosestByRange(FIND_TOMBSTONES);
            if (creep.store.getFreeCapacity() > 0 && tomb.store != null) {
                for(const resource in tomb.store) {
                    creep.say("UT:🔜")
                    if(creep.withdraw(tomb, resource) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tomb, {visualizePathStyle: {stroke: '#000000'}});
                    }
                }
            } else {
                // 将能量传输回大本营
                for(const resource in creep.store) {
                    creep.say("UT:🔙")
                    if(creep.transfer(storage, resource) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#000000'}});
                    }
                }
            }
        }

        // Unused_Move(creep)
    }
}