import "./TaskEditor.css";
import { useState } from "react";
import { createTask } from "./Api";
import addIcon from "./assets/plus.png";
import { checkMember, taskAction } from "./Api";
import type { Quest } from "./Menu";

type TaskEditorProps = {
    setTaskEditor: (prev: boolean) => void;
    fetchTasks: () => void;
    setQuest: (quest: Quest | null) => void;
    quest: Quest | null;
    username: string;
}

export function TaskEditor({ setTaskEditor, username, fetchTasks, setQuest, quest }: TaskEditorProps) {
    
    const [title, setTitle] = useState(quest?.title ?? "");
    const [description, setDescription] = useState(quest?.description ?? "");
    const [shared, setShared] = useState(quest?.shared ?? false);
    
    
    const [titleError, setTitleError] = useState("");
    
    const [member, setMember] = useState("");
    let [members, setMembers] = useState<string[]>(quest?.members ?? [username]);
    const [memberError, setMemberError] = useState("");

    async function addMember(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const response = await checkMember(member);

        if (response.status) {
            if (!members.includes(member)) {
                setMembers([...members, member]);
                setMember("");
                setMemberError("");
            } else {
                setMemberError("Member already added");
            }
        } else {
            setMemberError("Member not found");
        }
        
    }

    function closeEditor() {
        setTitle("");
        setDescription("");
        setMembers([]);
        setShared(false);
        setQuest(null);
        setTaskEditor(false);
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();

        if (!title.trim()) {
            setTitleError("Please input title");
        } else if (members.length === 0) {
            setMemberError("No chosen members");
        } else {
            setTitleError("");
            setMemberError("");
            
            if (!quest) {
                await createTask({ action: "create", username: username, members: members, title: title, description: description, shared: shared });
            } else if (quest) {
                await taskAction({action: "edit", username: username, idQuest: quest.idQuest, 
                    title: title, description: description, members: members, shared: shared});
            }
            
            fetchTasks();
            closeEditor();
        }
    }

    return (
        <div>
            <div className="settings-close-back-box" onClick={() => {setTaskEditor(false); closeEditor();}}></div>

            <form onSubmit={handleSubmit}  className="task-editor-container">
                <div className="editor-box">
                    <h2 className="editor-title">Title</h2>
                    <input type="text" className="editor-input" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    <p className="editor-error-text">{titleError}</p>
                </div>

                <div className="editor-box">
                    <h2 className="editor-title">Description</h2>
                    <textarea className="editor-input" placeholder="Task description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                
                <div className="editor-box tags-box">
                    {members.map((username, index) => (
                        <div key={index} className="member-tag">
                            {username} <img className="member-tag-delete-icon" src={addIcon} onClick={() => setMembers(members.filter((_, i) => i !== index))} alt="Remove member" />
                        </div>
                    ))}
                </div>

                <div className="editor-box">
                    <div style={{"display": "flex", "justifyContent": "space-between"}}><h2 className="editor-title">Party members</h2>
                        <div style={{"display": "flex", "alignItems": "center"}}>
                            <h3 className="editor-title">Shared</h3>
                            <input type="checkbox" checked={shared} onChange={() => setShared(prev => !prev)} style={{"marginLeft": "10px"}}/>
                        </div>
                    </div>
                    <input type="text"  className="editor-input" placeholder="Member username" value={member} onChange={(e) => setMember(e.target.value.toLowerCase())}/>
                    <p className="editor-error-text">{memberError}</p>
                    <button className="editor-button" onClick={addMember}>Add member</button>
                </div>

                <div className="editor-box">
                    <button type="submit" className="editor-button">{!quest ? "Create" : "Submit" }</button>
                </div>
            </form>
        </div>
    )
}