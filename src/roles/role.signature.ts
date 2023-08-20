// 签名大师
export class roleSigner {
    public static run = function(creep) {
        if(creep.room.controller) {
            if(creep.signController(creep.room.controller, "No offence! Don't attack me pLZ😭") == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}