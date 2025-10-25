import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiTwitter, FiLinkedin, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedProfile, setSavedProfile] = useState(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const defaultForm = {
    "Enter your Anonymous Name": "",
    "Which batch are you from": "",
    "Enter your gender": "",
    "Enter your branch": "",
    "Enter your hobbies": "",
    "What makes you unique": "",
    "What kind of partner do you like": "",
    "Enter your height": "",
    "Enter your weight": "",
    "Enter your Skin Tone": "",
    "Do you have any pets": "",
    "Enter which languages": "",
    "What is your zodiacSign": "",
    "Enter your habits": "",
    "Relationship Type": "",
  };

  // Load from localStorage
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    return saved ? JSON.parse(saved) : defaultForm;
  });

  // Save to localStorage every change
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const openContactForm = () => setContactFormOpen(true);
  const closeContactForm = () => setContactFormOpen(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setSavedProfile(data);
      } catch (err) {
        console.error(err);
      }
    };

    const params = new URLSearchParams(window.location.search);
    if (params.get("loggedIn")) {
      fetchUser();
      window.history.replaceState({}, document.title, "/");
    } else {
      fetchUser();
    }
   }, [BACKEND_URL]);

  // Prefill form if user data exists
  useEffect(() => {
    if (savedProfile) {
      setFormData((prev) => ({
        ...prev,
        "Enter your Anonymous Name": savedProfile.name || prev["Enter your Anonymous Name"],
        "Which batch are you from": savedProfile.batch || prev["Which batch are you from"],
        "Enter your gender": savedProfile.gender || prev["Enter your gender"],
        "Enter your branch": savedProfile.branch || prev["Enter your branch"],
        "Enter your hobbies": savedProfile.hobbies || prev["Enter your hobbies"],
        "What makes you unique": savedProfile.uniqueness || prev["What makes you unique"],
        "What kind of partner do you like": savedProfile.myType || prev["What kind of partner do you like"],
        "Enter your height": savedProfile.height || prev["Enter your height"],
        "Enter your weight": savedProfile.weight || prev["Enter your weight"],
        "Enter your Skin Tone": savedProfile.skinTone || prev["Enter your Skin Tone"],
        "Do you have any pets": savedProfile.pets || prev["Do you have any pets"],
        "Enter which languages": savedProfile.languages || prev["Enter which languages"],
        "What is your zodiacSign": savedProfile.zodiacSign || prev["What is your zodiacSign"],
        "Enter your habits": savedProfile.habits || prev["Enter your habits"],
        "Relationship Type": savedProfile.relationshipType || prev["Relationship Type"],
      }));
    }
  }, [savedProfile]);

  // Handle text & radio changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Profile picture upload
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!savedProfile?._id) return alert("User not logged in");

    const payload = {
      _id: savedProfile._id,
      name: formData["Enter your Anonymous Name"],
      batch: formData["Which batch are you from"],
      gender: formData["Enter your gender"],
      branch: formData["Enter your branch"],
      hobbies: formData["Enter your hobbies"],
      uniqueness: formData["What makes you unique"],
      myType: formData["What kind of partner do you like"],
      height: formData["Enter your height"],
      weight: formData["Enter your weight"],
      skinTone: formData["Enter your Skin Tone"],
      pets: formData["Do you have any pets"],
      languages: formData["Enter which languages"],
      zodiacSign: formData["What is your zodiacSign"],
      habits: formData["Enter your habits"],
      relationshipType: formData["Relationship Type"],
      profilePic,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/saveProfile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Profile saved!");
        setSavedProfile(data.user);
        localStorage.setItem("formData", JSON.stringify(formData));
        setContactFormOpen(false);
      } else {
        alert(data.error || "Error saving profile");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleOpenProfile = () => {
    openContactForm();
    if (savedProfile) setProfilePic(savedProfile.profilePic);
  };

  return (
    <header className="absolute w-full z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 25, delay: 0.3, duration: 1.2 }}
          className="flex items-center"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-500 to-gray-100 flex items-center justify-center text-purple-600 font-bold text-xl mr-3">
            N
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
            Nist_Match
          </span>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="lg:flex hidden space-x-8">
          {["Home", "About", "Matches", "Profile", "Contact"].map((item, index) => (
            <motion.a
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.7 + index * 0.2 }}
              className="relative text-gray-200 hover:text-violet-400 font-medium transition-colors duration-300 group"
              href="#"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          ))}
        </nav>

        {/* Socials + Buttons */}
        <div className="md:flex hidden items-center space-x-4">
          {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
            <motion.a
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="text-gray-300 hover:text-violet-400 transition-colors duration-300"
              href="#"
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}

          {/* Google Sign-In / Logout */}
          <motion.button
            o onClick={() => {
              if (!savedProfile) {
                window.location.href = `${BACKEND_URL}/auth/google`;
              } else {
                window.location.href = `${BACKEND_URL}/api/logout`;
              }
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="ml-4 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-500"
          >
            {savedProfile ? `Signed in as ${savedProfile.name}` : "Sign in with Google"}
          </motion.button>

          {/* Open Profile */}
          <motion.button
            onClick={handleOpenProfile}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="ml-4 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-500"
          >
            {savedProfile ? "See Your Profile" : "Create Your Profile"}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <motion.button whileTap={{ scale: 0.7 }} onClick={toggleMenu} className="text-gray-300">
            {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {contactFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 200, duration: 0.8 }}
              className="bg-gray-900 text-gray-300 w-full h-full overflow-y-auto p-6 sm:p-10 rounded-none"
            >
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-200">About You</h1>
                <button onClick={closeContactForm}>
                  <FiX className="w-5 h-5 text-gray-300 font-extrabold" />
                </button>
              </div>

              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <img
                    src={profilePic || "https://via.placeholder.com/120"}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-violet-600 shadow-lg"
                  />
                  <label
                    htmlFor="profilePic"
                    className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full cursor-pointer hover:bg-violet-700 transition flex items-center justify-center"
                    style={{ transform: "translate(20%, 20%)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c.828 0 1.5.672 1.5 1.5S12.828 14 12 14s-1.5-.672-1.5-1.5S11.172 11 12 11zM4 7h3l1-2h8l1 2h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"
                      />
                    </svg>
                  </label>
                  <input id="profilePic" type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                </div>
                <p className="text-sm text-gray-400 mt-2">Upload your profile picture</p>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => {
                  if (["Enter your gender", "Which batch are you from", "Relationship Type"].includes(key)) return null;
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-300 mb-1">{key}</label>
                      <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        placeholder={`Your ${key}`}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-700 text-gray-200 placeholder-gray-400"
                      />
                    </div>
                  );
                })}

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Enter your gender</label>
                  <div className="flex flex-wrap gap-4">
                    {["Male", "Female", "Other"].map((gender) => (
                      <label key={gender} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="Enter your gender"
                          value={gender}
                          checked={formData["Enter your gender"] === gender}
                          onChange={handleChange}
                          className="accent-violet-500"
                        />
                        <span>{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Batch */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Which batch are you from</label>
                  <div className="flex flex-wrap gap-4">
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((batch) => (
                      <label key={batch} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="Which batch are you from"
                          value={batch}
                          checked={formData["Which batch are you from"] === batch}
                          onChange={handleChange}
                          className="accent-violet-500"
                        />
                        <span>{batch}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Relationship Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Kind of relationship I am looking for</label>
                  <div className="flex flex-wrap gap-4">
                    {["Casual", "Serious", "Friendship"].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="Relationship Type"
                          value={type}
                          checked={formData["Relationship Type"] === type}
                          onChange={handleChange}
                          className="accent-violet-500"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full px-4 py-2 mt-6 bg-gradient-to-r from-violet-600 to-violet-400 hover:from-violet-700 hover:to-purple-700 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg hover:shadow-violet-600/50 font-semibold text-white"
                >
                  Save
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
