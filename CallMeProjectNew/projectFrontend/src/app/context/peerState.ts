import { PeerModel } from "models/message.model";

interface PeerState {
  peers: PeerModel[];
}

export const initialState: PeerState = {
  peers: []
}
