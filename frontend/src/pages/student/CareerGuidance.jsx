import React, { useState } from "react";
import { FiSend, FiX, FiCopy } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const defaultCourses = {
  fullstack: [
    { title: "HTML, CSS, and JavaScript for Beginners – Udemy", url: "https://www.udemy.com/course/html-css-javascript-for-beginners/" },
    { title: "FreeCodeCamp – Responsive Web Design Certification", url: "https://www.freecodecamp.org/learn/responsive-web-design/" },
    { title: "JavaScript Basics – MDN Docs", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics" },
    { title: "React – The Complete Guide (Udemy)", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/" },
    { title: "Vue Mastery – Intro to Vue 3", url: "https://www.vuemastery.com/" },
    { title: "Node.js, Express, MongoDB & More – Udemy", url: "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/" },
    { title: "Docker for Beginners – Udemy", url: "https://www.udemy.com/course/docker-mastery/" },
    { title: "AWS Free Cloud Course – Amazon Skill Builder", url: "https://explore.skillbuilder.aws/learn" },
    { title: "Building a Career in Web Development – Coursera", url: "https://www.coursera.org/learn/web-development-career" },
  ],
  data: [
    { title: "Python for Everybody – Coursera", url: "https://www.coursera.org/specializations/python" },
    { title: "Data Analysis with Python – FreeCodeCamp", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
    { title: "Intro to Machine Learning – Udacity", url: "https://www.udacity.com/course/intro-to-machine-learning--ud120" },
    { title: "Applied Data Science with Python – Coursera", url: "https://www.coursera.org/specializations/data-science-python" },
    { title: "SQL for Data Science – Coursera", url: "https://www.coursera.org/learn/sql-for-data-science" },
  ],
  mobile: [
    { title: "The Complete React Native + Hooks Course – Udemy", url: "https://www.udemy.com/course/react-native-the-practical-guide/" },
    { title: "Android Basics – Udacity", url: "https://www.udacity.com/course/android-basics--ud837" },
    { title: "iOS App Development with Swift – Coursera", url: "https://www.coursera.org/specializations/ios-development" },
  ],
};

const copyToast = (text) => {
  const el = document.createElement("div");
  el.innerText = text;
  el.style.position = "fixed";
  el.style.right = "20px";
  el.style.bottom = "20px";
  el.style.padding = "8px 12px";
  el.style.background = "#111";
  el.style.color = "#f5c518";
  el.style.borderRadius = "8px";
  el.style.zIndex = 99999;
  el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.2)";
  document.body.appendChild(el);
  setTimeout(() => { try { document.body.removeChild(el); } catch {} }, 1600);
};

const copyToClipboard = async (text) => {
  try { await navigator.clipboard.writeText(text); copyToast("Copied to clipboard ✓"); }
  catch { copyToast(text); }
};

const generateRoadmapFromInputs = (skillsArr = [], interestsArr = []) => {
  const s = skillsArr.map((x) => x.toLowerCase()).join(" ");
  const i = interestsArr.map((x) => x.toLowerCase()).join(" ");
  let path = "fullstack";
  if (i.includes("data") || s.includes("pandas") || s.includes("ml") || i.includes("machine")) path = "data";
  else if (i.includes("mobile") || s.includes("flutter") || s.includes("android") || s.includes("ios")) path = "mobile";

  if (path === "fullstack") {
    return {
      title: "Career Path for Full Stack Developer",
      overview: "12-month roadmap to become a job-ready Full Stack Developer with real projects and deployment experience.",
      stages: [
        { id: "m1-2", months: "Month 1–2", title: "Foundation", learn: ["HTML", "CSS", "JavaScript"], focus: "Building static web pages, mastering layouts & DOM manipulation", tools: ["VS Code", "GitHub", "Chrome DevTools"], output: "2 mini-projects — Portfolio page & Responsive Landing Page", howToStart: "Begin by learning the fundamentals of HTML and CSS. Practice by creating simple web pages and styling them. Move to JavaScript to understand how to make web pages interactive — focus on functions, loops, and the DOM. Build small projects like a personal portfolio and a responsive landing page.", courses: defaultCourses.fullstack.slice(0, 3) },
        { id: "m3-4", months: "Month 3–4", title: "Frontend Development", learn: ["React (or Vue)"], focus: "Components, routing, API integration", tools: ["Node.js (for build)", "Postman", "Browser DevTools"], output: "Personal Dashboard Web App", howToStart: "Once you're confident with the basics, move to a frontend framework like React or Vue. Start with components, then state management, routing, and working with REST APIs. Create a dashboard project that fetches and displays real data from an API.", courses: defaultCourses.fullstack.slice(3, 6) },
        { id: "m5-6", months: "Month 5–6", title: "Backend Development", learn: ["Node.js", "Express.js", "MongoDB"], focus: "REST APIs, authentication, database design", tools: ["Postman", "MongoDB Atlas", "VS Code"], output: "Full CRUD Project — Blog App or Task Manager", howToStart: "Start by understanding backend fundamentals — data models, routes, and authentication. Build REST endpoints with Express and connect to MongoDB. Implement login/logout and CRUD routes.", courses: defaultCourses.fullstack.slice(6, 9) },
        { id: "m7-9", months: "Month 7–9", title: "Integration & Deployment", learn: ["Docker", "CI/CD", "Cloud deploy (AWS/Vercel)"], focus: "Combine Frontend + Backend, DevOps basics", tools: ["Docker", "GitHub Actions", "AWS / Vercel / Render"], output: "Deploy Full Stack Project on cloud", howToStart: "Connect the frontend and backend and practice containerizing services with Docker. Learn simple CI/CD with GitHub Actions and deploy to a cloud provider so your project is production-accessible.", courses: [{ title: "Docker for Beginners – Udemy", url: "https://www.udemy.com/course/docker-mastery/" }, { title: "AWS Free Cloud Course – Amazon Skill Builder", url: "https://explore.skillbuilder.aws/learn" }, { title: "CI/CD Fundamentals – Coursera", url: "https://www.coursera.org/learn/continuous-integration" }] },
        { id: "m10-12", months: "Month 10–12", title: "Professional Growth", learn: ["Internships", "Freelance projects", "Advanced Topics (TypeScript, Next.js)"], focus: "AI Role: evaluate performance & plan next steps", tools: ["GitHub", "LinkedIn", "Portfolio site"], output: "Portfolio + Internship/Freelance projects; salary projection & interview readiness", howToStart: "Apply for internships and freelance gigs. Build case studies and highlight metrics. Keep learning advanced topics, prepare for interviews, and network.", courses: [{ title: "Building a Career in Web Development – Coursera", url: "https://www.coursera.org/learn/web-development-career" }, { title: "Next.js Official Learning Path", url: "https://nextjs.org/learn" }, { title: "Freelancing on Upwork for Beginners – Udemy", url: "https://www.udemy.com/course/upwork-freelancing/" }] },
      ],
      endGoal: "By the end of 12 months you'll have frontend, backend and deployment experience — a solid portfolio and job-ready skills as a Full Stack Developer.",
    };
  } else if (path === "data") {
    return {
      title: "Career Path for Data Scientist",
      overview: "12-month roadmap to become a data-savvy developer with ML basics and portfolio projects.",
      stages: [
        { id: "m1-2", months: "Month 1–2", title: "Foundation", learn: ["Python", "Numpy", "Pandas"], focus: "Data cleaning, EDA (Exploratory Data Analysis)", tools: ["Jupyter", "Pandas", "Matplotlib"], output: "2 mini projects — EDA reports & cleaned dataset", howToStart: "Start with Python basics then move to Pandas for data manipulations. Practice cleaning raw datasets and visualizing insights.", courses: defaultCourses.data.slice(0, 3) },
        { id: "m3-4", months: "Month 3–4", title: "Modeling Basics", learn: ["Supervised Learning", "Scikit-Learn"], focus: "Regression, classification, evaluation metrics", tools: ["scikit-learn", "Colab"], output: "Model notebook demonstrating baseline models", howToStart: "Learn simple models with scikit-learn, evaluate with cross-validation and metrics, and document results in notebooks.", courses: defaultCourses.data.slice(3, 5) },
        { id: "m5-6", months: "Month 5–6", title: "Advanced Modeling", learn: ["Deep Learning basics", "Model deployment"], focus: "Neural networks, model serving", tools: ["TensorFlow/PyTorch", "FastAPI"], output: "Deployed model demo or API", howToStart: "Learn fundamentals of neural networks and practice deploying a model as an endpoint for apps to call.", courses: [{ title: "Intro to Machine Learning – Udacity", url: "https://www.udacity.com/course/intro-to-machine-learning--ud120" }] },
        { id: "m7-9", months: "Month 7–9", title: "Production & Engineering", learn: ["Data pipelines", "MLOps basics"], focus: "Data engineering & reproducibility", tools: ["Airflow/Prefect", "Docker", "Cloud storage"], output: "End-to-end pipeline moving data to model to endpoint", howToStart: "Practice building robust pipelines and containerize workloads. Learn how to reproduce experiments and version data.", courses: [{ title: "Data Engineering – Coursera", url: "https://www.coursera.org/specializations/data-engineering" }] },
        { id: "m10-12", months: "Month 10–12", title: "Professional Growth", learn: ["Interviews", "Portfolio & Research"], focus: "Internship, real-world projects, domain specialization", tools: ["GitHub", "Kaggle", "LinkedIn"], output: "Portfolio with end-to-end projects and model cards", howToStart: "Contribute to open datasets, publish notebooks, apply for internships, and prepare for ML interviews.", courses: [{ title: "Applied Data Science with Python – Coursera", url: "https://www.coursera.org/specializations/data-science-python" }] },
      ],
      endGoal: "By the end of 12 months you'll master data workflows and have deployed models and projects to showcase.",
    };
  } else {
    return {
      title: "Career Path for Mobile Developer",
      overview: "12-month roadmap to build native & cross-platform mobile apps and publish them.",
      stages: [
        { id: "m1-2", months: "Month 1–2", title: "Foundation", learn: ["JS / Dart / Swift basics depending on stack"], focus: "App layouts, UI basics", tools: ["VS Code", "Emulators", "Git"], output: "Simple mobile UI clones", howToStart: "Start with basics of chosen language (JS for React Native, Dart for Flutter). Build simple screens and learn navigation.", courses: defaultCourses.mobile.slice(0, 2) },
        { id: "m3-4", months: "Month 3–4", title: "App Development", learn: ["React Native / Flutter components"], focus: "State management, navigation, APIs", tools: ["Redux / Provider", "Postman"], output: "Personal Todo / Notes App", howToStart: "Build a small app with local storage and simple sync; learn state management patterns.", courses: defaultCourses.mobile.slice(0, 3) },
        { id: "m5-6", months: "Month 5–6", title: "Backend for Mobile", learn: ["APIs, Auth", "Database basics"], focus: "Integrate server with app", tools: ["Firebase / Node.js", "MongoDB"], output: "Full featured app with backend", howToStart: "Add user accounts and cloud storage; practice integrating REST or Firebase into your app.", courses: [{ title: "Firebase Essentials – Coursera", url: "https://www.coursera.org/learn/firebase" }] },
        { id: "m7-9", months: "Month 7–9", title: "Publishing & Optimization", learn: ["Performance tuning", "App store publishing"], focus: "Deploy to Play Store / App Store", tools: ["Play Console", "App Store Connect"], output: "Published app", howToStart: "Follow store guidelines and testing; publish a small app and monitor metrics.", courses: [{ title: "Android Basics – Udacity", url: "https://www.udacity.com/course/android-basics--ud837" }] },
        { id: "m10-12", months: "Month 10–12", title: "Professional Growth", learn: ["Freelance / internships", "Advanced optimization"], focus: "Monetization & scaling", tools: ["Analytics", "CI/CD"], output: "Portfolio & published apps", howToStart: "Market your app, collect reviews, and use analytics to improve retention.", courses: [{ title: "iOS App Development with Swift – Coursera", url: "https://www.coursera.org/specializations/ios-development" }] },
      ],
      endGoal: "By the end of 12 months you'll be able to ship and maintain mobile apps and build a portfolio for hiring.",
    };
  }
};

const stageTextBlock = (stage) => {
  const lines = [];
  lines.push(`${stage.title} — ${stage.months}`);
  lines.push(`Learn: ${Array.isArray(stage.learn) ? stage.learn.join(", ") : stage.learn}`);
  lines.push(`Focus: ${stage.focus}`);
  lines.push(`Tools: ${Array.isArray(stage.tools) ? stage.tools.join(", ") : stage.tools}`);
  lines.push(`Output: ${stage.output}`);
  lines.push(`How to Start: ${stage.howToStart}`);
  if (stage.courses && stage.courses.length) {
    lines.push("Courses to Learn:");
    stage.courses.forEach((c) => lines.push(`• ${c.title} — ${c.url}`));
  }
  return lines.join("\n");
};

const CareerGuidance = () => {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skills.trim() || !interests.trim()) { setError("Please enter both skills and interests"); return; }
    setIsLoading(true);
    setError(null);
    const skillsArr = skills.split(",").map((s) => s.trim()).filter(Boolean);
    const interestsArr = interests.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      const response = await fetch("http://127.0.0.1:8000/career_guidance/", {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ skills: skillsArr, interests: interestsArr }),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => null);
        try {
          const json = text ? JSON.parse(text) : null;
          if (json && json.roadmap) { setRoadmap(json.roadmap); setIsModalOpen(true); setIsLoading(false); return; }
        } catch (err) {}
        const local = generateRoadmapFromInputs(skillsArr, interestsArr);
        setRoadmap(local); setIsModalOpen(true); setIsLoading(false); return;
      }
      const data = await response.json();
      if (data?.roadmap && typeof data.roadmap === "object") setRoadmap(data.roadmap);
      else if (data?.roadmap && typeof data.roadmap === "string") { const local = generateRoadmapFromInputs(skillsArr, interestsArr); local.serverNotes = data.roadmap; setRoadmap(local); }
      else if (typeof data === "string") { const local = generateRoadmapFromInputs(skillsArr, interestsArr); local.serverNotes = data; setRoadmap(local); }
      else setRoadmap(generateRoadmapFromInputs(skillsArr, interestsArr));
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("Failed to generate roadmap — using local generator.");
      setRoadmap(generateRoadmapFromInputs(skills.split(",").map(s=>s.trim()), interests.split(",").map(s=>s.trim())));
      setIsModalOpen(true);
    } finally { setIsLoading(false); }
  };

  const closeModal = () => { setIsModalOpen(false); setRoadmap(null); };

  return (
    <>
      <div className="min-h-screen" style={{ background: '#ffffff' }}>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 text-center mt-[40px]" style={{ color: '#111' }}>
            Career Path <span style={{ color: '#d4a800' }}>Planner</span>
          </h1>
          <p className="text-center mb-8" style={{ color: '#666' }}>
            Enter your skills and interests to get a personalized career roadmap
          </p>

          <form onSubmit={handleSubmit} className="mb-12 rounded-xl p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium" style={{ color: '#333' }}>Your Skills (comma separated)</label>
                <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., MERN, JavaScript, Python"
                  className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                  disabled={isLoading} />
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: '#333' }}>Your Interests (comma separated)</label>
                <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g., website development, AI, mobile apps"
                  className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                  disabled={isLoading} />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-lg" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={isLoading || !skills.trim() || !interests.trim()}
                className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all"
                style={isLoading || !skills.trim() || !interests.trim()
                  ? { background: '#f5f5f5', color: '#999', cursor: 'not-allowed' }
                  : { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a', fontWeight: 'bold' }
                }>
                {isLoading ? (<><ImSpinner8 className="animate-spin mr-2" /> Generating Roadmap...</>) : (<><FiSend className="mr-2" /> Get Career Roadmap</>)}
              </button>
            </div>
          </form>

          {!roadmap && (
            <div className="text-center mt-12">
              <p className="mb-4" style={{ color: '#999' }}>Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => { setSkills("MERN, JavaScript"); setInterests("web development, full-stack"); }}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: '#fff', border: '1px solid #e5e5e5', color: '#333' }}>
                  Web Developer
                </button>
                <button onClick={() => { setSkills("Python, SQL"); setInterests("data analysis, machine learning"); }}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: '#fff', border: '1px solid #e5e5e5', color: '#333' }}>
                  Data Scientist
                </button>
                <button onClick={() => { setSkills("Flutter, Dart"); setInterests("mobile apps, UI/UX"); }}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: '#fff', border: '1px solid #e5e5e5', color: '#333' }}>
                  Mobile Developer
                </button>
              </div>
            </div>
          )}

          {isModalOpen && roadmap && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
              <div className="rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl"
                style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                <div className="p-6 flex items-start justify-between" style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#d4a800' }}>{roadmap.title}</h2>
                    <p className="mt-1 max-w-2xl" style={{ color: '#666' }}>{roadmap.overview}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm" style={{ color: '#999' }}>Generated for:</div>
                    <div className="text-sm" style={{ color: '#d4a800' }}>{skills} • {interests}</div>
                    <button onClick={closeModal} className="mt-3 px-3 py-1 rounded inline-flex items-center gap-2 transition-colors"
                      style={{ background: '#f5f5f5', color: '#333', border: '1px solid #e5e5e5' }}>
                      <FiX /> Close
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {roadmap.stages.map((stage) => (
                    <div key={stage.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-2 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-lg transform transition-transform hover:scale-105"
                          style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
                          {stage.months.split(" ")[0].replace("Month", "")}
                        </div>
                        <div className="mt-3 text-sm text-center" style={{ color: '#999' }}>{stage.months}</div>
                      </div>

                      <div className="md:col-span-10 p-4 rounded-lg transition-shadow hover:shadow-md"
                        style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold" style={{ color: '#111' }}>{stage.title}</h3>
                            <div className="text-sm mt-1" style={{ color: '#666' }}>{stage.focus}</div>
                          </div>
                          <button title="Copy this stage" onClick={() => copyToClipboard(stageTextBlock(stage))}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors"
                            style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
                            <FiCopy /> Copy
                          </button>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ color: '#555' }}>
                          <div>
                            <div className="font-medium" style={{ color: '#111' }}>Learn:</div>
                            <div className="mt-1">{Array.isArray(stage.learn) ? stage.learn.join(", ") : stage.learn}</div>
                            <div className="font-medium mt-3" style={{ color: '#111' }}>Tools:</div>
                            <div className="mt-1">{stage.tools ? (Array.isArray(stage.tools) ? stage.tools.join(", ") : stage.tools) : "-"}</div>
                            <div className="font-medium mt-3" style={{ color: '#111' }}>Output:</div>
                            <div className="mt-1">{stage.output}</div>
                          </div>
                          <div>
                            <div className="font-medium" style={{ color: '#111' }}>How to Start:</div>
                            <div className="mt-1" style={{ color: '#555' }}>{stage.howToStart}</div>
                            {stage.courses && stage.courses.length > 0 && (
                              <>
                                <div className="font-medium mt-3" style={{ color: '#111' }}>Courses to Learn:</div>
                                <ul className="mt-2 list-disc pl-5 text-sm">
                                  {stage.courses.map((c, idx) => (
                                    <li key={idx} className="flex items-center justify-between" style={{ color: '#333' }}>
                                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline pr-3"
                                        style={{ color: '#d4a800', textDecorationColor: '#d4a800' }}>
                                        {c.title}
                                      </a>
                                      <button onClick={() => copyToClipboard(c.url)} title="Copy course URL"
                                        className="ml-2 text-xs inline-flex items-center gap-1 px-2 py-1 rounded"
                                        style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5' }}>
                                        <FiCopy /> Copy URL
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {roadmap.endGoal && (
                    <div className="p-4 rounded-lg" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                      <h4 className="font-semibold" style={{ color: '#111' }}>End Goal</h4>
                      <p className="mt-2" style={{ color: '#555' }}>{roadmap.endGoal}</p>
                    </div>
                  )}

                  {roadmap.serverNotes && (
                    <div className="p-3 rounded-lg" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                      <div className="text-sm font-semibold" style={{ color: '#333' }}>Server notes</div>
                      <div className="text-sm mt-2 whitespace-pre-wrap" style={{ color: '#666' }}>{roadmap.serverNotes}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CareerGuidance;
