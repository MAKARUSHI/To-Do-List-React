import "./App.css"

type DashboardProps = {
    user: {
        id: number;
        username: string;
        email: string;
    };
}
export function Dashboard({ user }:DashboardProps) {

  return (
    <div>
        <h1>Hello, {user.username}</h1>
    </div>
  )
}