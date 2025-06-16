import React from "react";
import "./LobbyControlBar.css";

export interface ILobbyControlBarProps {
  createLobby: () => void;
  joinLobby: () => void;
  leaveLobby: () => void;
  lobby: any;
}

const LobbyControlBar: React.FunctionComponent<ILobbyControlBarProps> = (
  props
) => {
  console.log("LobbyControlBar props:", props);
  return (
    <div className="LobbyControlBar">
      {!props.lobby ? (
        <>
          <button
            className="LobbyControlBar__button"
            onClick={props.createLobby}
          >
            Create Lobby
          </button>
          <button className="LobbyControlBar__button" onClick={props.joinLobby}>
            Join Lobby
          </button>
        </>
      ) : (
        <span>{`Lobby ID: ${props.lobby.id}`}</span>
      )}
      {props.lobby && (
        <button className="LobbyControlBar__button" onClick={props.leaveLobby}>
          Leave Lobby
        </button>
      )}
      {props.lobby && (
        <>
          <span className="LobbyControlBar__lobbyInfo">
            {`Players: ${Object.keys(props.lobby.players ?? {}).length}`}
          </span>
          {Object.keys(props.lobby.players ?? {}).length > 0 && (
            <div className="LobbyControlBar__playersInfo">
              {Object.entries(props.lobby.players as any[]).map(
                ([key, player]) => (
                  <span key={key} className="LobbyControlBar__player">
                    {player?.name}
                  </span>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default LobbyControlBar;
