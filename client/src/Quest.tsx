import "./Quest.css";
import editIcon from "./assets/edit.png";
import completeIcon from "./assets/done.png";
import deleteIcon from "./assets/delete.png";

type QuestProps = {
    toggleShowWarning: (action: string, idQuest: number,  title: string, 
        description?: string, members?: string[], shared?: boolean) => void;
    idQuest: number;
    title: string;
    description: string;
    members: string[];
    shared: boolean;
}

export function Quest({ toggleShowWarning, title, description, idQuest, members, shared }: QuestProps) {
    return (
        <div className="quest-main-conatiner">
            <div className="quest-text-box">
                <div className="quest-title-box">
                    <h2 className="quest-title">{title}</h2>
                </div>

                <div className="quest-description-box">{description}</div>

                <div className="editor-box tags-box">
                    {members.map((member) => (
                        <div className="member-tag">{member}</div>
                    ))}
                </div>
            </div>
            <div className="quest-button-box">
                <img src={completeIcon} className="quest-icon" onClick={() => toggleShowWarning("complete", idQuest, title)} alt="Edit quest" />
                <img src={editIcon} className="quest-icon" onClick={() => toggleShowWarning("edit", idQuest, title, description, members, shared)} alt="Complete task" />
                <img src={deleteIcon} className="quest-icon" onClick={() => toggleShowWarning("delete", idQuest, title)} alt="Delete task" />
            </div>
        </div>
    )
}