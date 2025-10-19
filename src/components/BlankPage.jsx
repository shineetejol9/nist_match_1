import React, { useState } from "react";

const questions = [
  { key: "gender", question: "What gender are you looking for?", options: ["Male", "Female", "Other"] },
  { key: "age", question: "Preferred age range?", options: ["18-25", "26-35", "36-45", "46+"] },
  { key: "height", question: "Preferred height?", options: ["<5ft", "5ft-5ft6", "5ft7-6ft", "6ft+"] },
  { key: "zodiac", question: "Preferred zodiac sign?", options: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagitarius", "Capricon", "Aquaris", "Pisces"] },
  { key: "occupation", question: "Preferred occupation?", options: null }, // text input
];

const BlankPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");

 const handleAnswer = async (answer) => {
  const updatedAnswers = { ...answers, [questions[currentIndex].key]: answer };
  setAnswers(updatedAnswers);
  setInputValue("");

  if (currentIndex < questions.length - 1) {
    setCurrentIndex(currentIndex + 1);
  } else {
    try {
      // send user answers to backend
      const response = await fetch("http://localhost:5000/api/saveProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAnswers),
      });

      const data = await response.json();
      console.log("Saved:", data);
    } catch (err) {
      console.error("Error saving profile:", err);
    }

    setCurrentIndex(currentIndex + 1); // move to results
  }
};


  // Results page
  if (currentIndex >= questions.length) {
    const summary = `Your preference: ${
      Object.entries(answers)
        .map(([key, value]) => `${key} - ${value}`)
        .join(", ")
    }. These are your result according to your preferences.`;

    return (
      <div className="p-6 max-w-md mx-auto mt-20 bg-gray-100 rounded-xl shadow-lg text-black">
        <h2 className="text-2xl font-bold mb-4">Search Result</h2>
        <p className="text-lg">{summary}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 max-w-md mx-auto mt-20 bg-gray-100 rounded-xl shadow-lg text-black">
      <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>

      {currentQuestion.options ? (
        <div className="flex flex-col space-y-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your answer"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
          />
          <button
            onClick={() => inputValue && handleAnswer(inputValue)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            Next
          </button>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500">
        Question {currentIndex + 1} of {questions.length}
      </p>
    </div>
  );
};

export default BlankPage;
