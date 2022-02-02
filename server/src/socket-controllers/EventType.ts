export enum EventType {
  PLAYER_NEW = 'player:new',
  CHARACTER_LOAD = 'player:load_character',
  CHARACTER_LOADED = 'player:character_loaded',
  CHARACTER_UNLOAD = 'player:unload_character',
  CHARACTER_UNLOADED = 'player:character_unloaded',
  JOIN_MAP = 'player:join_map',
  PLAYER_STATE_UPDATE = 'player:state_update',
  PLAYER_STATE_UPDATED = 'player:stated_updated',

  SCENE_UPDATE_REQUEST = 'scene:update_request',
  SCENE_UPDATE = 'scene:update',

  SOCKET_NOT_FOUND = 'connection:socket_404',
}
