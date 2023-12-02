import { initialState } from "./peerState";

export function peerReducer(state = initialState, action:any){
  switch(action.type) {
    case 'addPeer':
      return {...state, peers: [...state.peers, action.payload.peer]};
      default:
        return state;
  }
}
