export function Spawn_banner(SpawnName){
    if(Game.spawns[SpawnName].spawning){
        Game.spawns[SpawnName].room.visual.text(
            '🛠️' + Game.creeps[Game.spawns[SpawnName].spawning.name].memory.role,
            Game.spawns[SpawnName].pos.x + 1,
            Game.spawns[SpawnName].pos.y,
            {align: 'left', opacity: 0.8});
    }
}

export function RenewCreep(creep, SpawnName) {
    // 如果不在Spawning 那么可以直接开始
    if (Game.spawns[SpawnName].spawning){

    }
}