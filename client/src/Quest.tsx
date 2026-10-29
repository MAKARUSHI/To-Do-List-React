import "./Quest.css";
import editIcon from "./assets/edit.png";
import completeIcon from "./assets/done.png";
import deleteIcon from "./assets/delete.png";

type QuestProps = {
    toggleShowWarning: (action: string) => void;
    title: string;
    description: string;

}

export function Quest({ toggleShowWarning, title, description }: QuestProps) {
    return (
        <div className="quest-main-conatiner">
            <div className="quest-text-box">
                <div className="quest-title-box">
                    <h2 className="quest-title">{title}</h2>
                </div>
                <div className="quest-description-box">{description}</div>
            </div>
            <div className="quest-button-box">
                <img src={completeIcon} className="quest-icon" onClick={() => toggleShowWarning("complete")} alt="Edit quest" />
                <img src={editIcon} className="quest-icon" onClick={() => toggleShowWarning("edit")} alt="Complete task" />
                <img src={deleteIcon} className="quest-icon" onClick={() => toggleShowWarning("delete")} alt="Delete task" />
            </div>
        </div>
    )
}