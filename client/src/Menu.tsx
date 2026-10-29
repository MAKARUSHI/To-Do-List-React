import "./Menu.css";
import { Quest } from "./Quest";
import addIcon from "./assets/plus.png";
import { useState, useEffect } from "react";
import { Warning } from "./Warning";
import { getTasks } from "./Api";
import { TaskEditor } from "./TaskEditor";
import type { GetTasksResponse } from "./Types";

type MenuProps = {
    setShowWarning: (show: boolean) => void;
    showWarning: boolean;
    idUser: number;
    username: string;
}

export function Menu({ setShowWarning, showWarning, idUser, username }: MenuProps) {
    const [warningText, setWarningtext] = useState("");
    const [questAction, setQuestAction] = useState("");
    const [taskEditor, setTaskEditor] = useState(false);

    // 1. Hold the response in state with a safe initial empty array structure
    const [tasksList, setTasksList] = useState<GetTasksResponse>({ status: false, tasks: [] });

    // 2. Fetch the tasks when the component loads
    useEffect(() => {
        getTasks({ idUser }).then((data) => {
            if (data) {
                setTasksList(data);
            }
        });
    }, [idUser]);

    function toggleShowWarning(action: string) {
        if (action === "complete") {
            setQuestAction("complete")
        } else if (action === "edit") {
            setQuestAction("edit");
        } else if (action === "delete") {
            setQuestAction("delete");
        }
        setWarningtext(action);
        setShowWarning(true);
    }

    function warningControl(action: string) {
        setShowWarning(false);
        if (action === "submit") {
            if (questAction === "complete") {
                console.log("ques completed");
            }
        }
    }
    
    return (
        <div className="menu-main-container">
            <div className="menu-title-box">
                <h1 className="menu-title">Tasks</h1>

                <img src={addIcon} className="quest-icon" alt="Create new task" onClick={() => setTaskEditor(true)}/>
            </div>
            {tasksList.tasks.map((task, _) => (
                <Quest title={task.title} description={task.description} toggleShowWarning={toggleShowWarning}/>
            ))}

            {showWarning && 
                <Warning func={warningControl} title={warningText} firstButtonText="Cancel" secondButtontext="Submit"/>
            }
            {taskEditor && 
                <TaskEditor setTaskEditor={setTaskEditor} username={username}/>
            }

        </div>
    )
}