import "./Warning.css"

type WarningProps = {
    func: (action: string) => void;
    title: string;
    firstButtonText: string;
    secondButtontext: string;
}

export function Warning({ func, title, firstButtonText, secondButtontext }: WarningProps) {
    return (
        // Stop propagation prevents clicks from going to parent
        <div>
            <div className="settings-close-back-box" onClick={() => func("cancel")}></div>
            
            <div className="setting-delete-warning">
                <h3 className="setting-box-title">{title}</h3>
                <div style={{"display": "flex", "justifyContent": "space-between", "width": "100%"}}>
                    <button className="setting-delete-button" onClick={() => func("cancel")}>{firstButtonText}</button>
                    <button className="setting-delete-button" onClick={() => func("submit")}>{secondButtontext}</button>
                </div>
            </div>
        </div>
    )
}