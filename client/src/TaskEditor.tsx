import "./TaskEditor.css";
import { useState } from "react";
import { createTask } from "./Api";
import addIcon from "./assets/plus.png";
import { checkMember } from "./Api";

type TaskEditorProps = {
    setTaskEditor: (prev: boolean) => void;
    username: string;
}

export function TaskEditor({ setTaskEditor, username }: TaskEditorProps) {
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [shared, setShared] = useState(false);
    
    
    const [titleError, setTitleError] = useState(false);
    
    const [member, setMember] = useState("");
    let [members, setMembers] = useState<string[]>([username]);
    const [memberError, setMemberError] = useState("");

    async function addMember(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const response = await checkMember(member);

        if (response.status) {
            if (!members.includes(member)) {
                setMembers([...members, member]);
                setMember("");
            } else {
                setMemberError("Member already added");
            }
        } else {
            setMemberError("Member not found");
        }
        
    }

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        if (!title.trim()) {
            setTitleError(true);
            
        } else {
            setTitleError(false);
            createTask({username, members, title, description, shared});
            setTaskEditor(false);
        }
    }

    return (
        <div>
            <div className="settings-close-back-box" onClick={() => setTaskEditor(false)}></div>

            <form onSubmit={handleSubmit}  className="task-editor-container">
                <div className="editor-box">
                    <h2 className="editor-title">Title</h2>
                    <input type="text"  className="editor-input" placeholder="Task title" onChange={(e) => setTitle(e.target.value)}/>
                    {titleError &&
                    <p className="editor-error-text">Please input title</p>}
                </div>

                <div className="editor-box">
                    <h2 className="editor-title">Description</h2>
                    <textarea className="editor-input" placeholder="Task description" onChange={(e) => setDescription(e.target.value)}/>
                </div>
                
                <div className="editor-box tags-box">
                    {members.map((username, index) => (
                        <div key={index} className="member-tag">
                            {username} <img className="member-tax-delete-icon" src={addIcon} onClick={() => setMembers(members.filter((_, i) => i !== index))} alt="Remove member" />
                        </div>
                    ))}
                </div>

                <div className="editor-box">
                    <div style={{"display": "flex", "justifyContent": "space-between"}}><h2 className="editor-title">Party members</h2>
                        <div style={{"display": "flex", "alignItems": "center"}}>
                            <h3 className="editor-title">Shared</h3>
                            <input type="checkbox" onChange={() => setShared(prev => !prev)} style={{"marginLeft": "10px"}}/>
                        </div>
                    </div>
                    <input type="text"  className="editor-input" placeholder="Member username" value={member} onChange={(e) => setMember(e.target.value.toLowerCase())}/>
                    <p className="editor-error-text">{memberError}</p>
                    <button className="editor-button" onClick={addMember}>Add member</button>
                </div>

                <div className="editor-box">
                    <button type="submit" className="editor-button">Create</button>
                </div>
            </form>
        </div>
    )
}