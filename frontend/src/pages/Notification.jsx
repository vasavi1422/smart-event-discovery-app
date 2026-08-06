import { useEffect, useState } from "react";
import API from "../api";

export default function Notifications() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/notifications").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>All Notifications</h2>
      {data.map(n => (
        <div key={n._id}>{n.message}</div>
      ))}
    </div>
  );
}