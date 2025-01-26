import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const MainApp = () => {
  const [query, setQuery] = useState(""); 
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 


  const fetchQuestions = async (searchTerm, page) => {
    try {
      const response = await axios.get(`https://final-speakx-main.onrender.com/${searchTerm}`, {
        params: { page, limit: 10 },
      });
      setQuestions(response.data.data);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.pages);
      setError(null); 
    } catch (err) {
      setQuestions(null);
      setError("Failed to fetch data. Please try again.");
    }
  };


  const handleSearch = () => {
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }
    setError(null); 
    fetchQuestions(query, 1);
  };

  const changePage = (newPage) => {
    fetchQuestions(query, newPage);
  };

  return (
    <div className="main-container">
      <h1>Question Finder</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search questions by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {questions &&
        questions.map((question) => (
          <div key={question._id} className="question-card">
            <h3>{question.title}</h3>
            <p>Type: {question.type}</p>
          </div>
        ))}

      {questions && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MainApp;
