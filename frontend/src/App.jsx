import React from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CareerGuidance from "./pages/student/CareerGuidance";
import Chatbot from "./pages/student/Chatbot";
import RecommendSkills from "./pages/student/RecommendSkills";
import ResumeScore from "./pages/student/ResumeScore";
import AllCollegeMentors from "./pages/student/AllCollegeMentors";
import AllIndustryMentors from "./pages/student/AllIndustryMentors";
import Chat from "./pages/student/Chat";
import IndChats from "./pages/industry/IndChats";
import PsychoChats from "./pages/psycho/PsychoChats";
import CollegeChats from "./pages/college/CollegeChats";
import AddTask from "./pages/college/AddTask";
import Tasks from "./pages/student/Tasks";
import Profile from "./pages/student/Profile";
import AddFace from "./pages/student/AddFace";
import CollegeFeedBack from "./pages/college/CollegeFeedBack";
import IndFeedBack from "./pages/industry/IndFeedback";
import Quiz from "./pages/student/Quiz";
import Certification from "./pages/student/Certification";
import CareerSimulator from "./pages/student/CareerSimulator";
import WellnessDashboard from "./pages/student/WellnessDashboard";
import AISkillsAssessment from "./pages/student/AISkillsAssessment";
import RoadmapNavigator from "./pages/student/RoadmapNavigator";
import StudentChatroom from "./pages/student/StudentChatroom";
import Sidebar from "./components/Sidebar";
import ResumeAnalyzer from "./pages/ats/ResumeAnalyzer";
import ResumeBuilder from "./pages/ats/ResumeBuilder";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/career" element={<CareerGuidance />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/college-chats" element={<CollegeChats />} />
          <Route path="/ind-chats" element={<IndChats />} />
          <Route path="/psycho-chats" element={<PsychoChats/>} />
          <Route path="/recommendSkills" element={<RecommendSkills />} />
          <Route path="/ats" element={<ResumeScore />} />
          <Route path="/allCollegeMentors" element={<AllCollegeMentors />} />
          <Route path="/allIndustryMentors" element={<AllIndustryMentors />} />
          <Route path="/addTask" element={<AddTask />} />
          <Route path="/allTask" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addFace" element={<AddFace />} />
          <Route path="/collegeFeedback" element={<CollegeFeedBack />} />
          <Route path="/indFeedback" element={<IndFeedBack />} />
          <Route path="/Quiz" element={<Quiz/>} />
          <Route path="/certification" element={<Certification/>} />
          <Route path="/career-simulator" element={<CareerSimulator/>} />
          <Route path="/wellness" element={<WellnessDashboard/>} />
          <Route path="/ai-assessment" element={<AISkillsAssessment/>} />
          <Route path="/roadmap" element={<RoadmapNavigator/>} />
          <Route path="/roadmap" element={<RoadmapNavigator/>} />
          <Route path="/chatroom" element={<StudentChatroom/>} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer/>} />
          <Route path="/resume-builder" element={<ResumeBuilder/>} />

        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
