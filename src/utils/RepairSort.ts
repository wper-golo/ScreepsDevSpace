/**
 *
 * use eg； RepairSort(room,{"container":0,"road":3,"rampart":1})
 *
 * @param room
 * @constructor
 */
export function RepairSort(room: Room,weights) {
    let containers = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.hits < CONTAINER_HITS/2,
    })
    for (let container of containers){

    }
    let roads = room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_ROAD}});

}

