import { createAction, props } from "@ngrx/store";
import { PeerModel } from "models/message.model";
import Peer from "peerjs";

export const addPeer = createAction('addPeer', props<{peers: PeerModel}>())
