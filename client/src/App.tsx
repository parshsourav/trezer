import React, { useEffect, useState } from 'react';


import axios from 'axios';

interface Name {
  id: number;
  name: string;
}

function App() {
  

   const [names, setNames] = useState<Name[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [error, setError] = useState<string>("");

   useEffect(() => {
    // Fetch data from the database using Axios
    fetchNames();
  }, []);

  const fetchNames = async (): Promise<void>=> {
    try {
      const response = await axios.get<Name[]>("/api/names");
      setNames(response.data);
      console.log(response)
     
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  };

     const handleAddName = async () => {
    // Send a POST request to add a new name
    if (validateName(newName)) {
      try {
        const response = await axios.post("/api/names", {
          name: newName,
        });

        if (response.status === 201) {
          setNewName("");
          setError("");
          //console.log(response.data);
          fetchNames();
        } else {
          console.error("Error adding name");
        }
      } catch (error) {
        console.error("Error adding name:", error);
      }
    }
  };

   
 const deleteName = async (id: any) => {
  try {
    // Delete name from the server
    await axios.delete(`/api/names/${id}`);

    // // Fetch updated data from the server
    await fetchNames(); // Assuming fetchNames is an asynchronous function
     
    // setNames((prevNames) => prevNames.filter((name) => name.id !== id));
  } catch (error) {
    console.error('Error deleting name:', error);
  }
};


  const updateName = (id: any, updatedName: string) => {
    if (validateName(updatedName)) {
      axios
        .put(`/api/names/${id}`, {
          name: updatedName,
        })
        .then((res) => {
          alert("updated");
          fetchNames();
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    if (name.trim() === "") {
      setError("Name cannot be empty.");
      return false;
    }
    if (!nameRegex.test(name)) {
      setError(
        "Name must contain only letters and spaces, and cannot have a space at the end."
      );
      return false;
    }

    if (names.some((existingName) => existingName.name === name)) {
      setError("Name must be unique.");
      return false;
    }

    // You can add more validation criteria here

    setError("");
    return true;
  };
  return (
    <div>
 
      <h1>Names from Database</h1>
      {/* Form to add a new name */}
      <div>
        <input
          type="text"
          placeholder="Enter a name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleAddName}>Add Name</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <ul>
        {names.map((name : any) => (
          
          <li key={name._id} >
            {name.name}
            <button onClick={() => deleteName(name._id )}>Delete</button>
            <button
              onClick={() => {
                const updatedName = prompt("Enter updated name:", name.name);
                if (updatedName !== null) {
                  updateName(name._id, updatedName);
                }
              }}
            >
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;