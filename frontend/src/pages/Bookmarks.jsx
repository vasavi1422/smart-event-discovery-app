import { useEffect, useState, useContext } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function Bookmarks() {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;

    try {
      const res = await API.get("/bookmarks");

      // 🔥 only current user bookmarks
      const userBookmarks = res.data.filter(
        (b) => b.user_email === user.email
      );

      setData(userBookmarks);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookmarks");
    }
  };

  // 🔥 Remove bookmark (fixed + instant UI update)
  const remove = async (e, eventId) => {
    e.preventDefault();

    try {
      const normalizedId =
        typeof eventId === "object" ? eventId._id : eventId;

      await API.delete("/bookmarks", {
        data: {
          event_id: normalizedId,
          user_email: user.email,
        },
      });

      toast.success("Removed from bookmarks");

      // 🔥 instant UI update (no reload)
      setData((prev) =>
        prev.filter((b) => {
          const id = b.event_id?._id || b.event_id;
          return id !== normalizedId;
        })
      );

    } catch (err) {
      console.error(err);
      toast.error("Error removing bookmark");
    }
  };

  if (!user) {
    return (
      <p style={{ padding: "20px" }}>
        Please login to see bookmarks
      </p>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Bookmarks</h2>

      {data.length === 0 ? (
        <p>No saved events</p>
      ) : (
        data.map((b) => {
          const event = b.event_id;

          const eventId = event?._id || event;
          const title = event?.title || "Event";
          const city = event?.city || "";
          const image = event?.image_url;

          return (
            <div key={b._id} style={{ marginBottom: "10px" }}>
              <Link to={`/event/${eventId}`}>
                <div
                  style={{
                    border: "1px solid gray",
                    padding: "10px",
                  }}
                >
                  {image && (
                    <img src={image} width="200" alt={title} />
                  )}

                  <h3>{title}</h3>
                  <p>{city}</p>
                </div>
              </Link>

              {/* 🔥 remove button outside link to avoid navigation bugs */}
              <button
                onClick={(e) => remove(e, eventId)}
                style={{ marginTop: "5px" }}
              >
                Remove
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}