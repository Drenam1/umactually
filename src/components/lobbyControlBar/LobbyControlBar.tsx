import React from "react";
import "./LobbyControlBar.css";

export interface ILobbyControlBarProps {
  createLobby: () => void;
  joinLobby: () => void;
  leaveLobby: () => void;
  updatePlayerName: (name: string) => void;
  lobby: any;
  player: any;
}

const LobbyControlBar: React.FunctionComponent<ILobbyControlBarProps> = (
  props
) => {
  const [playerObj, setPlayerObj] = React.useState<any>(props.player);

  return (
    <div className="LobbyControlBar">
      <button
        onClick={() => {
          let newName = prompt("Enter your name:");
          if (newName) {
            props.updatePlayerName(newName.trim());
            setPlayerObj({ ...playerObj, name: newName.trim() });
          }
        }}
        style={{ padding: "5px 10px", cursor: "pointer" }}
      >
        <span>{playerObj.name}</span>
      </button>
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
    </div>
  );
};
export default LobbyControlBar;
