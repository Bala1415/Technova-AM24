import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const examData = {
  jee: {
    title: "JEE (Joint Entrance Examination)",
    subtitle: "Your roadmap to IITs, NITs & top engineering colleges",
    icon: "⚡",
    overview:
      "JEE is India's most competitive engineering entrance exam. It consists of JEE Main and JEE Advanced. A structured approach covering Physics, Chemistry, and Mathematics is essential.",
    phases: [
      {
        title: "Phase 1 — Foundation Building",
        duration: "Month 1–4",
        icon: "📚",
        description:
          "Build strong fundamentals across all three subjects. Focus on NCERT textbooks thoroughly.",
        topics: [
          {
            subject: "Mathematics",
            items: [
              "Sets, Relations & Functions",
              "Trigonometry — Ratios, Identities, Equations",
              "Complex Numbers & Quadratic Equations",
              "Sequences & Series (AP, GP, HP)",
              "Binomial Theorem",
              "Permutations & Combinations",
            ],
          },
          {
            subject: "Physics",
            items: [
              "Units, Dimensions & Measurements",
              "Kinematics — 1D and 2D Motion",
              "Newton's Laws of Motion",
              "Work, Energy & Power",
              "Rotational Motion",
              "Gravitation",
            ],
          },
          {
            subject: "Chemistry",
            items: [
              "Atomic Structure",
              "Chemical Bonding & Molecular Structure",
              "States of Matter",
              "Thermodynamics",
              "Equilibrium — Chemical & Ionic",
              "Periodic Table & Properties",
            ],
          },
        ],
        tips: [
          "Complete NCERT for all 3 subjects first",
          "Solve at least 50 problems per topic",
          "Make formula sheets for quick revision",
        ],
      },
      {
        title: "Phase 2 — Concept Deepening",
        duration: "Month 5–8",
        icon: "🔬",
        description:
          "Dive deeper into advanced concepts. Start solving problems from reference books like HC Verma, Irodov, etc.",
        topics: [
          {
            subject: "Mathematics",
            items: [
              "Coordinate Geometry (Lines, Circles, Conics)",
              "Calculus — Limits, Continuity, Differentiability",
              "Differential Equations",
              "Matrices & Determinants",
              "Probability & Statistics",
              "Vectors & 3D Geometry",
            ],
          },
          {
            subject: "Physics",
            items: [
              "Electrostatics — Coulomb's Law, Electric Field",
              "Current Electricity & Circuits",
              "Magnetism & Electromagnetic Induction",
              "Optics — Ray & Wave Optics",
              "Modern Physics — Photoelectric, Nuclear",
              "Thermodynamics & Kinetic Theory",
            ],
          },
          {
            subject: "Chemistry",
            items: [
              "Organic Chemistry — GOC, Named Reactions",
              "Carbonyl Compounds & Carboxylic Acids",
              "Coordination Chemistry",
              "Electrochemistry",
              "Chemical Kinetics",
              "D & F Block Elements",
            ],
          },
        ],
        tips: [
          "Practice from HC Verma, Cengage, and DC Pandey",
          "Take weekly subject-wise mock tests",
          "Focus on weak areas identified in tests",
        ],
      },
      {
        title: "Phase 3 — Practice & Revision",
        duration: "Month 9–11",
        icon: "🎯",
        description:
          "Intensive problem-solving and full-length mock tests. Focus on time management and accuracy.",
        topics: [
          {
            subject: "Test Strategy",
            items: [
              "Full-length JEE Main mock tests (weekly)",
              "JEE Advanced-level problem sets",
              "Previous Year Papers (PYQs) — last 15 years",
              "Error analysis after each test",
              "Time-bound practice — 3-hour sessions",
              "Mixed topic problem sets",
            ],
          },
          {
            subject: "Revision Focus",
            items: [
              "Complete formula revision (all subjects)",
              "Organic Chemistry reaction mechanisms",
              "Physics derivations & numerical practice",
              "Inorganic Chemistry — memorization topics",
              "Mathematics shortcuts & tricks",
              "NCERT back exercises (Chemistry)",
            ],
          },
        ],
        tips: [
          "Solve at least 2 full mock tests per week",
          "Analyze every test — track time per question",
          "Revise formula sheets daily before bed",
        ],
      },
      {
        title: "Phase 4 — Final Sprint",
        duration: "Month 12 (Last 30 days)",
        icon: "🚀",
        description:
          "Final revision and confidence building. No new topics — only revise and practice.",
        topics: [
          {
            subject: "Final Checklist",
            items: [
              "Revise all formula sheets & short notes",
              "Solve 1 full mock test every alternate day",
              "Focus only on high-weightage topics",
              "Practice mental math & calculation speed",
              "Read exam instructions & paper pattern",
              "Stay calm and maintain a healthy routine",
            ],
          },
        ],
        tips: [
          "Sleep 7–8 hours daily — non-negotiable!",
          "Avoid learning anything new in the last week",
          "Carry all necessary documents on exam day",
        ],
      },
    ],
    resources: [
      { name: "NCERT Textbooks (Class 11 & 12)", type: "Book", icon: "📖" },
      { name: "HC Verma — Concepts of Physics", type: "Book", icon: "📖" },
      { name: "Organic Chemistry — MS Chouhan", type: "Book", icon: "📖" },
      { name: "RD Sharma Objective Mathematics", type: "Book", icon: "📖" },
      { name: "PhysicsWallah (YouTube)", type: "Video", icon: "🎬" },
      { name: "NTA Official Mock Tests", type: "Online", icon: "💻" },
    ],
  },
  neet: {
    title: "NEET (National Eligibility cum Entrance Test)",
    subtitle: "Your roadmap to MBBS, BDS & top medical colleges",
    icon: "🩺",
    overview:
      "NEET is the single entrance exam for medical and dental courses in India. It tests Physics, Chemistry, and Biology (Botany + Zoology). Biology carries the most weightage.",
    phases: [
      {
        title: "Phase 1 — NCERT Mastery",
        duration: "Month 1–4",
        icon: "📚",
        description:
          "NCERT is the Bible for NEET. Master every line of NCERT Biology, Chemistry, and Physics.",
        topics: [
          {
            subject: "Biology (Botany)",
            items: [
              "Cell — Structure and Function",
              "Cell Division — Mitosis and Meiosis",
              "Plant Anatomy & Morphology",
              "Plant Physiology — Photosynthesis, Respiration",
              "Plant Reproduction — Sexual & Asexual",
              "Ecology — Organisms and Populations",
            ],
          },
          {
            subject: "Biology (Zoology)",
            items: [
              "Animal Kingdom — Classification",
              "Structural Organisation in Animals",
              "Human Physiology — Digestion, Breathing",
              "Body Fluids & Circulation",
              "Locomotion & Movement",
              "Neural Control & Coordination",
            ],
          },
          {
            subject: "Physics & Chemistry",
            items: [
              "Mechanics — Laws of Motion, Work & Energy",
              "Optics & Modern Physics",
              "Organic Chemistry — Hydrocarbons, GOC",
              "Chemical Bonding & Coordination Compounds",
              "Thermodynamics & Equilibrium",
              "Atomic Structure & Periodic Classification",
            ],
          },
        ],
        tips: [
          "Read NCERT Biology line by line — 3 times minimum",
          "Highlight important diagrams and flow charts",
          "Make short notes from NCERT after each chapter",
        ],
      },
      {
        title: "Phase 2 — Advanced Concepts & Practice",
        duration: "Month 5–8",
        icon: "🔬",
        description:
          "Go beyond NCERT with reference books. Focus heavily on Biology as it carries 360/720 marks.",
        topics: [
          {
            subject: "Biology Deep Dive",
            items: [
              "Genetics — Mendelian & Molecular",
              "Biotechnology — Principles & Applications",
              "Evolution — Origin of Life, Mechanisms",
              "Human Reproduction & Reproductive Health",
              "Microbes in Human Welfare",
              "Biodiversity & Conservation",
            ],
          },
          {
            subject: "Physics & Chemistry",
            items: [
              "Electrostatics & Current Electricity",
              "Electromagnetic Waves & Communication",
              "Organic Chemistry — Alcohols, Phenols, Amines",
              "Biomolecules & Polymers",
              "Electrochemistry & Chemical Kinetics",
              "Solutions & Surface Chemistry",
            ],
          },
        ],
        tips: [
          "Use Trueman's Biology for extra MCQs",
          "Solve topic-wise NEET PYQs (last 10 years)",
          "Create flowcharts for metabolic pathways",
        ],
      },
      {
        title: "Phase 3 — Mock Tests & Revision",
        duration: "Month 9–11",
        icon: "🎯",
        description:
          "Full-length NEET pattern mock tests. Biology should be your strongest scoring area.",
        topics: [
          {
            subject: "Test Strategy",
            items: [
              "Full-length NEET mock tests (3 hrs 20 min)",
              "Sectional tests — Biology, Physics, Chemistry",
              "Previous Year Papers (last 15 years)",
              "NCERT Exemplar problems",
              "Error analysis and score tracking",
              "Diagram-based questions practice",
            ],
          },
          {
            subject: "High-Yield Topics",
            items: [
              "Genetics & Evolution (very high weightage)",
              "Human Physiology (8–10 questions every year)",
              "Ecology (5–8 questions every year)",
              "Organic Chemistry reactions & mechanisms",
              "Modern Physics & Optics",
              "Plant Physiology & Morphology",
            ],
          },
        ],
        tips: [
          "Target 340+ in Biology for a strong score",
          "Time yourself: 50 min Physics, 50 min Chemistry, 100 min Biology",
          "Revise NCERT diagrams and flowcharts weekly",
        ],
      },
      {
        title: "Phase 4 — Final 30 Days",
        duration: "Last Month",
        icon: "🚀",
        description:
          "Only revision and mock tests. No new topics. Build speed and accuracy.",
        topics: [
          {
            subject: "Final Checklist",
            items: [
              "Re-read NCERT Biology completely (last time)",
              "Revise all formula sheets for Physics & Chemistry",
              "1 mock test every alternate day",
              "Focus on assertion-reasoning questions",
              "Practice diagram labelling",
              "Maintain health and sleep schedule",
            ],
          },
        ],
        tips: [
          "Biology is your scoring weapon — maximize it",
          "Don't attempt uncertain negative-marking questions",
          "Stay positive and trust your preparation",
        ],
      },
    ],
    resources: [
      { name: "NCERT Class 11 & 12 Biology", type: "Book", icon: "📖" },
      { name: "Trueman's Objective Biology", type: "Book", icon: "📖" },
      { name: "DC Pandey — Objective Physics", type: "Book", icon: "📖" },
      { name: "VK Jaiswal — Inorganic Chemistry", type: "Book", icon: "📖" },
      { name: "NEET PYQ Chapter-wise (MTG)", type: "Book", icon: "📖" },
      { name: "Aakash / Allen Test Series", type: "Online", icon: "💻" },
    ],
  },
  gate: {
    title: "GATE (Graduate Aptitude Test in Engineering)",
    subtitle: "Your roadmap to MTech in IITs/IISc & PSU recruitment",
    icon: "🎓",
    overview:
      "GATE tests comprehensive understanding of undergraduate engineering subjects. It's the gateway to MTech in top IITs/IISc and recruitment in PSUs like ISRO, BARC, DRDO, etc.",
    phases: [
      {
        title: "Phase 1 — Subject-wise Study",
        duration: "Month 1–4",
        icon: "📚",
        description:
          "Study all GATE syllabus subjects systematically. Focus on understanding concepts rather than memorization.",
        topics: [
          {
            subject: "Core Subjects (CS/IT)",
            items: [
              "Data Structures — Arrays, Trees, Graphs, Hashing",
              "Algorithms — Sorting, Searching, Greedy, DP",
              "Operating Systems — Process Mgmt, Memory",
              "DBMS — SQL, Normalization, Transactions",
              "Computer Networks — OSI/TCP-IP, Protocols",
              "Theory of Computation — Automata, Grammars",
            ],
          },
          {
            subject: "Mathematics & Aptitude",
            items: [
              "Engineering Maths — Linear Algebra, Calculus",
              "Probability & Statistics",
              "Discrete Maths — Sets, Logic, Graph Theory",
              "Digital Logic — Boolean Algebra, Circuits",
              "General Aptitude — Verbal & Numerical",
              "Computer Organization & Architecture",
            ],
          },
        ],
        tips: [
          "Follow standard textbooks (Cormen, Galvin, Navathe)",
          "Take notes with important theorems and formulas",
          "Solve GATE PYQs after each topic",
        ],
      },
      {
        title: "Phase 2 — In-depth Problem Solving",
        duration: "Month 5–8",
        icon: "🔬",
        description:
          "Focus on solving advanced problems. Master NAT and MSQ question types.",
        topics: [
          {
            subject: "Advanced Topics",
            items: [
              "Compiler Design — Parsing, Code Optimization",
              "Computer Architecture — Pipelining, Cache",
              "Software Engineering — SDLC, Testing",
              "Advanced DS — Segment Trees, Tries",
              "Graph Algorithms — Shortest Path, MST",
              "Concurrency & Synchronization (OS)",
            ],
          },
          {
            subject: "Problem-Solving Focus",
            items: [
              "Previous Year GATE papers (subject-wise)",
              "NAT-type numerical practice",
              "MSQ practice (multiple select)",
              "Aptitude shortcuts and tricks",
              "Cross-topic integration problems",
              "Standard algorithm analysis questions",
            ],
          },
        ],
        tips: [
          "Solve GATE PYQs (last 15 years) subject-wise",
          "Aim for 100% accuracy in General Aptitude",
          "Focus on subjects with high weightage",
        ],
      },
      {
        title: "Phase 3 — Mock Tests & Analysis",
        duration: "Month 9–11",
        icon: "🎯",
        description:
          "Full-length GATE mock tests. Simulate real exam conditions with 3-hour timed tests.",
        topics: [
          {
            subject: "Mock Test Strategy",
            items: [
              "Full-length GATE simulations (weekly)",
              "Virtual calculator practice",
              "Time management — 3 hours, 65 questions",
              "Attempt strategy — easy → medium → hard",
              "Error analysis and weak area identification",
              "Score tracking and improvement pattern",
            ],
          },
          {
            subject: "High-Weightage Topics",
            items: [
              "DSA (10–15 marks)",
              "DBMS + OS (10–12 marks combined)",
              "Engineering Mathematics (13 marks)",
              "Theory of Computation (6–8 marks)",
              "General Aptitude (15 marks — free marks!)",
              "Digital Logic + COA (8–10 marks)",
            ],
          },
        ],
        tips: [
          "Take at least 20 full-length mocks before exam",
          "Use virtual calculator — practice with it",
          "Time: ~2.5 min per question on average",
        ],
      },
      {
        title: "Phase 4 — Final Revision Sprint",
        duration: "Last 30 Days",
        icon: "🚀",
        description:
          "Consolidate everything. Revise, practice, and mentally prepare.",
        topics: [
          {
            subject: "Final Checklist",
            items: [
              "Revise all short notes and formula sheets",
              "Solve 1 full mock test every 2 days",
              "Focus on General Aptitude — guaranteed 15 marks",
              "Revise GATE PYQ solutions (last 5 years)",
              "Practice virtual calculator operations",
              "Take care of health and maintain routine",
            ],
          },
        ],
        tips: [
          "General Aptitude is the easiest 15 marks — never skip it",
          "Don't attempt uncertain questions (negative marking)",
          "Carry valid GATE admit card and ID on exam day",
        ],
      },
    ],
    resources: [
      { name: "GATE CS — Cormen (Algorithms)", type: "Book", icon: "📖" },
      { name: "Galvin — Operating Systems", type: "Book", icon: "📖" },
      { name: "Navathe — Database Systems", type: "Book", icon: "📖" },
      { name: "GATE Overflow (gatecse.in)", type: "Online", icon: "💻" },
      { name: "NPTEL Video Lectures", type: "Video", icon: "🎬" },
      { name: "Made Easy / ACE Test Series", type: "Online", icon: "💻" },
    ],
  },
};

const ExamPreparation = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [checkedTopics, setCheckedTopics] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleTopic = (phaseIdx, topicIdx, itemIdx) => {
    const key = `${selectedExam}-${phaseIdx}-${topicIdx}-${itemIdx}`;
    setCheckedTopics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getPhaseProgress = (phaseIdx) => {
    if (!selectedExam) return 0;
    const phase = examData[selectedExam]?.phases[phaseIdx];
    if (!phase) return 0;
    let total = 0;
    let checked = 0;
    phase.topics.forEach((topic, tIdx) => {
      topic.items.forEach((_, iIdx) => {
        total++;
        const key = `${selectedExam}-${phaseIdx}-${tIdx}-${iIdx}`;
        if (checkedTopics[key]) checked++;
      });
    });
    return total === 0 ? 0 : Math.round((checked / total) * 100);
  };

  const exams = [
    {
      id: "jee",
      title: "JEE",
      fullName: "Joint Entrance Examination",
      icon: "⚡",
      tagline: "Engineering entrance for IITs, NITs & top colleges",
      subjects: "Physics • Chemistry • Mathematics",
      stats: { candidates: "12L+", seats: "45K", difficulty: "Very High" },
    },
    {
      id: "neet",
      title: "NEET",
      fullName: "National Eligibility cum Entrance Test",
      icon: "🩺",
      tagline: "Medical entrance for MBBS, BDS & dental colleges",
      subjects: "Physics • Chemistry • Biology",
      stats: { candidates: "20L+", seats: "1L+", difficulty: "High" },
    },
    {
      id: "gate",
      title: "GATE",
      fullName: "Graduate Aptitude Test in Engineering",
      icon: "🎓",
      tagline: "MTech admissions in IITs/IISc & PSU recruitment",
      subjects: "Core Subjects • Mathematics • Aptitude",
      stats: { candidates: "8L+", seats: "30K", difficulty: "High" },
    },
  ];

  const currentExam = selectedExam ? examData[selectedExam] : null;

  return (
    <div style={{ background: "#ffffff", color: "#111111", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "48px", marginTop: "48px" }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: 800, color: "#111111", marginBottom: "8px", letterSpacing: "-1px" }}>
            📋 Exam <span style={{ color: "#d4a800" }}>Preparation</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#666666", maxWidth: "600px", margin: "0 auto" }}>
            Structured roadmaps for India's top competitive exams — JEE, NEET & GATE
          </p>
        </motion.div>

        {/* Exam Selector Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          {exams.map((exam, idx) => {
            const isSelected = selectedExam === exam.id;
            const isHovered = hoveredCard === exam.id;
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => { setSelectedExam(exam.id); setExpandedPhase(0); }}
                onMouseEnter={() => setHoveredCard(exam.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  padding: "28px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isSelected ? "translateY(-6px) scale(1.02)" : isHovered ? "translateY(-3px)" : "translateY(0)",
                  background: isSelected ? "linear-gradient(135deg, #f5c518, #d4a800)" : "#ffffff",
                  border: isSelected ? "2px solid #d4a800" : "1px solid #e5e5e5",
                  boxShadow: isSelected
                    ? "0 16px 40px rgba(245,197,24,0.35)"
                    : isHovered
                      ? "0 8px 25px rgba(0,0,0,0.08)"
                      : "0 2px 8px rgba(0,0,0,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative Corner */}
                {isSelected && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    width: "80px", height: "80px",
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "0 0 0 80px",
                  }} />
                )}

                <div style={{ fontSize: "3rem", marginBottom: "12px" }}>{exam.icon}</div>
                <h2 style={{
                  fontSize: "2rem", fontWeight: 800, marginBottom: "4px",
                  color: isSelected ? "#0a0a0a" : "#111111",
                }}>
                  {exam.title}
                </h2>
                <p style={{
                  fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px",
                  color: isSelected ? "rgba(0,0,0,0.5)" : "#999999",
                }}>
                  {exam.fullName}
                </p>
                <p style={{
                  fontSize: "0.9rem", marginBottom: "16px", lineHeight: 1.5,
                  color: isSelected ? "rgba(0,0,0,0.7)" : "#666666",
                }}>
                  {exam.tagline}
                </p>

                {/* Stats Row */}
                <div style={{
                  display: "flex", gap: "12px", marginBottom: "14px", flexWrap: "wrap",
                }}>
                  {Object.entries(exam.stats).map(([key, val]) => (
                    <div key={key} style={{
                      padding: "4px 10px", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 600,
                      background: isSelected ? "rgba(0,0,0,0.12)" : "#f5f5f5",
                      color: isSelected ? "#0a0a0a" : "#555555",
                      textTransform: "capitalize",
                    }}>
                      {key}: {val}
                    </div>
                  ))}
                </div>

                <div style={{
                  display: "inline-block", padding: "6px 14px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                  background: isSelected ? "rgba(0,0,0,0.15)" : "#fffbeb",
                  color: isSelected ? "#0a0a0a" : "#92400e",
                }}>
                  {exam.subjects}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        <AnimatePresence mode="wait">
          {!selectedExam && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                textAlign: "center", padding: "64px 24px",
                border: "2px dashed #e5e5e5", borderRadius: "24px",
                background: "#fafafa",
              }}
            >
              <div style={{ fontSize: "4.5rem", marginBottom: "16px" }}>🎯</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111111", marginBottom: "8px" }}>
                Select an Exam to View the Roadmap
              </h3>
              <p style={{ color: "#999999", fontSize: "0.95rem" }}>
                Click on JEE, NEET, or GATE above to see a detailed phase-by-phase preparation roadmap
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roadmap Content */}
        <AnimatePresence mode="wait">
          {currentExam && (
            <motion.div
              key={selectedExam}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Overview Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  background: "#fafafa", border: "1px solid #e5e5e5",
                  borderRadius: "20px", padding: "28px", marginBottom: "36px",
                }}
              >
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    background: "linear-gradient(135deg, #f5c518, #d4a800)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.8rem", flexShrink: 0,
                  }}>
                    {currentExam.icon}
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111111", marginBottom: "4px" }}>
                      {currentExam.title}
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "#d4a800", fontWeight: 600, marginBottom: "10px" }}>
                      {currentExam.subtitle}
                    </p>
                    <p style={{ color: "#555555", lineHeight: 1.7, fontSize: "0.95rem" }}>
                      {currentExam.overview}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Overall Progress */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                style={{
                  background: "#111111", borderRadius: "16px", padding: "20px 24px",
                  marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: "12px",
                }}
              >
                <div>
                  <h4 style={{ color: "#f5c518", fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>
                    Your Progress
                  </h4>
                  <p style={{ color: "#999", fontSize: "0.8rem" }}>
                    Check off topics as you complete them to track your preparation
                  </p>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  {currentExam.phases.map((_, i) => {
                    const prog = getPhaseProgress(i);
                    return (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{
                          width: "44px", height: "44px", borderRadius: "50%",
                          background: `conic-gradient(#f5c518 ${prog * 3.6}deg, #333 0deg)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <div style={{
                            width: "34px", height: "34px", borderRadius: "50%",
                            background: "#111", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.65rem", fontWeight: 700, color: "#fff",
                          }}>
                            {prog}%
                          </div>
                        </div>
                        <p style={{ color: "#888", fontSize: "0.6rem", marginTop: "4px" }}>P{i + 1}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Section Title */}
              <h3 style={{
                fontSize: "1.25rem", fontWeight: 700, color: "#111111",
                marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px",
              }}>
                <span style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #f5c518, #d4a800)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem",
                }}>
                  🗺️
                </span>
                Preparation Roadmap
              </h3>

              {/* Phase Timeline */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                {currentExam.phases.map((phase, index) => {
                  const isExpanded = expandedPhase === index;
                  const prog = getPhaseProgress(index);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      style={{
                        borderRadius: "20px", overflow: "hidden",
                        border: isExpanded ? "2px solid #f5c518" : "1px solid #e5e5e5",
                        boxShadow: isExpanded ? "0 6px 24px rgba(245,197,24,0.12)" : "0 1px 4px rgba(0,0,0,0.03)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {/* Phase Header */}
                      <div
                        onClick={() => setExpandedPhase(isExpanded ? -1 : index)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "20px 24px", cursor: "pointer",
                          background: isExpanded ? "linear-gradient(135deg, rgba(245,197,24,0.08), rgba(245,197,24,0.02))" : "#ffffff",
                          transition: "background 0.3s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                          <div style={{
                            width: "50px", height: "50px", borderRadius: "14px",
                            background: isExpanded ? "linear-gradient(135deg, #f5c518, #d4a800)" : "#f5f5f5",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.5rem", transition: "all 0.3s ease",
                          }}>
                            {phase.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111111", marginBottom: "2px" }}>
                              {phase.title}
                            </h4>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span style={{ fontSize: "0.8rem", color: "#d4a800", fontWeight: 600 }}>
                                {phase.duration}
                              </span>
                              {prog > 0 && (
                                <span style={{
                                  fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px",
                                  borderRadius: "8px",
                                  background: prog === 100 ? "#dcfce7" : "#fffbeb",
                                  color: prog === 100 ? "#16a34a" : "#d4a800",
                                }}>
                                  {prog}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress ring mini + chevron */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: `conic-gradient(#f5c518 ${prog * 3.6}deg, #eee 0deg)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <div style={{
                              width: "24px", height: "24px", borderRadius: "50%",
                              background: isExpanded ? "#fefce8" : "#fff",
                            }} />
                          </div>
                          <span style={{
                            fontSize: "1.2rem", color: "#999", transition: "transform 0.3s ease",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            display: "inline-block",
                          }}>
                            ▼
                          </span>
                        </div>
                      </div>

                      {/* Phase Content  */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{
                              padding: "4px 24px 24px",
                              background: "linear-gradient(180deg, rgba(245,197,24,0.04), transparent)",
                            }}>
                              <p style={{ color: "#666666", fontSize: "0.9rem", marginBottom: "20px", lineHeight: 1.6 }}>
                                {phase.description}
                              </p>

                              {/* Subject Topics */}
                              <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: "16px", marginBottom: "20px",
                              }}>
                                {phase.topics.map((topic, tIdx) => (
                                  <div key={tIdx} style={{
                                    background: "#ffffff", border: "1px solid #eee",
                                    borderRadius: "16px", padding: "18px",
                                  }}>
                                    <h5 style={{
                                      fontWeight: 700, color: "#111111", marginBottom: "12px",
                                      display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem",
                                    }}>
                                      <span style={{
                                        width: "8px", height: "8px", borderRadius: "50%",
                                        background: "#f5c518",
                                      }} />
                                      {topic.subject}
                                    </h5>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                                      {topic.items.map((item, iIdx) => {
                                        const checkKey = `${selectedExam}-${index}-${tIdx}-${iIdx}`;
                                        const isChecked = checkedTopics[checkKey];
                                        return (
                                          <li
                                            key={iIdx}
                                            onClick={() => toggleTopic(index, tIdx, iIdx)}
                                            style={{
                                              display: "flex", alignItems: "flex-start", gap: "10px",
                                              fontSize: "0.85rem",
                                              color: isChecked ? "#aaa" : "#555555",
                                              textDecoration: isChecked ? "line-through" : "none",
                                              cursor: "pointer", padding: "4px 0",
                                              transition: "all 0.2s ease",
                                            }}
                                          >
                                            <span style={{
                                              width: "18px", height: "18px", borderRadius: "5px",
                                              border: isChecked ? "2px solid #f5c518" : "2px solid #ddd",
                                              background: isChecked ? "#f5c518" : "transparent",
                                              display: "flex", alignItems: "center", justifyContent: "center",
                                              flexShrink: 0, marginTop: "1px", transition: "all 0.2s ease",
                                              fontSize: "0.7rem", color: "#fff", fontWeight: 700,
                                            }}>
                                              {isChecked ? "✓" : ""}
                                            </span>
                                            {item}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              {/* Tips */}
                              <div style={{
                                background: "#fffbeb", border: "1px solid #fef3c7",
                                borderRadius: "14px", padding: "16px 18px",
                              }}>
                                <h5 style={{
                                  fontWeight: 700, color: "#92400e", marginBottom: "8px",
                                  display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem",
                                }}>
                                  💡 Pro Tips
                                </h5>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                                  {phase.tips.map((tip, tipIdx) => (
                                    <li key={tipIdx} style={{
                                      fontSize: "0.83rem", color: "#78350f",
                                      display: "flex", alignItems: "center", gap: "8px",
                                    }}>
                                      <span style={{ color: "#d4a800", fontWeight: 700 }}>✓</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Resources */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 style={{
                  fontSize: "1.25rem", fontWeight: 700, color: "#111111",
                  marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <span style={{
                    width: "32px", height: "32px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #f5c518, #d4a800)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem",
                  }}>
                    📚
                  </span>
                  Recommended Resources
                </h3>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "12px", marginBottom: "40px",
                }}>
                  {currentExam.resources.map((resource, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      style={{
                        background: "#ffffff", border: "1px solid #e5e5e5",
                        borderRadius: "14px", padding: "14px 16px",
                        display: "flex", alignItems: "center", gap: "14px",
                        transition: "all 0.2s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                        e.currentTarget.style.borderColor = "#f5c518";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "#e5e5e5";
                      }}
                    >
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "12px",
                        background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.4rem", flexShrink: 0,
                      }}>
                        {resource.icon}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#111111" }}>
                          {resource.name}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "#d4a800", fontWeight: 600 }}>
                          {resource.type}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Back Button */}
              <div style={{ textAlign: "center", paddingTop: "16px", paddingBottom: "40px" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedExam(null)}
                  style={{
                    padding: "12px 36px", borderRadius: "14px", fontWeight: 700,
                    background: "linear-gradient(135deg, #f5c518, #d4a800)",
                    color: "#0a0a0a", border: "none", cursor: "pointer", fontSize: "0.95rem",
                    boxShadow: "0 4px 15px rgba(245,197,24,0.3)",
                  }}
                >
                  ← Back to All Exams
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExamPreparation;
