import "./App.css"

type DashboardProps = {
    user: {
        id: number;
        username: string;
        email: string;
    };
    onUserLogout: () => void;
}
export function Dashboard({ user, onUserLogout }:DashboardProps) {

  return (
    <div>
        <h1>Hello, {user.username}</h1>
        <button onClick={onUserLogout}>Log Out</button>
    </div>
  )
}