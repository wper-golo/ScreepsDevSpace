export function HungryTimeCalc(room:Room) {
    if (room.energyAvailable <= 100){
        room.memory.HungryTime += 1
    }else {
        room.memory.HungryTime = 0
    }
}

export function SourceCalc(room:Room) {
    const sources = room.find(FIND_SOURCES);
    room.memory.sourceCount = sources.length
}

function InitStructureCache(room:Room) {
    const structures = room.find(FIND_STRUCTURES)
    // 为每个子对象分配空间
    if (!room.memory.structures) {
        room.memory.structures = {};
    }
    for(const structure of structures){
        let structureName = structure.structureType + "X" + structure.pos.x + "Y" + structure.pos.y
        // 为每个子对象分配空间
        if (!room.memory.structures[structureName]) {
            room.memory.structures[structureName] = {};
        }
        // 分配 type 和 id 值
        room.memory.structures[structureName].type = structure.structureType
        room.memory.structures[structureName].id = structure.id
    }
}
export function StructureManager(roomName){
    let room = Game.rooms[roomName]
    let SCAN_INTERVAL = 100
    if (Game.time - room.memory.lastScanTime >= SCAN_INTERVAL || room.memory.lastScanTime == null) {
        // 扫描并添加新的建筑
        InitStructureCache(room)
        room.memory.lastScanTime = Game.time;
        // 遍历删除不存在的建筑
        for (const structureName in room.memory.structures) {
            const structureId = room.memory.structures[structureName].id
            if (Game.getObjectById(<Id<_HasId>>structureId) == null){
                delete room.memory.structures[structureName]
            }
        }
    }


    // // 删除毁坏的建筑
    // const ruins = room.find(FIND_RUINS)
    // for (const ruin of ruins){
    //     const ruinName = ruin.structure.structureType + "X" + ruin.structure.pos.x + "Y" + ruin.structure.pos.y
    //     for(const structureName in room.memory.structures){
    //         if (ruinName == structureName){
    //             delete room.memory.structures[structureName]
    //         }
    //     }
    // }
    // // 添加新 build 的建筑



}