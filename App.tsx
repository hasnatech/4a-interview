import React, { useState, useEffect, useRef } from "react";
import { ApplicantData, Question } from "./types";
import {
  QUESTIONS_BASE,
  APPLICANT_TYPE_QUESTION,
  EXPERIENCED_QUESTIONS,
  FRESHER_QUESTIONS,
  COMMON_QUESTIONS,
  FINAL_QUESTIONS,
} from "./constants";
import ResumePreview from "./components/ResumePreview";
import ThemeToggle from "./components/ThemeToggle";
import { ArrowRightIcon, CheckIcon } from "./components/icons";
import ProgressBar from "./components/ProgressBar";
import Confetti from "./components/Confetti";

const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "bold">("light");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<ApplicantData>>({});
  const [inputValue, setInputValue] = useState<string | File | null>("");
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionFlow, setQuestionFlow] = useState<Question[]>([
    ...QUESTIONS_BASE,
    APPLICANT_TYPE_QUESTION,
  ]);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentQuestion: Question | undefined =
    questionFlow[currentQuestionIndex];

  useEffect(() => {
    if (theme === "bold") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    inputRef.current?.focus();
    if (currentQuestion) {
      const existingValue = formData[currentQuestion.id];
      // Check for undefined and null, but allow empty string
      setInputValue(
        existingValue !== undefined && existingValue !== null
          ? existingValue
          : ""
      );
    }
  }, [currentQuestionIndex, questionFlow]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError(null);
    if (e.target.type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB

        if (file.size > MAX_SIZE) {
          setError("File is too large. Maximum size is 2MB.");
          setInputValue(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        if (currentQuestion?.id === "photo") {
          if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
            setError(
              "Invalid file type. Please upload a JPG, PNG, or GIF image."
            );
            setInputValue(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
        }

        if (currentQuestion?.id === "resume") {
          const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];
          if (!allowedTypes.includes(file.type)) {
            setError("Invalid file type. Please upload a PDF or DOC file.");
            setInputValue(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
        }
        setInputValue(file);
      }
    } else {
      setInputValue(e.target.value);
    }
  };

  const handleNext = (valueOverride?: string | File) => {
    if (!currentQuestion) return;
    setError(null);

    const valueToSave =
      valueOverride !== undefined ? valueOverride : inputValue;

    if (!currentQuestion.isOptional) {
      if (
        !valueToSave ||
        (typeof valueToSave === "string" && valueToSave.trim() === "")
      ) {
        inputRef.current?.focus();
        return;
      }
    }

    // console.log(inputType, inputValue);
    if (currentQuestion.type == "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valueToSave as string)) {
        inputRef.current?.focus();
        setError("Please enter a valid email address.");
        return;
      }
    } else if (currentQuestion.type == "tel") {
      const phoneRegex = /^(\+91[-\s]?)?\d{10}$/;
      if (!phoneRegex.test(valueToSave as string)) {
        inputRef.current?.focus();
        setError("Please enter a valid 10-digit phone number.");
        return;
      }
    } else if (currentQuestion.type == "url" && inputValue.trim() !== "") {
      const urlRegex =
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!urlRegex.test(valueToSave as string)) {
        inputRef.current?.focus();
        setError("Please enter a valid URL.");
        return;
      }
    }

    const newFormData = { ...formData, [currentQuestion.id]: valueToSave };
    setFormData(newFormData);

    let isLastQuestion = currentQuestionIndex >= questionFlow.length - 1;

    if (currentQuestion.id === "applicantType") {
      const applicantType = valueToSave as "Experienced" | "Fresher";
      const nextQuestions =
        applicantType === "Experienced"
          ? EXPERIENCED_QUESTIONS
          : FRESHER_QUESTIONS;
      const newFlow = [
        ...questionFlow.slice(0, currentQuestionIndex + 1),
        ...nextQuestions,
        ...COMMON_QUESTIONS,
        ...FINAL_QUESTIONS,
      ];
      setQuestionFlow(newFlow);
      isLastQuestion = false;
    }

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit(newFormData);
    }
  };

  const handleChoiceClick = (choice: string) => {
    setInputValue(choice);
    setTimeout(() => handleNext(choice), 300);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      currentQuestion?.type !== "textarea"
    ) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async (finalData: Partial<ApplicantData>) => {
    setIsSubmitting(true);
    setError(null);
    const webhookUrl = "https://workflow.hasnatech.cloud/webhook/44b8f3ea-4447-46c3-9697-32a516bd1883";
    // "https://workflow.hasnatech.cloud/webhook/800e4d95-97cf-4e85-ba8a-b6b431935b39";

    const submissionData = new FormData();
    const filename =
      new Date().toISOString().split("T")[0] +
      "-" + // e.g. "2025-11-10-"
      (finalData.name || "")
        .trim()
        .replace(/[^\w\s-]/g, "") // remove special characters
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-") + // collapse multiple hyphens
      (finalData.resume?.extension || "");
    Object.entries(finalData).forEach(([key, value]) => {
      if (value instanceof File) {
        submissionData.append("filename", filename);
        submissionData.append(key, value, value.name);
      } else if (typeof value === "string") {
        value = value ?? "";
        submissionData.append(key, value);
      }
    });
    // console.log("submissionData", finalData);
    try {
      await fetch(webhookUrl, {
        method: "POST",
        body: submissionData,
        // mode: 'no-cors', // Fix for CORS "Failed to fetch" error
      });

      // In 'no-cors' mode, we can't check the response, so we assume success if no network error is thrown.
      setIsCompleted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setError(
        "Sorry, there was an error submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = () => {
    if (!currentQuestion) return null;

    if (currentQuestion.type === "radio") {
      return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {currentQuestion.choices?.map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoiceClick(choice)}
              className={`text-lg md:text-xl border-2 rounded-lg px-6 py-3 transition-all duration-300 w-full transform active:scale-95
                ${inputValue === choice
                  ? "bg-primary border-primary text-white shadow-lg"
                  : "border-slate-400 dark:border-slate-600 hover:border-primary dark:hover:border-primary"
                }`}
            >
              {choice}
            </button>
          ))}
        </div>
      );
    }

    if (currentQuestion.type === "textarea") {
      return (
        <div className="w-full relative">
          <textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            value={inputValue as string}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={currentQuestion.placeholder}
            maxLength={currentQuestion.maxlength}
            className="w-full text-2xl md:text-3xl bg-transparent border-b-2 border-slate-400 dark:border-slate-600 focus:border-primary dark:focus:border-primary focus:outline-none transition-colors duration-300 py-2 resize-none h-32"
          />
          {currentQuestion.maxlength && (
            <span className="absolute bottom-4 right-2 text-xs text-slate-500">
              {(inputValue as string)?.length || 0} /{" "}
              {currentQuestion.maxlength}
            </span>
          )}
        </div>
      );
    }

    if (currentQuestion.type === "file") {
      const getAcceptTypes = () => {
        if (currentQuestion?.id === "photo")
          return "image/png, image/jpeg, image/gif";
        if (currentQuestion?.id === "resume")
          return ".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        return "*";
      };
      return (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            className="hidden"
            accept={getAcceptTypes()}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-lg md:text-xl border-2 border-slate-400 dark:border-slate-600 rounded-lg px-6 py-3 hover:border-primary dark:hover:border-primary transition-colors duration-300"
          >
            {inputValue instanceof File
              ? inputValue.name
              : currentQuestion.placeholder}
          </button>
        </div>
      );
    }

    return (
      <input
        ref={inputRef as React.Ref<HTMLInputElement>}
        type={currentQuestion.type}
        value={inputValue as string}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={currentQuestion.placeholder}
        className="w-full text-2xl md:text-3xl bg-transparent border-b-2 border-slate-400 dark:border-slate-600 focus:border-primary dark:focus:border-primary focus:outline-none transition-colors duration-300 py-2"
      />
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200`}
    >
      {isCompleted && <Confetti />}
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 relative">
          {!isCompleted && !isSubmitting && currentQuestion && (
            <div key={currentQuestionIndex} className="animate-fadeIn">
              <div className="flex items-center gap-4 text-xl md:text-2xl text-primary mb-4">
                <span>{currentQuestionIndex + 1}</span>
                <ArrowRightIcon className="w-6 h-6" />
              </div>
              <label className="text-3xl md:text-4xl font-light mb-8 block">
                {currentQuestion.label}
              </label>
              <div className="flex items-center gap-4 mt-8">
                {renderInput()}
                {currentQuestion.type !== "radio" && (
                  <button
                    onClick={() => handleNext()}
                    className="bg-primary text-white rounded-md p-3 hover:bg-primary-light transition-transform duration-200 active:scale-90 shrink-0"
                    aria-label={
                      currentQuestionIndex < questionFlow.length - 1
                        ? "Next"
                        : "Submit"
                    }
                  >
                    <CheckIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-4 animate-fadeIn">
                  {error}
                </p>
              )}
              {currentQuestion.type !== "textarea" &&
                currentQuestion.type !== "radio" &&
                currentQuestion.type !== "file" && (
                  <div className="animate-fadeIn flex items-center justify-between gap-10 mt-4">
                    <p className="text-slate-500 ">
                      press <strong>Enter ↵</strong>
                    </p>
                    {currentQuestionIndex > 0 && (
                      <button
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                        className="text-slate-400 hover:text-slate-600 text-md hover:underline mr-16 flex items-center gap-2">
                        <ArrowRightIcon className="w-4 h-4 rotate-180" />
                        Back
                      </button>
                    )}
                  </div>
                )}
            </div>
          )}

          {isSubmitting && (
            <div className="text-center animate-fadeIn">
              <h2 className="text-3xl md:text-4xl font-light mb-4">
                Submitting your application...
              </h2>
              <p className="text-slate-500">Please wait a moment...</p>
              {/* <img src="loader.gif" alt="Loading..." className="mx-auto" /> */}
            </div>
          )}

          {isCompleted && (
            <div className="text-center animate-fadeIn">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Thank You!
              </h2>
              <p className="text-xl">
                Your application has been submitted successfully.
              </p>
              <p className="text-slate-500 mt-2">
                We will get back to you soon.
              </p>
            </div>
          )}
          {!isCompleted && (
            <div className="absolute bottom-8 left-8 right-8 px-4">
              <ProgressBar
                current={currentQuestionIndex}
                total={questionFlow.length}
              />
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-950">
          <ResumePreview data={formData} theme={theme} />
        </div>
        {/* <div>
          <button onClick={handleSubmit} className="hidden lg:flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-950">
            Submit
          </button>
        </div> */}
      </main>
    </div>
  );
};

export default App;
