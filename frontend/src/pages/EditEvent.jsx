import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_type: "hackathon",
    department: "",
    college: "",
    city: "",
    start_date: "",
    end_date: "",
    time: "",
    image_url: "",
    registration_link: ""
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);

        const data = res.data;

        setForm({
          title: data.title || "",
          description: data.description || "",
          event_type: data.event_type || "hackathon",
          department: data.department || "",
          college: data.college || "",
          city: data.city || "",
          start_date: data.start_date?.slice(0, 10) || "",
          end_date: data.end_date?.slice(0, 10) || "",
          time: data.time || "",
          image_url: data.image_url || "",
          registration_link: data.registration_link || ""
        });

      } catch (err) {
        alert("Failed to load event");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit update
  const handleUpdate = async () => {
    try {
      await API.put(`/events/${id}`, form);

      alert("✅ Event updated successfully");

      navigate(`/event/${id}`);

    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Event</h2>

      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" /><br /><br />

      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" /><br /><br />

      <select name="event_type" value={form.event_type} onChange={handleChange}>
        <option value="hackathon">Hackathon</option>
        <option value="workshop">Workshop</option>
        <option value="seminar">Seminar</option>
        <option value="fest">Fest</option>
      </select><br /><br />

      <input name="department" value={form.department} onChange={handleChange} placeholder="Department" /><br /><br />
      <input name="college" value={form.college} onChange={handleChange} placeholder="College" /><br /><br />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" /><br /><br />

      <input type="date" name="start_date" value={form.start_date} onChange={handleChange} /><br /><br />
      <input type="date" name="end_date" value={form.end_date} onChange={handleChange} /><br /><br />
      <input type="time" name="time" value={form.time} onChange={handleChange} /><br /><br />

      <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Image URL" /><br /><br />
      <input name="registration_link" value={form.registration_link} onChange={handleChange} placeholder="Registration Link" /><br /><br />

      <button onClick={handleUpdate}>Update Event</button>
    </div>
  );
}