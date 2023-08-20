export class roleClaimer {

    /** @param {Creep} creep **/
    public static claim = function (creep, room) {
        let controller;
        try {
            controller = room.controller
        } catch (error) {
            return false
        }

        if(controller) {
            // console.log("DEBUG:", creep.claimController(controller))
            if(creep.claimController(controller) == ERR_NOT_IN_RANGE) {
                creep.say("Claim:🚩");
                creep.moveTo(controller);
            }
            creep.reserveController(controller)
        }
        if(controller) {
            if(creep.signController(controller, "No offence! Don't attack me pLZ😭") == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        }
    }
}
