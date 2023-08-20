export class roleAttacker {

    /** @param {Creep} creep **/
    // Attack Only Invader
    public static run = function (creep,room) {
        if (room) {
            // const enemies = room.find(FIND_HOSTILE_STRUCTURES, {
            //     filter: (obj) => {
            //         return !obj.my;
            //     }
            // });
            const enemies= room.find(FIND_HOSTILE_STRUCTURES, {
                filter: (structure) => {
                    return structure.owner && structure.owner.username === 'Invader';
                }
            });
            if (enemies.length != 0 ){
                creep.say("AT:👊")
                if (creep.attack(enemies[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(enemies[0], {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
        }

    }
    // Attack everything if it is not owned by me !!!
    public static clearNewRoom = function (creep,room) {
        if (room) {
            const enemies = room.find(FIND_HOSTILE_STRUCTURES, {
                filter: (obj) => {
                    return !obj.my;
                }
            });
            if (enemies.length != 0 ){
                creep.say("AT:👊")
                if (creep.attack(enemies[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(enemies[0], {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
        }

    }
}