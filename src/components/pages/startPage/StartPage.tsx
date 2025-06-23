import { Database } from "firebase/database";
import { Lobby } from "../../../models/Lobby";
import { Player } from "../../../models/Player";
import LobbyControlBar from "../../lobbyControlBar/LobbyControlBar";
import LobbyHelper from "../../../helpers/lobbyHelper";
import GenericHelper from "../../../helpers/generichelper";
import GameHelper from "../../../helpers/gameHelper";

export interface IStartPageProps {
  db: Database;
  player: Player;
  lobby?: Lobby;
  setLobbyId: (lobbyId: string) => void;
}

const StartPage: React.FunctionComponent<IStartPageProps> = (props) => {
  return (
    <>
      {props.player && (
        <LobbyControlBar
          createLobby={() =>
            LobbyHelper.createLobby(props.db, props.player, props.setLobbyId)
          }
          joinLobby={() =>
            LobbyHelper.joinLobby(props.db, props.player, props.setLobbyId)
          }
          leaveLobby={() =>
            LobbyHelper.leaveLobby(
              props.db,
              props.player,
              props.lobby,
              props.setLobbyId
            )
          }
          lobby={props.lobby}
          player={props.player}
          updatePlayerName={(name: string) => {
            if (props.db) {
              GenericHelper.updatePlayer(
                props.db,
                props.player.id,
                { ...props.player, name },
                props.lobby
              );
            }
          }}
        />
      )}
      <div className="lobby-info">
        {props.player && props.lobby?.players && (
          <>
            <h2>Lobby: {props.lobby.id}</h2>
            <p>Players:</p>
            <ul>
              {Object.values(props.lobby.players).map((p: any) => (
                <li key={p.id}>
                  {p.name} (Points: {p.points})
                </li>
              ))}
            </ul>

            {Object.keys(props.lobby?.players ?? {}).length > 1 && (
              <button
                onClick={() => {
                  if (props.db && props.lobby) {
                    GameHelper.startGame(props.db, props.lobby);
                  }
                }}
              >
                Start Game
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default StartPage;
