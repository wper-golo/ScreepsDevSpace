export class roleExplorer {

    /** @param {Creep} creep **/
    public static run = function (creep,position) {
        if (position){
            creep.say("EP:🚩")
            // console.log("DEBUG:",position.x, position.y, position.roomName)
            creep.moveTo(new RoomPosition(position.x, position.y, position.roomName), {visualizePathStyle: {stroke: '#ffffff'}})
        }
    }
}
