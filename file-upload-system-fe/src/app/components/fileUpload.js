import React, { useState, useEffect } from "react";

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    uploadFiles(selectedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    uploadFiles(droppedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    searchFiles(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    filterFiles(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
    sortFiles(event.target.value);
  };

  const uploadFiles = (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    fetch("/files/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Files uploaded successfully:", result);
        fetchFiles();
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  };

  const fetchFiles = () => {
    fetch("/files")
      .then((response) => response.json())
      .then((files) => {
        setFiles(files);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  };

  const searchFiles = (query) => {
    fetch("/files")
      .then((response) => response.json())
      .then((files) => {
        const filteredFiles = files.filter((file) =>
          file.name.toLowerCase().includes(query.toLowerCase())
        );
        setFiles(filteredFiles);
      })
      .catch((error) => {
        console.error("Error searching files:", error);
      });
  };

  const filterFiles = (type) => {
    fetch("/files")
      .then((response) => response.json())
      .then((files) => {
        const filteredFiles = files.filter((file) => file.type === type);
        setFiles(filteredFiles);
      })
      .catch((error) => {
        console.error("Error filtering files:", error);
      });
  };

  const sortFiles = (criteria) => {
    fetch("/files")
      .then((response) => response.json())
      .then((files) => {
        const sortedFiles = files.sort((a, b) => {
          if (criteria === "name") {
            return a.name.localeCompare(b.name);
          } else if (criteria === "date") {
            return new Date(a.uploadedAt) - new Date(b.uploadedAt);
          }
        });
        setFiles(sortedFiles);
      })
      .catch((error) => {
        console.error("Error sorting files:", error);
      });
  };

  const displayFiles = (files) => {
    return files.map((file) => (
      <li key={file.name}>
        {file.name} ({file.type}) - {file.status}
      </li>
    ));
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ border: "1px dashed #ccc", padding: "20px", margin: "10px 0" }}
      >
        Drag and drop files here
      </div>
      <input
        type="text"
        placeholder="Search files"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <select value={filterType} onChange={handleFilterChange}>
        <option value="">Filter by type</option>
        <option value="pdf">PDF</option>
        <option value="image">Image</option>
        <option value="text">Text</option>
      </select>
      <select value={sortCriteria} onChange={handleSortChange}>
        <option value="name">Sort by name</option>
        <option value="date">Sort by date</option>
      </select>
      <ul>{displayFiles(files)}</ul>
    </div>
  );
}

export default FileUpload;
