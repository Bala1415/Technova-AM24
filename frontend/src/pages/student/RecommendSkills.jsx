import React, { useState, useRef } from "react";
import { FiSearch, FiX, FiCheckCircle, FiCopy, FiExternalLink, FiSave } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

/* curated course suggestions for common skills (expand as needed) */
const skillCourses = {
  javascript: [
    { title: "JavaScript Basics – MDN Docs", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics" },
    { title: "JavaScript: The Complete Guide – Udemy", url: "https://www.udemy.com/course/the-complete-javascript-course/" },
    { title: "JavaScript Algorithms and Data Structures – FreeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  ],
  react: [
    { title: "React – The Complete Guide (Udemy)", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/" },
    { title: "React Official Docs", url: "https://react.dev/learn" },
    { title: "Build Responsive Real-World Websites with React – Udemy", url: "https://www.udemy.com/course/react-projects/" },
  ],
  node: [
    { title: "Node.js, Express, MongoDB & More – Udemy", url: "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/" },
    { title: "The Node.js Handbook – Flavio Copes (free)", url: "https://flaviocopes.com/page/node-handbook/" },
  ],
  mern: [
    { title: "MERN Stack Front To Back – Udemy", url: "https://www.udemy.com/course/mern-stack-front-to-back/" },
    { title: "Full-Stack Web Development with React (Coursera)", url: "https://www.coursera.org/specializations/full-stack-mobile-app-development" },
  ],
  python: [
    { title: "Python for Everybody – Coursera", url: "https://www.coursera.org/specializations/python" },
    { title: "Python 3 Tutorial – W3Schools", url: "https://www.w3schools.com/python/" },
  ],
  sql: [
    { title: "SQL for Data Science – Coursera", url: "https://www.coursera.org/learn/sql-for-data-science" },
    { title: "SQL Tutorial – W3Schools", url: "https://www.w3schools.com/sql/" },
  ],
  docker: [
    { title: "Docker for Beginners – Udemy", url: "https://www.udemy.com/course/docker-mastery/" },
    { title: "Docker Getting Started – Docker Docs", url: "https://docs.docker.com/get-started/" },
  ],
  aws: [
    { title: "AWS Cloud Practitioner Essentials – Skill Builder", url: "https://explore.skillbuilder.aws/learn" },
    { title: "AWS Certified Solutions Architect – Udemy", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate/" },
  ],
  pandas: [
    { title: "Data Analysis with Python – FreeCodeCamp", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
    { title: "Pandas Documentation – Tutorials", url: "https://pandas.pydata.org/docs/getting_started/index.html" },
  ],
  tensorflow: [
    { title: "Intro to TensorFlow for Deep Learning – Udacity", url: "https://www.udacity.com/course/intro-to-tensorflow-for-deep-learning--ud187" },
  ],
  flutter: [
    { title: "Flutter & Dart – The Complete Guide (Udemy)", url: "https://www.udemy.com/course/flutter-dart-the-complete-guide/" },
    { title: "Flutter Documentation – codelabs", url: "https://flutter.dev/docs/codelabs" },
  ],
  android: [
    { title: "Android Basics – Udacity", url: "https://www.udacity.com/course/android-basics--ud837" },
  ],
  "ui/ux": [
    { title: "UI/UX Design Specialization – Coursera", url: "https://www.coursera.org/specializations/ui-ux-design" },
    { title: "Learn Figma – Official Resources", url: "https://www.figma.com/resources/learn-design/" },
  ],
  devops: [
    { title: "DevOps Culture and Mindset – Coursera", url: "https://www.coursera.org/learn/devops-culture-and-mindset" },
    { title: "CI/CD with GitHub Actions – Udemy", url: "https://www.udemy.com/course/cicd-with-github-actions/" },
  ],
  "system design": [
    { title: "System Design Interview – Udemy", url: "https://www.udemy.com/course/system-design-interview-prep/" },
    { title: "Design Gurus System Design Course", url: "https://www.designgurus.io/course/grokking-the-system-design-interview" },
  ],
  "cloud architecture": [
    { title: "AWS Solutions Architect Professional – Udemy", url: "https://www.udemy.com/course/aws-certified-solutions-architect-professional/" },
    { title: "Cloud Architecture Basics – Coursera", url: "https://www.coursera.org/learn/cloud-computing-basics" },
  ],
  microservices: [
    { title: "Microservices Architecture – Udemy", url: "https://www.udemy.com/course/microservices-architecture/" },
    { title: "Building Microservices – Sam Newman (Book)", url: "https://samnewman.io/books/building_microservices/" },
  ],
  nlp: [
    { title: "Natural Language Processing Specialization – Coursera", url: "https://www.coursera.org/specializations/natural-language-processing" },
    { title: "NLP with TensorFlow – Udemy", url: "https://www.udemy.com/course/nlp-with-tensorflow/" },
  ],
  "computer vision": [
    { title: "Computer Vision – Andrew Ng (Coursera)", url: "https://www.coursera.org/learn/convolutional-neural-networks" },
    { title: "OpenCV with Python – Udemy", url: "https://www.udemy.com/course/opencv-with-python/" },
  ],
  "design patterns": [
    { title: "Design Patterns in Java – Udemy", url: "https://www.udemy.com/course/design-patterns-java/" },
    { title: "Refactoring Guru Design Patterns", url: "https://refactoring.guru/design-patterns" },
  ],
  "solid principles": [
    { title: "SOLID Principles of OOP – Udemy", url: "https://www.udemy.com/course/solid-principles-of-oop/" },
    { title: "Clean Code – Robert C. Martin (Book)", url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/" },
  ],
  java: [
    { title: "Java Complete Masterclass – Udemy", url: "https://www.udemy.com/course/java-the-complete-java-developer-course/" },
    { title: "Java Programming – Oracle Docs", url: "https://docs.oracle.com/javase/tutorial/" },
  ],
  "c++": [
    { title: "C++ for Beginners – Udemy", url: "https://www.udemy.com/course/beginning-c-plus-plus-programming/" },
    { title: "Learn C++ – cplusplus.com", url: "https://www.cplusplus.com/doc/tutorial/" },
  ],
  "c#": [
    { title: "C# for Beginners – Microsoft Learn", url: "https://learn.microsoft.com/en-us/shows/csharp-101/" },
    { title: "C# Advanced – Udemy", url: "https://www.udemy.com/course/csharp-advanced/" },
  ],
  "data structures": [
    { title: "Data Structures & Algorithms – FreeCodeCamp", url: "https://www.freecodecamp.org/learn/data-structures-and-algorithms/" },
    { title: "Algorithms Specialization – Coursera", url: "https://www.coursera.org/specializations/algorithms" },
  ],
  "software architecture": [
    { title: "Software Architecture – Udemy", url: "https://www.udemy.com/course/software-architecture-design-patterns/" },
    { title: "The Software Architect Handbook", url: "https://www.packtpub.com/product/the-software-architect-handbook" },
  ],
  "unit testing": [
    { title: "Unit Testing & Test Driven Development – Udemy", url: "https://www.udemy.com/course/unit-testing-and-test-driven-development/" },
    { title: "JUnit 5 Tutorial – Baeldung", url: "https://www.baeldung.com/junit-5" },
  ],
  refactoring: [
    { title: "Refactoring Guru – Full Course", url: "https://refactoring.guru/" },
    { title: "Clean Code Video Series – Robert C. Martin", url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/" },
  ],
  "model deployment": [
    { title: "ML Model Deployment – Udemy", url: "https://www.udemy.com/course/deployment-of-machine-learning-models/" },
    { title: "FastAPI & ML Models – Real Python", url: "https://realpython.com/fastapi/" },
  ],
  "feature engineering": [
    { title: "Feature Engineering for ML – Coursera", url: "https://www.coursera.org/learn/feature-engineering" },
    { title: "Feature Engineering Cookbook – GitHub", url: "https://github.com/topics/feature-engineering" },
  ],
  default: [
    { title: "Search courses on Coursera", url: "https://www.coursera.org/" },
    { title: "Search courses on Udemy", url: "https://www.udemy.com/" },
    { title: "Search tutorials on FreeCodeCamp", url: "https://www.freecodecamp.org/" },
  ],
  typescript: [
    { title: "Understanding TypeScript – 2023 Edition (Udemy)", url: "https://www.udemy.com/course/understanding-typescript/" },
    { title: "TypeScript Handbook – Official Docs", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
    { title: "TypeScript with React – FreeCodeCamp Tutorial", url: "https://www.freecodecamp.org/news/how-to-use-typescript-with-react/" },
  ],
  graphql: [
    { title: "GraphQL Official Docs", url: "https://graphql.org/learn/" },
    { title: "Apollo GraphQL Tutorial", url: "https://www.apollographql.com/docs/tutorial/introduction/" },
    { title: "GraphQL with React & Node – Udemy", url: "https://www.udemy.com/course/graphql-with-react-course/" },
  ],
  kubernetes: [
    { title: "Kubernetes Official Docs", url: "https://kubernetes.io/docs/home/" },
    { title: "Kubernetes for Developers – Udemy", url: "https://www.udemy.com/course/kubernetes-for-developers/" },
    { title: "CNCF Kubernetes Basics (free)", url: "https://www.cncf.io/" },
  ],
  golang: [
    { title: "A Tour of Go – Official", url: "https://tour.golang.org/" },
    { title: "Learn Go with Tests", url: "https://quii.gitbook.io/learn-go-with-tests/" },
    { title: "Go: The Complete Developer's Guide – Udemy", url: "https://www.udemy.com/course/go-the-complete-developers-guide/" },
  ],
  rust: [
    { title: "The Rust Programming Language (The Book)", url: "https://doc.rust-lang.org/book/" },
    { title: "Rustlings Exercises", url: "https://github.com/rust-lang/rustlings" },
    { title: "Rust Programming – Udemy", url: "https://www.udemy.com/course/rust-programming/" },
  ],
  "react native": [
    { title: "React Native Official Docs", url: "https://reactnative.dev/docs/getting-started" },
    { title: "React Native – The Practical Guide (Udemy)", url: "https://www.udemy.com/course/react-native-the-practical-guide/" },
    { title: "Build React Native Apps – FreeCodeCamp Tutorial", url: "https://www.freecodecamp.org/news/category/react-native/" },
  ],
  blockchain: [
    { title: "Blockchain Basics – Coursera", url: "https://www.coursera.org/learn/blockchain-basics" },
    { title: "Ethereum and Solidity: The Complete Developer's Guide – Udemy", url: "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/" },
    { title: "Intro to Blockchain – IBM Developer", url: "https://developer.ibm.com/technologies/blockchain/" },
  ],
  cybersecurity: [
    { title: "Introduction to Cybersecurity – Cisco", url: "https://www.netacad.com/courses/cybersecurity/intro-cybersecurity" },
    { title: "Web Application Security – OWASP Guides", url: "https://owasp.org/" },
    { title: "Cybersecurity Fundamentals – Coursera", url: "https://www.coursera.org/specializations/ibm-cybersecurity-analyst" },
  ],
  "big data": [
    { title: "Big Data Specialization – Coursera", url: "https://www.coursera.org/specializations/big-data" },
    { title: "Apache Spark with Scala – Udemy", url: "https://www.udemy.com/course/apache-spark-with-scala-hands-on/" },
    { title: "Intro to Big Data – edX", url: "https://www.edx.org/learn/big-data" },
  ],
  postgresql: [
    { title: "The Complete SQL Bootcamp – Udemy", url: "https://www.udemy.com/course/the-complete-sql-bootcamp/" },
    { title: "PostgreSQL Tutorial – Official Docs", url: "https://www.postgresql.org/docs/" },
    { title: "Advanced SQL for Data Scientists – Coursera", url: "https://www.coursera.org/learn/advanced-sql-for-data-scientists" },
  ],
};

/* toast helper */
const toast = (text) => {
  const el = document.createElement("div");
  el.innerText = text;
  el.style.position = "fixed";
  el.style.right = "20px";
  el.style.bottom = "20px";
  el.style.padding = "10px 14px";
  el.style.background = "#111";
  el.style.color = "#f5c518";
  el.style.borderRadius = "10px";
  el.style.zIndex = 99999;
  el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.2)";
  document.body.appendChild(el);
  setTimeout(() => { try { document.body.removeChild(el); } catch {} }, 1600);
};

const copyToClipboard = async (text) => {
  try { await navigator.clipboard.writeText(text); toast("Copied URL ✓"); }
  catch { toast(text); }
};

const openInNewTab = (url) => {
  try { window.open(url, "_blank", "noopener,noreferrer"); }
  catch { toast("Unable to open link — copy the URL instead."); }
};

const resolveCourses = (skill) => {
  if (!skill) return skillCourses.default;
  const key = skill.toLowerCase();
  if (skillCourses[key]) return skillCourses[key];
  for (const k of Object.keys(skillCourses)) {
    if (k !== "default" && key.includes(k)) return skillCourses[k];
  }
  return skillCourses.default;
};

const RecommendSkills = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const iframeRef = useRef(null);

  const jobSkillsMap = {
    "mern developer": ["JavaScript", "React", "Node.js", "Express", "MongoDB", "HTML/CSS", "REST API", "Git", "JWT Authentication", "Redux"],
    "full stack developer": ["JavaScript", "React", "Node.js", "Express", "PostgreSQL", "MongoDB", "HTML/CSS", "REST API", "Git", "Docker"],
    "frontend developer": ["JavaScript", "React", "HTML/CSS", "Tailwind CSS", "TypeScript", "Redux", "Next.js", "REST API", "Git", "Responsive Design"],
    "backend developer": ["Python", "Node.js", "Express", "PostgreSQL", "MongoDB", "REST API", "Authentication", "Git", "Docker", "Database Design"],
    "data scientist": ["Python", "Pandas", "NumPy", "TensorFlow", "Scikit-learn", "SQL", "Machine Learning", "Statistical Analysis", "Data Visualization", "Deep Learning"],
    "devops engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Git", "Linux", "Terraform", "Monitoring", "Log Management"],
    "android developer": ["Kotlin", "Java", "Android Studio", "XML", "SQLite", "REST API", "Git", "Firebase", "Material Design", "Testing"],
    "ios developer": ["Swift", "Objective-C", "Xcode", "UIKit", "SwiftUI", "Core Data", "REST API", "Git", "Firebase", "Testing"],
    "ui/ux designer": ["Figma", "UI Design", "UX Research", "Prototyping", "Wireframing", "User Testing", "Design Systems", "Adobe XD", "Interaction Design", "CSS"],
    "machine learning engineer": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "NLP", "Computer Vision", "SQL", "Statistics", "Deep Learning", "Model Deployment"],
    "cloud engineer": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Linux", "Networking", "CI/CD", "Security", "Terraform"],
    "flutter developer": ["Flutter", "Dart", "Mobile UI", "REST API", "Firebase", "SQLite", "Git", "State Management", "Provider", "Riverpod"],
    "react developer": ["React", "JavaScript", "Redux", "Next.js", "HTML/CSS", "Tailwind CSS", "REST API", "Git", "TypeScript", "Testing"],
    "python developer": ["Python", "Django", "Flask", "FastAPI", "PostgreSQL", "MongoDB", "REST API", "Git", "Testing", "OOP"],
    "system architect": ["System Design", "Cloud Architecture", "AWS", "Kubernetes", "Microservices", "Database Design", "Scalability", "Leadership", "Networking", "Problem Solving"],
    "ai developer": ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Machine Learning", "Deep Learning", "Data Science", "SQL", "Model Deployment"],
    "ml engineer": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Statistics", "SQL", "Data Analysis", "Scikit-learn", "Feature Engineering"],
    "oops developer": ["OOP Principles", "Design Patterns", "SOLID Principles", "Java", "C++", "C#", "Data Structures", "Software Architecture", "Unit Testing", "Refactoring"],
  };

  const getSkillsForJob = (jobName) => {
    const jobLower = jobName.toLowerCase().trim();
    if (jobSkillsMap[jobLower]) return jobSkillsMap[jobLower];
    for (const key in jobSkillsMap) {
      if (jobLower.includes(key) || key.includes(jobLower)) return jobSkillsMap[key];
    }
    return ["Problem Solving", "Communication", "Team Collaboration", "Learning", "Git", "Documentation", "Critical Thinking", "Time Management"];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const recommendedSkills = getSkillsForJob(jobTitle);
      if (!recommendedSkills.length) { setError("No skills found for this job title. Try a different one."); }
      else { setSkills(recommendedSkills); setIsModalOpen(true); }
    } catch (err) { console.error(err); setError(err.message || "Unexpected error"); }
    finally { setIsLoading(false); }
  };

  const closeModal = () => { setIsModalOpen(false); setSkills([]); setPreviewUrl(null); setIframeBlocked(false); };

  const openAllTopCourses = (skillsList) => {
    if (!skillsList || !skillsList.length) { toast("No skills to open."); return; }
    const opened = [];
    try {
      for (const skill of skillsList) {
        const courses = resolveCourses(skill);
        if (courses && courses.length) {
          const url = courses[0].url;
          const w = window.open(url, "_blank", "noopener,noreferrer");
          if (!w) { toast("Popup blocked — browser prevented opening multiple tabs. Allow popups and try again."); return; }
          else { opened.push(w); }
        }
      }
      if (opened.length) toast("Opened top courses in new tabs.");
    } catch (err) { console.error(err); toast("Failed to open tabs. Browser may block popups."); }
  };

  const openPreview = (url) => {
    setPreviewUrl(url);
    setIframeBlocked(false);
    setTimeout(() => {
      if (!iframeRef.current) return;
      if (!iframeRef.current.dataset.loaded) setIframeBlocked(true);
    }, 1900);
  };

  const saveLearningPlan = async () => {
    if (!skills.length) { toast("Nothing to save."); return; }
    const payload = {
      job_title: jobTitle,
      skills,
      timestamp: new Date().toISOString(),
      plan: skills.map((s) => ({ skill: s, top_course: resolveCourses(s)[0] || null })),
    };
    try {
      const resp = await fetch("http://127.0.0.1:8000/save_learning_plan/", {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`Server error ${resp.status}`);
      toast("Saved learning plan to server ✓");
    } catch (err) {
      try {
        const existing = JSON.parse(localStorage.getItem("learningPlans") || "[]");
        existing.push(payload);
        localStorage.setItem("learningPlans", JSON.stringify(existing));
        toast("Server unreachable — saved plan locally.");
      } catch (e) { console.error(e); toast("Failed to save plan."); }
    }
  };

  return (
    <>
      <div className="min-h-screen" style={{ background: '#ffffff' }}>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 text-center mt-[40px]" style={{ color: '#111' }}>
            Skill <span style={{ color: '#d4a800' }}>Recommendation</span> Engine
          </h1>
          <p className="text-center mb-8" style={{ color: '#666' }}>Enter a job title to discover essential skills and start learning instantly</p>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex shadow-sm rounded-full overflow-hidden max-w-2xl mx-auto"
              style={{ border: '1px solid #e5e5e5', background: '#fff' }}>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter job title (e.g., MERN developer, Data Scientist)"
                className="flex-1 px-6 py-4 focus:outline-none"
                style={{ background: 'transparent', color: '#111' }}
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !jobTitle.trim()}
                className={`px-6 flex items-center justify-center ${isLoading || !jobTitle.trim() ? "cursor-not-allowed" : ""}`}
                style={{ color: isLoading || !jobTitle.trim() ? '#ccc' : '#d4a800' }}>
                {isLoading ? <ImSpinner8 className="animate-spin" size={20} /> : <FiSearch size={20} />}
              </button>
            </div>
          </form>

          {error && (
            <div className="px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="mb-3" style={{ color: '#999' }}>Try these examples:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["MERN Developer", "Data Scientist", "DevOps Engineer", "UI/UX Designer"].map((title) => (
                <button key={title} onClick={() => setJobTitle(title)}
                  className="px-4 py-2 rounded-full text-sm transition-colors"
                  style={{ background: '#fff', border: '1px solid #e5e5e5', color: '#333' }}>
                  {title}
                </button>
              ))}
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
              <div className="w-full max-w-6xl rounded-2xl">
                <div className="rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                  style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                  {/* Sticky header */}
                  <div className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
                    style={{ background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
                        <FiCheckCircle />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold" style={{ color: '#111' }}>Recommended Skills for</h2>
                        <div className="font-medium" style={{ color: '#d4a800' }}>{jobTitle}</div>
                        <div className="text-sm mt-1" style={{ color: '#999' }}>{skills.length} essential skill{skills.length !== 1 ? "s" : ""} to master</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => openAllTopCourses(skills)} className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm transition-all"
                        style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>Open All Top Courses</button>
                      <button onClick={saveLearningPlan} className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm transition-all"
                        style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#555' }}>
                        <FiSave /> Save Learning Plan
                      </button>
                      <button onClick={closeModal} className="p-2 rounded-full" style={{ color: '#999' }}><FiX size={20} /></button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 space-y-4">
                        {skills.map((skill, idx) => {
                          const courses = resolveCourses(skill);
                          return (
                            <div key={idx} className="rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                              style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="inline-flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-md flex items-center justify-center shadow-sm"
                                      style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
                                      <span className="font-semibold">{skill.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                      <div className="text-lg font-semibold" style={{ color: '#111' }}>{skill}</div>
                                      <div className="text-xs" style={{ color: '#999' }}>Top picks to learn {skill}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button onClick={() => openInNewTab(courses[0].url)}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm transition-all"
                                    style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}
                                    title="Open top course">
                                    Open Top Course <FiExternalLink />
                                  </button>
                                  <button onClick={() => { const all = courses.map((c) => c.url).join("\n"); copyToClipboard(all); }}
                                    className="inline-flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors"
                                    style={{ background: '#fff', border: '1px solid #e5e5e5', color: '#555' }}
                                    title="Copy all course URLs">
                                    <FiCopy /> Copy Links
                                  </button>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 gap-2">
                                {courses.map((c, i) => (
                                  <div key={i} className="flex items-center justify-between rounded-md p-3"
                                    style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                                    <div>
                                      <a href="#!"
                                        onClick={(ev) => { ev.preventDefault(); setIframeBlocked(false); setPreviewUrl(c.url); }}
                                        className="text-sm underline" style={{ color: '#d4a800' }}>{c.title}</a>
                                      <div className="text-xs mt-1" style={{ color: '#999' }}>{new URL(c.url).hostname}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button onClick={() => openInNewTab(c.url)}
                                        className="px-2 py-1 rounded text-sm inline-flex items-center gap-2"
                                        style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}>
                                        Open <FiExternalLink />
                                      </button>
                                      <button onClick={() => copyToClipboard(c.url)}
                                        className="px-2 py-1 rounded text-sm inline-flex items-center gap-2"
                                        style={{ background: '#fafafa', color: '#555', border: '1px solid #e5e5e5' }}>
                                        <FiCopy /> Copy
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-3 flex items-center justify-between text-xs" style={{ color: '#999' }}>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#16a34a' }} />
                                  <div>Start with the top course, then move to the second one</div>
                                </div>
                                <div>Est. time: <span style={{ color: '#d4a800' }}>4-8 weeks</span></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Preview column */}
                      <div className="rounded-xl p-3 flex flex-col" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold" style={{ color: '#333' }}>Course Preview</div>
                          <div className="text-xs" style={{ color: '#999' }}>Click a course to preview</div>
                        </div>

                        <div className="flex-1 rounded overflow-hidden relative" style={{ background: '#fff', border: '1px solid #e5e5e5', minHeight: '300px' }}>
                          {previewUrl ? (
                            <>
                              <iframe
                                ref={iframeRef}
                                title="course-preview"
                                src={previewUrl}
                                className="w-full h-full"
                                style={{ background: '#fafafa' }}
                                onLoad={() => { if (iframeRef.current) iframeRef.current.dataset.loaded = "1"; }}
                                onError={() => setIframeBlocked(true)}
                              />
                              {iframeBlocked && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center" style={{ background: 'rgba(255,255,255,0.95)' }}>
                                  <div className="text-lg font-semibold mb-2" style={{ color: '#111' }}>Preview blocked</div>
                                  <div className="text-sm mb-3" style={{ color: '#666' }}>
                                    This site prevents embedding. Open the course in a new tab or copy the URL.
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => openInNewTab(previewUrl)} className="px-3 py-2 rounded"
                                      style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>Open in new tab</button>
                                    <button onClick={() => copyToClipboard(previewUrl)} className="px-3 py-2 rounded"
                                      style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#555' }}>Copy URL</button>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                              <div className="font-semibold mb-2" style={{ color: '#d4a800' }}>No preview selected</div>
                              <div className="text-sm" style={{ color: '#999' }}>Click a course title to load a live preview (may be blocked by some sites).</div>
                            </div>
                          )}
                        </div>

                        <div className="text-xs mt-2" style={{ color: '#999' }}>
                          Tip: use "Open Top Course" to avoid preview-block issues. If preview is blocked, copy the URL or open in new tab.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sticky footer */}
                  <div className="sticky bottom-0 z-30 px-4 py-3 flex items-center justify-end gap-3"
                    style={{ background: '#fafafa', borderTop: '1px solid #e5e5e5' }}>
                    <button onClick={saveLearningPlan} className="px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
                      <FiSave /> Save Learning Plan
                    </button>
                    <button onClick={closeModal} className="px-4 py-2 rounded-lg font-medium"
                      style={{ background: '#fff', border: '1px solid #e5e5e5', color: '#555' }}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecommendSkills;
