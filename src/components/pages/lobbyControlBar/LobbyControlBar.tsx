import React from "react";
import "./LobbyControlBar.css";

export interface ILobbyControlBarProps {
  createLobby: () => void;
  joinLobby: () => void;
  leaveLobby: () => void;
  player: any;
}

const LobbyControlBar: React.FunctionComponent<ILobbyControlBarProps> = (
  props
) => {
  return (
    <div className="LobbyControlBar">
      <button className="LobbyControlBar__button" onClick={props.createLobby}>
        Create Lobby
      </button>
      <button className="LobbyControlBar__button" onClick={props.joinLobby}>
        Join Lobby
      </button>
      {props.player.lobbyId && (
        <button className="LobbyControlBar__button" onClick={props.leaveLobby}>
          Leave Lobby
        </button>
      )}
    </div>
  );
};
export default LobbyControlBar;
