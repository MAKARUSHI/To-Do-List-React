import "./Menu.css";
import { Quest } from "./Quest";
import addIcon from "./assets/plus.png";
import { useState, useEffect } from "react";
import { Warning } from "./Warning";
import { getTasks } from "./Api";
import { TaskEditor } from "./TaskEditor";
import type { GetTasksResponse } from "./Types";
import { taskAction } from "./Api";

type MenuProps = {
    setShowWarning: (show: boolean) => void;
    showWarning: boolean;
    idUser: number;
    username: string;
}

export type Quest = {
    idQuest: number;
    title?: string;
    description?: string;
    members?: string[];
    action: string;
    shared?: boolean;
}

export function Menu({ setShowWarning, showWarning, idUser, username }: MenuProps) {
    const [warningText, setWarningtext] = useState("");
    const [quest, setQuest] = useState<Quest | null>(null);
    const [taskEditor, setTaskEditor] = useState(false);

    const [tasksList, setTasksList] = useState<GetTasksResponse>({ status: false, tasks: [], count: null });

    const fetchTasks = () => {
        getTasks({ idUser }).then((data) => {
            if (data) setTasksList(data);
        });
    };

    useEffect(() => {
        fetchTasks();
    }, [idUser]);

    function toggleShowWarning(action: string, idQuest: number, title: string, 
        description?: string, members?: string[], shared?: boolean) {
        setQuest({idQuest: idQuest, action: action, title: title, description: description, members: members, shared: shared});

        if (action === "complete") {
            setWarningtext(title + " completed?");
            setShowWarning(true);    
        } else if (action === "delete") {
            setWarningtext("Delete " + title);
            setShowWarning(true);    
        } else if (action === "edit") {
            setTaskEditor(true);
        }
    }

    async function warningControl(action: string) {
        setShowWarning(false);
        if (action === "submit") {
            if (quest?.action) {
                await taskAction({action: quest.action, username: username, idQuest: quest.idQuest});
                fetchTasks();
            }
        }
    }
    
    return (
        <div className="menu-main-container">
            <div className="menu-title-box">
                <h1 className="menu-title">Tasks: {tasksList.count}</h1>

                <img src={addIcon} className="quest-icon" alt="Create new task" onClick={() => { setQuest(null); setTaskEditor(true); }}/>
            </div>
            {tasksList.tasks.length === 0 ? (
                <div className="no-tasks-container">
                    No tasks? For sure you're forgetting something critical...
                </div>
            ) : ( 
                tasksList.tasks.map((task) => (
                    <Quest key={task.id_quest} title={task.title} idQuest={task.id_quest} 
                    description={task.description ?? ""} toggleShowWarning={toggleShowWarning}
                    members={task.members} shared={task.shared ?? false}/>
                ))
            )}

            {showWarning && 
                <Warning func={warningControl} title={warningText} firstButtonText="Cancel" secondButtontext="Submit"/>
            }
            {taskEditor && 
                <TaskEditor setTaskEditor={setTaskEditor} fetchTasks={fetchTasks} 
                username={username} quest={quest} setQuest={setQuest}/>
            }

        </div>
    )
}