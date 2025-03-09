import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Video,
  Volume2,
  Bot,
  Settings,
  ChevronDown,
  Paperclip,
  X,
  Mic,
  Sliders,
  Send,
  Download,
  Plus,
} from "lucide-react";
import marketplaceItems from "../src/assets/marketplacedata";

const TunerChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Welcome to Fine-Tune Robots! Your AI assistant for optimizing robotics and automation.Upload audio, video, or images, or just ask me a question.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMediaButtons, setShowMediaButtons] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [theme, setTheme] = useState("dark"); // 'blue', 'purple', 'green', 'dark'
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const themeColors = {
    dark: {
      primary: "bg-gradient-to-r from-gray-900 to-gray-700",
      secondary: "bg-gray-700",
      accent: "bg-gray-800",
      userBubble: "bg-gradient-to-r from-gray-700 to-gray-600",
      botBubble: "bg-gray-800 dark:bg-gray-900",
      buttonHover: "hover:bg-gray-800",
      name: "Dark Studio",
    },
  };

  const colors = themeColors[theme];

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split("/")[0];
    setMediaType(fileType);

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const [marketplaceOptions, setMarketplaceOptions] = useState(null);

  // 3. Add a function to check if instruction exists in marketplace
  const checkMarketplace = (instruction) => {
    // This assumes marketplaceItems is an array of objects with at least an 'instruction' field
    const matches = marketplaceItems.filter((item) =>
      item.title.toLowerCase().includes(instruction.toLowerCase())
    );

    return matches.length > 0 ? matches : null;
  };

  // 4. Add functions to handle marketplace actions
  const handleGetFromMarketplace = (instruction) => {
    // Set a loading state
    setIsLoading(true);

    // Hide the marketplace options
    setMarketplaceOptions(null);

    // Simulate fetching from marketplace with a slight delay
    setTimeout(() => {
      // Add a bot message about getting instruction from marketplace
      const botResponse = {
        id: Date.now(),
        type: "bot",
        text: `I've obtained the "${instruction}" instruction from our marketplace. You can now use it with your robot.`,
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleRecordNew = async () => {
    try {
      // Hide marketplace options
      setMarketplaceOptions(null);
  
      // Get the current input text from the text area
      const prompt = inputText.trim();
  
      // Add user message to chat to show what's being sent
      const userMessage = {
        id: Date.now(),
        type: "user",
        text: prompt || "Sending request to Groq...",
      };
  
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
  
      console.log("prompt", prompt);

      const finalPrompt = prompt || "Autonomous Floor Cleaner";
  
      // Make the API call to Groq with the current input text
      const response = await fetch(
        `http://192.168.38.129:8000/groq?prompt=${encodeURIComponent(finalPrompt)}`,
        {
          method: "GET",
        }
      );
  
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
  
      // Parse the response
      const groqData = await response.json();
      console.log("Groq response:", groqData);
  
      // Add bot response with Groq's reply
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        text: groqData || "Received a response from Groq.",
      };
  
      setMessages((prev) => [...prev, botResponse]);
  
      // Clear the input text
      setInputText("");
    } catch (error) {
      console.error("Error in handleRecordNew:", error);
  
      // Add error message to chat
      const errorResponse = {
        id: Date.now() + 1,
        type: "bot",
        text: "Sorry, there was an error communicating with Groq. Please try again.",
      };
  
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const startVideoRecording = async () => {
    try {
      setShowVideoPopup(true); // Show the popup
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.style.display = "block";

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const response = await fetch(
        "http://192.168.38.129:8000/start_recording",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Parse the response
      const videoReqData = await response.json();

      console.log("videoReqData", videoReqData);

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setMediaPreview(videoUrl);
        setMediaType("video");

        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.style.display = "none";
        setShowVideoPopup(false); // Hide the popup when done
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing camera:", error);
      setShowVideoPopup(false); // Hide popup if there's an error
    }
  };

  // Update the stopVideoRecording function
  const stopVideoRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();

      const response = await fetch(
        "http://192.168.38.129:8000/stop_recording",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Parse the response
      const videoReqData = await response.json();

      console.log("videoReqData stop", videoReqData);

      setShowVideoPopup(false); // Hide the popup
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(blob);
        setMediaPreview(audioUrl);
        setMediaType("audio");

        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setMediaType("recording-audio");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopAudioRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.style.display = "block";

      // Wait for video to load
      videoRef.current.onloadedmetadata = () => {
        // Create a canvas to capture the photo
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        setTimeout(() => {
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          // Convert to data URL
          const imageUrl = canvas.toDataURL("image/jpeg");
          setMediaPreview(imageUrl);
          setMediaType("image");

          // Stop the camera
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
          videoRef.current.style.display = "none";
        }, 500); // Small delay to ensure video is ready
      };

      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const clearMediaPreview = () => {
    setMediaPreview(null);
    setMediaType(null);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    setShowThemeSelector(false);
  };

  // Icons for each media type
  const MediaTypeIcon = ({ type }) => {
    switch (type) {
      case "image":
        return <Camera size={16} className="mr-1" />;
      case "video":
        return <Video size={16} className="mr-1" />;
      case "audio":
        return <Volume2 size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !mediaPreview) || isLoading) return;

    if (inputText.trim() && !mediaPreview) {
      const marketplaceMatches = checkMarketplace(inputText.trim());

      if (marketplaceMatches) {
        // If we found matches, show the marketplace options instead of proceeding
        setMarketplaceOptions({
          query: inputText.trim(),
          matches: marketplaceMatches,
        });

        // Add user message to chat
        const newUserMessage = {
          id: Date.now(),
          type: "user",
          text: inputText,
        };

        setMessages([...messages, newUserMessage]);
        setInputText("");
        return;
      }
    }

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: "user",
      text: inputText,
      media: mediaPreview,
      mediaType: mediaType,
    };

    setMessages([...messages, newUserMessage]);
    setIsLoading(true);
    setInputText("");
    setMediaPreview(null);
    setMediaType(null);
    setShowMediaButtons(false);

    try {
      // Prepare form data for API call
      const formData = new FormData();

      // Add text data if available
      if (newUserMessage.text) {
        formData.append("text", newUserMessage.text);
      }

      // Add media data if available
      if (newUserMessage.media) {
        // For image and recorded media that's in base64 format
        if (newUserMessage.media.startsWith("data:")) {
          // Convert base64 to blob
          const fetchResponse = await fetch(newUserMessage.media);
          const blob = await fetchResponse.blob();
          formData.append(
            "media",
            blob,
            `${newUserMessage.mediaType}.${
              newUserMessage.mediaType === "image" ? "jpg" : "webm"
            }`
          );
        }
        // For uploaded files (which are already blobs)
        else if (newUserMessage.media instanceof Blob) {
          formData.append("media", newUserMessage.media);
        }

        // Add media type information
        formData.append("mediaType", newUserMessage.mediaType);
      }

      // Make API call to backend
      // const response = await fetch("YOUR_BACKEND_API_URL", {
      //   method: "POST",
      //   body: formData,
      //   // No Content-Type header needed as it's automatically set with boundary for FormData
      // });

      console.log("newUserMessage", newUserMessage);

      const response = await fetch(
        `http://192.168.38.129:8000/groq?prompt=${encodeURIComponent(newUserMessage.text)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Parse the response
      const botResponseData = await response.json();

      // Add bot response
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        text:
          botResponseData.message ||
          "I've received your input and processed it.",
        // If the server returns any media, add it here
        media: botResponseData.media || null,
        mediaType: botResponseData.mediaType || null,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error response to chat
      const errorResponse = {
        id: Date.now() + 1,
        type: "bot",
        text: "Sorry, I encountered an error processing your request. Please try again.",
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      } font-sans overflow-hidden`}
    >
      {/* Hidden video element for camera/video capture */}
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-full h-full object-cover z-50 hidden"
        autoPlay
        muted
      />

      {/* Header */}
      <div
        className={`${colors.primary} text-white p-4 shadow-md flex justify-between items-center`}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Tuner</h1>
        </div>
        <div className="flex items-center space-x-3">
          <span className="hidden md:inline-block text-sm font-light opacity-80">
            For everyone
          </span>
          <div className="relative">
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors flex items-center"
              title="Change Theme"
            >
              <Settings size={18} />
              <ChevronDown size={14} className="ml-1" />
            </button>

            {showThemeSelector && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-40 z-10 overflow-hidden">
                {Object.entries(themeColors).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => changeTheme(key)}
                    className={`w-full px-4 py-2 text-left flex items-center space-x-2 ${
                      theme === key
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    } transition-colors ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${value.secondary}`}
                    ></div>
                    <span>{value.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
        style={{
          backgroundImage:
            theme === "dark"
              ? "radial-gradient(circle at center, rgba(38, 38, 38, 0.2) 0%, rgba(0, 0, 0, 0) 70%)"
              : "radial-gradient(circle at center, rgba(200, 200, 250, 0.2) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            } ${index === 0 ? "animate-fadeIn" : ""}`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-2xl p-4 shadow-sm ${
                message.type === "user"
                  ? `${colors.userBubble} text-white rounded-br-none`
                  : `${colors.botBubble} ${
                      theme === "dark" ? "text-gray-100" : "text-gray-800"
                    } rounded-bl-none border ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`
              }`}
            >
              {message.type === "bot" && (
                <div className="flex items-center mb-2">
                  <div
                    className={`p-1 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    } rounded-full mr-2`}
                  >
                    <Sliders
                      size={14}
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    TUNER ASSISTANT
                  </span>
                </div>
              )}

              {message.media && (
                <div className="mb-3">
                  {message.mediaType === "image" && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={message.media}
                        alt="User shared"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  {message.mediaType === "video" && (
                    <div className="rounded-lg overflow-hidden">
                      <video
                        src={message.media}
                        controls
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  {message.mediaType === "audio" && (
                    <div className="rounded-lg overflow-hidden">
                      <audio src={message.media} controls className="w-full" />
                    </div>
                  )}
                </div>
              )}

              {message.text && (
                <p className="leading-relaxed">{message.text}</p>
              )}

              {message.showRecordButton && (
                <div className="mt-4">
                  <button
                    onClick={startVideoRecording}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white transition-colors`}
                  >
                    <Video size={16} className="mr-2" />
                    Record your video
                  </button>
                  <p
                    className={`text-xs mt-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Record a video to demonstrate the action
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                {message.mediaType && (
                  <div
                    className={`flex items-center text-xs ${
                      message.type === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    <MediaTypeIcon type={message.mediaType} />
                    <span>
                      {message.mediaType.charAt(0).toUpperCase() +
                        message.mediaType.slice(1)}
                    </span>
                  </div>
                )}
                <div
                  className={`text-xs ${
                    message.type === "user"
                      ? "text-white/70 ml-auto"
                      : "text-gray-500 ml-auto"
                  }`}
                >
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className={`${
                colors.botBubble
              } rounded-2xl rounded-bl-none p-4 shadow-sm ${
                theme === "dark"
                  ? "text-white border border-gray-700"
                  : "text-gray-800 border border-gray-200"
              }`}
            >
              <div className="flex space-x-2 items-center">
                <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <Bot
                    size={14}
                    className="text-gray-500 dark:text-gray-300 animate-pulse"
                  />
                </div>
                <div className="flex space-x-2">
                  <div
                    className={`w-2 h-2 ${
                      theme === "dark" ? "bg-gray-400" : "bg-gray-500"
                    } rounded-full animate-bounce`}
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 ${
                      theme === "dark" ? "bg-gray-400" : "bg-gray-500"
                    } rounded-full animate-bounce`}
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 ${
                      theme === "dark" ? "bg-gray-400" : "bg-gray-500"
                    } rounded-full animate-bounce`}
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Media Preview */}
      {mediaPreview && (
        <div
          className={`p-3 ${
            theme === "dark"
              ? "bg-gray-800 border-t border-gray-700"
              : "bg-white border-t border-gray-200"
          } flex justify-center relative`}
        >
          <button
            onClick={clearMediaPreview}
            className="absolute top-2 right-2 bg-gray-800/80 rounded-full p-1 text-white hover:bg-gray-900 transition-colors"
          >
            <X size={16} />
          </button>

          {mediaType === "image" && (
            <img
              src={mediaPreview}
              alt="Preview"
              className="h-32 rounded-lg shadow-sm"
            />
          )}

          {mediaType === "video" && (
            <video
              src={mediaPreview}
              className="h-32 rounded-lg shadow-sm"
              controls
            />
          )}

          {mediaType === "audio" && (
            <div className="w-full max-w-md flex items-center">
              <div className="mr-3">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                  <Volume2 size={18} className="text-purple-600" />
                </div>
              </div>
              <audio src={mediaPreview} className="w-full rounded" controls />
            </div>
          )}

          {mediaType === "recording-audio" && (
            <div className="flex items-center space-x-3 p-2 bg-red-50 rounded-lg border border-red-100 text-red-800">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Recording audio...</span>
              <button
                onClick={stopAudioRecording}
                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Stop
              </button>
            </div>
          )}
        </div>
      )}

      {marketplaceOptions && (
        <div
          className={`p-4 border-t ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div
              className={`p-4 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <h3
                className={`font-medium mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                We found similar instructions in the marketplace:
              </h3>

              <div className="mb-4">
                {marketplaceOptions.matches.map((match, index) => (
                  <div
                    key={index}
                    className={`p-3 mb-2 rounded ${
                      theme === "dark"
                        ? "bg-gray-600"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p
                      className={
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }
                    >
                      {match.title}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    handleGetFromMarketplace(marketplaceOptions.query)
                  }
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white transition-colors`}
                >
                  <Download size={16} className="mr-2" />
                  Get from marketplace
                </button>

                <button
                  onClick={handleRecordNew}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  } ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  } transition-colors`}
                >
                  <Plus size={16} className="mr-2" />
                  Record new data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className={`p-4 border-t ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } shadow-lg`}
      >
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <div className="relative">
            <button
              onClick={() => setShowMediaButtons(!showMediaButtons)}
              className={`${
                colors.secondary
              } text-white rounded-full p-3 transition-all transform ${
                showMediaButtons ? "rotate-45" : ""
              } ${colors.buttonHover} shadow-md`}
              title="Media Options"
            >
              <Paperclip size={18} />
            </button>

            {showMediaButtons && (
              <div
                className={`absolute bottom-14 left-0 ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                } rounded-lg shadow-xl border ${
                  theme === "dark" ? "border-gray-600" : "border-gray-200"
                } py-3 px-2 flex flex-col space-y-3 items-center animate-fadeIn z-10`}
              >
                <button
                  onClick={handleTakePhoto}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-blue-100 hover:bg-blue-200"
                  } ${
                    theme === "dark" ? "text-white" : "text-blue-600"
                  } rounded-full p-3 transition-colors tooltip relative group`}
                  title="Take Photo"
                >
                  <Camera size={18} />
                  <span className="tooltip-text absolute left-10 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Take Photo
                  </span>
                </button>

                {!mediaPreview || mediaType !== "video" ? (
                  <button
                    onClick={startVideoRecording}
                    className={`${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-red-100 hover:bg-red-200"
                    } ${
                      theme === "dark" ? "text-white" : "text-red-600"
                    } rounded-full p-3 transition-colors tooltip relative group`}
                    title="Record Video"
                  >
                    <Video size={18} />
                    <span className="tooltip-text absolute left-10 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Record Video
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={stopVideoRecording}
                    className="bg-red-600 text-white rounded-full p-3 hover:bg-red-700 transition-colors"
                    title="Stop Recording"
                  >
                    <X size={18} />
                  </button>
                )}

                {!mediaPreview || mediaType !== "recording-audio" ? (
                  <button
                    onClick={startAudioRecording}
                    className={`${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-green-100 hover:bg-green-200"
                    } ${
                      theme === "dark" ? "text-white" : "text-green-600"
                    } rounded-full p-3 transition-colors tooltip relative group`}
                    title="Record Audio"
                  >
                    <Mic size={18} />
                    <span className="tooltip-text absolute left-10 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Record Audio
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={stopAudioRecording}
                    className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 transition-colors"
                    title="Stop Recording"
                  >
                    <X size={18} />
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*,audio/*"
                  className="hidden"
                />

                <button
                  onClick={handleFileButtonClick}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-purple-100 hover:bg-purple-200"
                  } ${
                    theme === "dark" ? "text-white" : "text-purple-600"
                  } rounded-full p-3 transition-colors tooltip relative group`}
                  title="Upload File"
                >
                  <Paperclip size={18} />
                  <span className="tooltip-text absolute left-10 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Upload File
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            <textarea
              className={`w-full rounded-2xl pl-4 pr-12 py-3 focus:outline-none resize-none ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "border border-gray-300 focus:border-blue-500 placeholder-gray-500"
              } transition-colors shadow-sm`}
              style={{ maxHeight: "120px", minHeight: "50px" }}
              placeholder="Tune your robot, ask for help, or upload your instrument sound..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <div
              className={`absolute right-3 bottom-3 text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } pointer-events-none`}
            >
              {inputText.length > 0 && `${inputText.length}/500`}
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputText.trim() && !mediaPreview)}
            className={`rounded-full p-3 transition-all shadow-md ${
              (!inputText.trim() && !mediaPreview) || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : `${colors.secondary} text-white transform hover:scale-105 ${colors.buttonHover}`
            }`}
          >
            <Send size={18} />
          </button>
        </div>

        {/* Quick suggestion chips */}
        <div className="flex flex-wrap gap-2 mt-3 max-w-4xl mx-auto">
          <button
            onClick={() =>
              setInputText("How do I program a robot to pick up garbage?")
            }
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } border ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}
          >
            Program robot to pick up garbage
          </button>

          <button
            onClick={() =>
              setInputText("What’s the best way to automate item sorting?")
            }
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } border ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}
          >
            Automate item sorting
          </button>

          <button
            onClick={() =>
              setInputText("How do I optimize robotic arm movement?")
            }
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } border ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}
          >
            Optimize robotic arm movement
          </button>

          <button
            onClick={() =>
              setInputText("How can I teach a robot to recognize objects?")
            }
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } border ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}
          >
            Teach robot object recognition
          </button>
        </div>
      </div>

      {/* Add a floating action button for quick access to tuner */}
      <div className="fixed bottom-20 right-4 z-10">
        <button
          className={`${colors.primary} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all`}
          title="Open Tuner"
        >
          <Bot size={24} />
        </button>
      </div>

      {/* {showVideoPopup && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div
            className={`${colors.secondary} rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden`}
          >
            <div
              className={`${colors.primary} p-4 flex justify-between items-center`}
            >
              <h3 className="text-white font-medium">Record Video</h3>
              <button
                onClick={() => {
                  stopVideoRecording();
                  setShowVideoPopup(false);
                }}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 relative">
              <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 px-4 py-2 rounded-lg text-white text-center max-w-xs">
                    <p className="font-medium">
                      Place your hand at the center of the frame
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 border-2 border-dashed border-white/60 rounded-full"></div>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={stopVideoRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full flex items-center space-x-2 transition-colors"
                >
                  <span>Stop Recording</span>
                </button>
              </div>

              <p
                className={`text-xs mt-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Recording will be sent after you stop. Make sure your hand is
                clearly visible.
              </p>
            </div>
          </div>
        </div>
      )} */}

{showVideoPopup && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
    <div
      className={`${colors.secondary} rounded-xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden`}
    >
      <div
        className={`${colors.primary} p-4 flex justify-between items-center`}
      >
        <h3 className="text-white font-medium">Record Video</h3>
        <button
          onClick={() => {
            stopVideoRecording();
            setShowVideoPopup(false);
          }}
          className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 relative">
        {/* Video preview container */}
        <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
          />

          {/* Overlay instructions */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 px-5 py-3 rounded-lg text-white text-center max-w-sm">
              <p className="font-medium text-lg">
                Place your hand at the center of the frame
              </p>
            </div>
          </div>

          {/* Optional: Target indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 border-2 border-dashed border-white/60 rounded-full"></div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={stopVideoRecording}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full flex items-center space-x-2 transition-colors text-lg"
          >
            <span>Stop Recording</span>
          </button>
        </div>

        <p
          className={`text-sm mt-4 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Recording will be sent after you stop. Make sure your hand is
          clearly visible.
        </p>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default TunerChatbot;
