export class Tower{
/**
 * mode 1 :
 * mode 2 :
 * mode 3 :
**/
    public static run = function (Tower_id:Id<StructureTower>) {
        // "63e49ffa6d5c1786ccea8513"
        // const id = Tower.id
        const tower = Game.getObjectById<StructureTower>(Tower_id);
        if(tower) {
            // 攻击敌人
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                console.log("Tower Warning❗: Hostile detected!!")
                tower.attack(closestHostile);
            }
            // 修复建筑
            else{
                let closestDamagedStructure:Structure = null
                // 房间满能量修墙 , 否则只修建筑
                if (tower.room.memory.FullyEnergy){
                    closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) =>
                            (structure.hits < structure.hitsMax  && structure.structureType == STRUCTURE_CONTAINER)
                            || (structure.hits < structure.hitsMax  && structure.structureType == STRUCTURE_ROAD)
                            || (structure.hits < structure.hitsMax  && structure.structureType == STRUCTURE_STORAGE)
                            || (structure.hits < structure.hitsMax  && structure.structureType == STRUCTURE_SPAWN)
                            || (structure.hits < structure.hitsMax / 20 && structure.structureType == STRUCTURE_WALL)
                            || (structure.hits < structure.hitsMax / 8 && structure.structureType == STRUCTURE_RAMPART)
                    });
                }
                // 只修理非墙建筑
                else{
                    closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) =>
                            (structure.hits < structure.hitsMax  && structure.structureType == STRUCTURE_CONTAINER)
                            || (structure.hits < structure.hitsMax  && structure.structureType == STRUCTURE_ROAD)
                            || (structure.hits < structure.hitsMax  && structure.structureType == STRUCTURE_STORAGE)
                            || (structure.hits < structure.hitsMax  && structure.structureType == STRUCTURE_SPAWN)
                            || (structure.hits < structure.hitsMax / 10000 && structure.structureType == STRUCTURE_WALL)
                            || (structure.hits < structure.hitsMax / 1000 && structure.structureType == STRUCTURE_RAMPART)
                    });
                }


                if (closestDamagedStructure) {
                    console.log("Tower Info: Repairing...")
                    tower.repair(closestDamagedStructure);
                }
            }
        }else{
            console.log("Debug: No Tower..")
        }
    }
}