// choose a best container
export function Get_container(creep): StructureContainer {
    const containers = creep.room.find(FIND_STRUCTURES,{
        filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER; }
    });
    // console.log("DEBUG:",creep.memory.role, "//", containers)

    // 找到不到containers 返回 undefined
    if (containers == null) {
        return undefined
    }
    const closest_container = creep.pos.findClosestByRange(FIND_STRUCTURES,{
        filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER; }
    })
    // 找不到 closest_container 返回 undefined
    if (closest_container == null) {
        return undefined
    }
    if(closest_container.store.getFreeCapacity()<(CONTAINER_CAPACITY*3/4)){
        return closest_container
    }


    // 返回储量最大的container
    let cap_dic = {}
    for (let container of containers){
        cap_dic[container.id] = container.store.getFreeCapacity()
    }
    const keys = Object.keys(cap_dic);
    const lowest:number = Math.min.apply(null, keys.map(function (x) {
        return cap_dic[x]
    }));
    const min_cont_keys = keys.filter(function (y) {
        return cap_dic[y] === lowest
    });
    for(const min_cont_key of min_cont_keys){
        // console.log("Best Container's id:"+ min_cont_key)
        return  Game.getObjectById(<Id<any>>min_cont_key)
    }
}
