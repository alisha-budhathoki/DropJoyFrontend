import React, { useEffect, useState } from "react";
import axios from "axios";
import DragItem from "./components/DragItem";
import Category from "./components/Category";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [language, setLanguage] = useState("en"); // Default language is English
  const [feedback, setFeedback] = useState({ message: "", success: null, open: false });

  const fetchData = (lang) => {
    axios.get(`http://127.0.0.1:5000/api/dataList?language=${lang}&timestamp=${Date.now()}`)
      .then((response) => {
        console.log("Fetched Data:", response.data);
        setItems(response.data.items);
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData(language);
  }, [language]);

  const handleDrop = (item, category) => {
    axios
      .post("http://127.0.0.1:5000/api/validate", { item, category, language })
      .then((response) => {
        if (response.data.valid) {
          playSound("correct");
          setFeedback({
            message: language === "en" ? "Correct!" : "ठीक छ!",
            success: true,
            open: true,
          });
        } else {
          playSound("incorrect");
          setFeedback({
            message: language === "en" ? "Incorrect!" : "गलत!",
            success: false,
            open: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error validating data:", error);
      });
  };

  const playSound = (type) => {
    const correctSound = document.getElementById("correct-sound");
    const incorrectSound = document.getElementById("incorrect-sound");

    if (type === "correct") {
      correctSound.play();
    } else if (type === "incorrect") {
      incorrectSound.play();
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ne" : "en";
    setLanguage(newLang);
  };

  const handleClose = () => {
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="App" role="main" aria-label="Categorization Activity">
      {/* Audio Elements */}
      <audio id="correct-sound" src="/sounds/correct.mp3" preload="auto"></audio>
      <audio id="incorrect-sound" src="/sounds/incorrect.mp3" preload="auto"></audio>

      <header className="App-header">
        <div className="header-content">
          <h1 className="header-title">
            {language === "en" ? "Categorization Activity" : "वर्गीकरण क्रिया"}
          </h1>
          <p className="header-description">
            {language === "en"
              ? "Drag and drop items into the correct category."
              : "वस्तु क्रम को उचित समूहमा वर्ग गर्नुहोस्।"}
          </p>
          <button
            onClick={toggleLanguage}
            className="language-toggle"
            aria-label="Toggle Language"
          >
            {language === "en" ? "Switch to Nepali" : "Switch to English"}
          </button>
        </div>
      </header>

      <Snackbar
        open={feedback.open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={feedback.success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>

      <div className="container">
        <div className="items-pool" aria-label="Items to Categorize">
          <h2>{language === "en" ? "Items" : "वस्तु"}</h2>
          <div className="items">
            {items.map((item, index) => (
              <DragItem key={index} item={item} />
            ))}
          </div>
        </div>
        <div className="categories" aria-label="Categories">
          {categories.map((category, index) => (
            <Category
              key={index}
              category={category}
              onDrop={(item) => handleDrop(item, category.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
