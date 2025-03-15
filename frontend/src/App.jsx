import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;



// Now you can access the variables:
console.log('DB name from env:', import.meta.env.VITE_DB_NAME);



function App() {
  // State for the list of puppies
  const [puppies, setPuppies] = useState([]);
  
  // State for the add form
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age_est: "",
    current_kennel_number: "",
  });
  
  // State for tracking which puppy is being edited
  const [editingPuppy, setEditingPuppy] = useState(null);
  
  // State for the edit form data
  const [editFormData, setEditFormData] = useState({
    name: "",
    breed: "",
    age_est: "",
    current_kennel_number: "",
  });

  // Fetch puppies when the component mounts
  useEffect(() => {
    fetchPuppies();
  }, []);

  const fetchPuppies = () => {
    axios
      .get("http://localhost:5000/puppies")
      .then((res) => setPuppies(res.data))
      .catch((err) => console.error("Error fetching puppies:", err));
  };

  // Handle changes for the add form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new puppy
  const addPuppy = () => {
    // Debug: log formData to see what’s being sent
    console.log("Adding puppy with data:", formData);
    axios
      .post("http://localhost:5000/puppies", formData)
      .then((res) => {
        console.log("Puppy added:", res.data);
        // Clear the form
        setFormData({ name: "", breed: "", age_est: "", current_kennel_number: "" });
        fetchPuppies();
      })
      .catch((err) => console.error("Error adding puppy:", err));
  };

  // Delete a puppy by ID
  const deletePuppy = (id) => {
    axios
      .delete(`http://localhost:5000/puppies/${id}`)
      .then(() => fetchPuppies())
      .catch((err) => console.error("Error deleting puppy:", err));
  };

  // Begin editing a puppy
  const startEditing = (puppy) => {
    setEditingPuppy(puppy);
    setEditFormData({
      name: puppy.name,
      breed: puppy.breed,
      age_est: puppy.age_est,
      current_kennel_number: puppy.current_kennel_number,
    });
  };

  // Handle changes for the edit form
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Update the puppy (PUT request)
  const updatePuppy = () => {
    axios
      .put(`http://localhost:5000/puppies/${editingPuppy.pet_id}`, editFormData)
      .then(() => {
        setEditingPuppy(null);
        fetchPuppies();
      })
      .catch((err) => console.error("Error updating puppy:", err));
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPuppy(null);
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Puppy Management</h1>
      
      {/* Add Puppy Form */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Add Puppy</h2>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <input
          name="breed"
          placeholder="Breed"
          value={formData.breed}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <input
          name="age_est"
          type="number"
          placeholder="Age"
          value={formData.age_est}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <input
          name="current_kennel_number"
          type="number"
          placeholder="Kennel Number"
          value={formData.current_kennel_number}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addPuppy}>Add Puppy</button>
      </div>

      {/* Puppies List Table */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Puppies List</h2>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Kennel #</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {puppies.map((puppy) => (
              <tr key={puppy.pet_id}>
                <td>{puppy.pet_id}</td>
                <td>{puppy.name}</td>
                <td>{puppy.breed}</td>
                <td>{puppy.age_est}</td>
                <td>{puppy.current_kennel_number}</td>
                <td>
                  <button onClick={() => startEditing(puppy)}>Edit</button>
                  <button onClick={() => deletePuppy(puppy.pet_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Puppy Form */}
      {editingPuppy && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Edit Puppy (ID: {editingPuppy.pet_id})</h2>
          <input
            name="name"
            placeholder="Name"
            value={editFormData.name}
            onChange={handleEditChange}
            style={{ marginRight: "10px" }}
          />
          <input
            name="breed"
            placeholder="Breed"
            value={editFormData.breed}
            onChange={handleEditChange}
            style={{ marginRight: "10px" }}
          />
          <input
            name="age_est"
            type="number"
            placeholder="Age"
            value={editFormData.age_est}
            onChange={handleEditChange}
            style={{ marginRight: "10px" }}
          />
          <input
            name="current_kennel_number"
            type="number"
            placeholder="Kennel Number"
            value={editFormData.current_kennel_number}
            onChange={handleEditChange}
            style={{ marginRight: "10px" }}
          />
          <button onClick={updatePuppy}>Save</button>
          <button onClick={cancelEditing} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
