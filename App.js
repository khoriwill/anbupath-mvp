
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';

const T = {
  bg: '#0a0a0f', card: '#12121f', card2: '#1a1a2e',
  accent: '#ff4757', gold: '#ffd700', green: '#2ed573',
  blue: '#4cc9f0', purple: '#7b2fff', orange: '#ff6b35',
  text: '#ffffff', text2: '#8892a4', border: '#1e2035',
};

const QUESTIONS = [
  { id: 1, question: "A project manager notices the team is consistently missing deadlines. What should they do FIRST?", options: ["Escalate to the sponsor immediately", "Identify the root cause of the delays", "Add more resources to the project", "Update the project schedule"], correct: 1, explanation: "Always identify root cause first. Adding resources or escalating without understanding WHY delays happen will not fix the problem.", xp: 10 },
  { id: 2, question: "What does the Critical Path represent in project management?", options: ["The most expensive tasks in the project", "Tasks that require the most resources", "The longest sequence of dependent tasks that determines project duration", "Tasks assigned to senior team members"], correct: 2, explanation: "The Critical Path is the longest sequence of dependent tasks. Any delay on the critical path directly delays the entire project end date.", xp: 10 },
  { id: 3, question: "What is the PRIMARY purpose of a project charter?", options: ["To define detailed project tasks and timelines", "To formally authorize the project and the project manager", "To list all project risks and mitigation strategies", "To document the project budget breakdown"], correct: 1, explanation: "The project charter formally authorizes the project to exist and gives the PM authority to apply organizational resources. It is the project birth certificate.", xp: 10 },
  { id: 4, question: "Which document formally defines the project scope, deliverables, and boundaries?", options: ["Project charter", "Scope management plan", "Scope statement", "WBS dictionary"], correct: 2, explanation: "The scope statement formally defines what is and is not included in the project. It is the foundation for all scope decisions going forward.", xp: 10 },
  { id: 5, question: "A project sponsor asks you to start work before the project charter is signed. What do you do?", options: ["Start immediately to show responsiveness", "Refuse and explain the charter must be signed first", "Start planning but not executing", "Escalate to the PMO"], correct: 1, explanation: "Without a signed charter the project is not formally authorized. Starting work without authorization puts the project and PM at risk.", xp: 15 },
  { id: 6, question: "What does a CPI of 0.85 mean for your project?", options: ["The project is ahead of schedule", "For every dollar spent you are getting 85 cents of value", "The project is 85 percent complete", "The project has 85 percent stakeholder satisfaction"], correct: 1, explanation: "CPI equals Earned Value divided by Actual Cost. A CPI of 0.85 means you are only getting 85 cents of work done for every dollar spent. Under 1.0 means over budget.", xp: 15 },
  { id: 7, question: "A stakeholder requests a major scope change mid-project. What is the CORRECT response?", options: ["Implement it immediately to keep the stakeholder happy", "Reject it - scope cannot change once the project starts", "Submit it through the Integrated Change Control process", "Add it to the backlog for the next project"], correct: 2, explanation: "All changes go through Integrated Change Control. This ensures impacts on scope, schedule, cost, and quality are analyzed before any change is approved.", xp: 15 },
  { id: 8, question: "Your SPI is 1.2. What does this tell you?", options: ["The project is over budget", "The project is ahead of schedule", "The project is behind schedule", "The project is under budget"], correct: 1, explanation: "SPI equals Earned Value divided by Planned Value. An SPI above 1.0 means you are completing more work than planned. The project is ahead of schedule.", xp: 15 },
  { id: 9, question: "What is the purpose of a Work Breakdown Structure?", options: ["To assign tasks to team members", "To decompose project scope into manageable work packages", "To create the project schedule", "To identify project risks"], correct: 1, explanation: "The WBS breaks down the total project scope into smaller, manageable work packages. It is the foundation for scheduling, costing, and resource planning.", xp: 10 },
  { id: 10, question: "Which scheduling technique uses optimistic, pessimistic, and most likely estimates?", options: ["Critical Path Method", "PERT", "Gantt Chart", "Kanban"], correct: 1, explanation: "PERT uses three-point estimates to calculate expected duration and account for uncertainty in scheduling.", xp: 15 },
  { id: 11, question: "Which conflict resolution technique leads to the BEST long-term outcomes on project teams?", options: ["Smoothing - minimize the conflict to keep peace", "Forcing - use authority to make a decision", "Withdrawing - avoid the conflict entirely", "Collaborating - work together to find a solution"], correct: 3, explanation: "Collaborating is the best technique. Both parties work together to find a solution that satisfies everyone. It builds trust and long-term team health.", xp: 10 },
  { id: 12, question: "What is the difference between quality assurance and quality control?", options: ["QA checks the final product, QC prevents defects during the process", "QA is process-focused and preventive, QC is product-focused and detective", "QA is done by the team, QC is done by external auditors", "There is no difference"], correct: 1, explanation: "QA is process-oriented and prevents defects by auditing processes. QC is product-oriented and detects defects in deliverables. Prevention before inspection.", xp: 15 },
  { id: 13, question: "A team member says they disagree with a decision but will support it. This is an example of:", options: ["Smoothing", "Compromise", "Consent", "Consensus"], correct: 3, explanation: "Consensus means everyone can live with the decision and agrees to support it even if it was not their first choice. This is the gold standard for team decision making.", xp: 10 },
  { id: 14, question: "What is the RACI matrix used for?", options: ["Tracking project costs", "Defining roles and responsibilities", "Managing project risks", "Scheduling project tasks"], correct: 1, explanation: "RACI stands for Responsible, Accountable, Consulted, and Informed. It clarifies who does what on a project and prevents confusion about ownership.", xp: 10 },
  { id: 15, question: "A key team member resigns mid-project. What should the PM do FIRST?", options: ["Immediately hire a replacement", "Assess the impact on the project schedule and deliverables", "Escalate to the project sponsor", "Redistribute the work among remaining team members"], correct: 1, explanation: "Always assess impact first. Understanding how the departure affects scope, schedule, and quality allows the PM to make informed decisions about next steps.", xp: 15 },
];

const MODULES = [
  { id: 1, title: "Project Initiation", icon: "🏁", questions: [0, 1, 2, 3, 4], color: T.blue, desc: "Charters, scope, and kickoff" },
  { id: 2, title: "Planning and Scheduling", icon: "📅", questions: [5, 6, 7, 8, 9], color: T.purple, desc: "EVM, WBS, and scheduling" },
  { id: 3, title: "Team and Stakeholders", icon: "👥", questions: [10, 11, 12, 13, 14], color: T.green, desc: "Leadership, quality, and conflict" },
];

function getRank(xp) {
  if (xp >= 200) return { title: "Master", color: T.gold };
  if (xp >= 100) return { title: "Journeyman", color: T.purple };
  return { title: "Apprentice", color: T.blue };
}

function SplashScreen() {
  var fadeAnim = useRef(new Animated.Value(0)).current;
  var slideAnim = useRef(new Animated.Value(30)).current;
  useEffect(function() {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <SafeAreaView style={[s.safe, s.center]}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: "center" }}>
        <Text style={s.splashIcon}>⚒️</Text>
        <Text style={s.splashName}>CertForge</Text>
        <Text style={s.splashTag}>Forge Your Certification.</Text>
        <View style={s.splashDivider} />
        <Text style={s.splashSub}>PMP · AWS · CISM · Security+</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

function HomeScreen({ xp, streak, onStart, completedModules }) {
  var rank = getRank(xp);
  var nextXP = xp >= 200 ? 200 : xp >= 100 ? 200 : 100;
  var pct = Math.min((xp / nextXP) * 100, 100);
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <View style={s.homeHeader}>
          <View>
            <Text style={s.greeting}>Welcome back,</Text>
            <Text style={s.username}>Forger</Text>
          </View>
          <View style={s.streakBadge}>
            <Text style={s.streakFire}>🔥</Text>
            <Text style={s.streakNum}>{streak}</Text>
          </View>
        </View>

        <View style={s.rankCard}>
          <View style={s.rankRow}>
            <View>
              <Text style={s.rankLabel}>Current Rank</Text>
              <Text style={[s.rankTitle, { color: rank.color }]}>{rank.title}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={s.xpLabel}>Total XP</Text>
              <Text style={[s.xpValue, { color: T.gold }]}>{xp} XP</Text>
            </View>
          </View>
          <View style={s.xpBarBg}>
            <Animated.View style={[s.xpBarFill, { width: pct + "%", backgroundColor: rank.color }]} />
          </View>
          <View style={s.rankFooter}>
            <Text style={s.rankSub}>Apprentice</Text>
            <Text style={s.rankSub}>Journeyman</Text>
            <Text style={s.rankSub}>Master</Text>
          </View>
        </View>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>⚒️ PMP Foundations</Text>
          <Text style={s.sectionSub}>Project Management Professional</Text>
        </View>

        {MODULES.map(function(mod, idx) {
          var isCompleted = completedModules.indexOf(mod.id) !== -1;
          var isLocked = idx > 0 && completedModules.indexOf(MODULES[idx - 1].id) === -1;
          return (
            <TouchableOpacity key={mod.id} style={[s.moduleCard, isCompleted && { borderColor: mod.color + "66" }, isLocked && s.moduleLocked]} onPress={function() { if (!isLocked) onStart(mod); }} disabled={isLocked} activeOpacity={0.8}>
              <View style={[s.moduleIconWrap, { backgroundColor: isLocked ? T.border : mod.color + "22" }]}>
                <Text style={s.moduleIconText}>{isLocked ? "🔒" : mod.icon}</Text>
              </View>
              <View style={s.moduleInfo}>
                <Text style={[s.moduleName, isLocked && { color: T.text2 }]}>{mod.title}</Text>
                <Text style={s.moduleDesc}>{isLocked ? "Complete previous module first" : mod.desc}</Text>
                <Text style={s.moduleMeta}>{mod.questions.length} questions · {mod.questions.reduce(function(a, i) { return a + QUESTIONS[i].xp; }, 0)} XP</Text>
              </View>
              <View style={s.moduleRight}>
                {isCompleted && <Text style={{ fontSize: 22 }}>✅</Text>}
                {!isCompleted && !isLocked && <View style={[s.startBtn, { backgroundColor: mod.color }]}><Text style={s.startBtnText}>Start</Text></View>}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={s.comingSoonCard}>
          <Text style={s.comingSoonTitle}>🔜 More tracks forging...</Text>
          <View style={s.comingSoonTags}>
            {["AWS CCP", "Scrum PSM", "CISM", "Security+"].map(function(t) {
              return <View key={t} style={s.comingSoonTag}><Text style={s.comingSoonTagText}>{t}</Text></View>;
            })}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function LessonScreen({ module, onComplete, onExit }) {
  var questions = module.questions.map(function(i) { return QUESTIONS[i]; });
  var [current, setCurrent] = useState(0);
  var [selected, setSelected] = useState(null);
  var [showResult, setShowResult] = useState(false);
  var [earnedXP, setEarnedXP] = useState(0);
  var [correct, setCorrect] = useState(0);
  var shakeAnim = useRef(new Animated.Value(0)).current;
  var pulseAnim = useRef(new Animated.Value(1)).current;
  var fadeAnim = useRef(new Animated.Value(1)).current;
  var q = questions[current];
  var progress = ((current + 1) / questions.length) * 100;

  function animateCorrect() {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.03, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1.03, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }

  function animateWrong() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }

  function handleAnswer(idx) {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.correct) {
      setEarnedXP(function(prev) { return prev + q.xp; });
      setCorrect(function(prev) { return prev + 1; });
      animateCorrect();
    } else {
      animateWrong();
    }
  }

  function handleNext() {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(function() {
      if (current + 1 >= questions.length) {
        onComplete(earnedXP, correct, questions.length);
      } else {
        setCurrent(function(prev) { return prev + 1; });
        setSelected(null);
        setShowResult(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      }
    });
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.lessonTop}>
        <TouchableOpacity onPress={onExit} style={s.exitBtn}>
          <Text style={s.exitText}>✕</Text>
        </TouchableOpacity>
        <View style={s.progressBarBg}>
          <View style={[s.progressBarFill, { width: progress + "%", backgroundColor: module.color }]} />
        </View>
        <View style={[s.xpPill, { backgroundColor: module.color + "22" }]}>
          <Text style={[s.xpPillText, { color: module.color }]}>+{q.xp} XP</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>

          <Text style={s.questionNum}>Question {current + 1} of {questions.length}</Text>
          <View style={s.questionCard}>
            <Text style={s.questionText}>{q.question}</Text>
          </View>

          <Animated.View style={{ transform: [{ translateX: shakeAnim }, { scale: pulseAnim }] }}>
            {q.options.map(function(opt, idx) {
              var bgColor = T.card2;
              var borderColor = T.border;
              var textColor = T.text;
              var letterColor = T.text2;
              if (showResult) {
                if (idx === q.correct) { bgColor = T.green + "22"; borderColor = T.green; textColor = T.green; letterColor = T.green; }
                else if (idx === selected) { bgColor = T.accent + "22"; borderColor = T.accent; textColor = T.accent; letterColor = T.accent; }
              } else if (selected === idx) {
                bgColor = module.color + "22"; borderColor = module.color;
              }
              return (
                <TouchableOpacity key={idx} style={[s.optionBtn, { backgroundColor: bgColor, borderColor: borderColor }]} onPress={function() { handleAnswer(idx); }} activeOpacity={0.8} disabled={showResult}>
                  <View style={[s.optionLetterWrap, { borderColor: letterColor }]}>
                    <Text style={[s.optionLetter, { color: letterColor }]}>{["A","B","C","D"][idx]}</Text>
                  </View>
                  <Text style={[s.optionText, { color: textColor }]}>{opt}</Text>
                  {showResult && idx === q.correct && <Text style={{ fontSize: 16 }}>✅</Text>}
                  {showResult && idx === selected && idx !== q.correct && <Text style={{ fontSize: 16 }}>❌</Text>}
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {showResult && (
            <Animated.View style={[s.explanationCard, { borderColor: selected === q.correct ? T.green : T.accent, opacity: fadeAnim }]}>
              <Text style={[s.explanationHeader, { color: selected === q.correct ? T.green : T.accent }]}>
                {selected === q.correct ? "✅ Correct! +" + q.xp + " XP" : "❌ Not quite — learn from this"}
              </Text>
              <Text style={s.explanationText}>{q.explanation}</Text>
              <TouchableOpacity style={[s.nextBtn, { backgroundColor: module.color }]} onPress={handleNext} activeOpacity={0.85}>
                <Text style={s.nextBtnText}>{current + 1 >= questions.length ? "Finish Lesson 🎉" : "Next Question →"}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultScreen({ correct, total, xpEarned, moduleName, onHome }) {
  var pct = Math.round((correct / total) * 100);
  var passed = pct >= 70;
  var scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(function() {
    Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }).start();
  }, []);
  return (
    <SafeAreaView style={[s.safe, s.center]}>
      <Animated.View style={[s.resultContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={s.resultEmoji}>{pct === 100 ? "🏆" : passed ? "⚒️" : "💪"}</Text>
        <Text style={s.resultTitle}>{pct === 100 ? "Forged to Perfection!" : passed ? "Module Forged!" : "Keep Forging!"}</Text>
        <Text style={s.resultSub}>{moduleName}</Text>
        <View style={s.resultStatsRow}>
          <View style={s.resultStat}>
            <Text style={s.resultStatNum}>{correct}/{total}</Text>
            <Text style={s.resultStatLabel}>Correct</Text>
          </View>
          <View style={[s.resultStatDivider]} />
          <View style={s.resultStat}>
            <Text style={[s.resultStatNum, { color: T.gold }]}>+{xpEarned}</Text>
            <Text style={s.resultStatLabel}>XP Earned</Text>
          </View>
          <View style={s.resultStatDivider} />
          <View style={s.resultStat}>
            <Text style={[s.resultStatNum, { color: passed ? T.green : T.accent }]}>{pct}%</Text>
            <Text style={s.resultStatLabel}>Score</Text>
          </View>
        </View>
        <Text style={s.resultMessage}>
          {pct === 100 ? "Perfect score. You are a true Forger." : passed ? "Solid work. Keep the streak alive!" : "Review the explanations and forge again."}
        </Text>
        <TouchableOpacity style={s.homeBtn} onPress={onHome} activeOpacity={0.85}>
          <Text style={s.homeBtnText}>Back to Forge ⚒️</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

export default function App() {
  var [screen, setScreen] = useState("splash");
  var [activeModule, setActiveModule] = useState(null);
  var [xp, setXP] = useState(0);
  var [streak] = useState(1);
  var [completedModules, setCompletedModules] = useState([]);
  var [lessonResult, setLessonResult] = useState(null);

  useEffect(function() {
    if (screen === "splash") {
      var t = setTimeout(function() { setScreen("home"); }, 2800);
      return function() { clearTimeout(t); };
    }
  }, [screen]);

  function startLesson(mod) { setActiveModule(mod); setScreen("lesson"); }

  function finishLesson(earned, correct, total) {
    setXP(function(prev) { return prev + earned; });
    setCompletedModules(function(prev) { return prev.indexOf(activeModule.id) === -1 ? prev.concat([activeModule.id]) : prev; });
    setLessonResult({ correct: correct, total: total, xpEarned: earned, moduleName: activeModule.title });
    setScreen("result");
  }

  function goHome() { setScreen("home"); setActiveModule(null); setLessonResult(null); }

  if (screen === "splash") return <SplashScreen />;
  if (screen === "lesson") return <LessonScreen module={activeModule} onComplete={finishLesson} onExit={goHome} />;
  if (screen === "result") return <ResultScreen correct={lessonResult.correct} total={lessonResult.total} xpEarned={lessonResult.xpEarned} moduleName={lessonResult.moduleName} onHome={goHome} />;
  return <HomeScreen xp={xp} streak={streak} onStart={startLesson} completedModules={completedModules} />;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  center: { alignItems: "center", justifyContent: "center" },
  scroll: { padding: 20, paddingBottom: 48 },

  splashIcon: { fontSize: 72, marginBottom: 16 },
  splashName: { fontSize: 42, fontWeight: "800", color: T.text, letterSpacing: -1, marginBottom: 8 },
  splashTag: { fontSize: 16, color: T.accent, fontWeight: "700", marginBottom: 24 },
  splashDivider: { width: 40, height: 2, backgroundColor: T.border, marginBottom: 16 },
  splashSub: { fontSize: 13, color: T.text2, letterSpacing: 1 },

  homeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 13, color: T.text2, marginBottom: 2 },
  username: { fontSize: 30, fontWeight: "800", color: T.text, letterSpacing: -0.5 },
  streakBadge: { backgroundColor: T.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: T.accent + "44" },
  streakFire: { fontSize: 22 },
  streakNum: { fontSize: 15, fontWeight: "800", color: T.accent, marginTop: 2 },

  rankCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: T.border },
  rankRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  rankLabel: { fontSize: 11, color: T.text2, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  rankTitle: { fontSize: 22, fontWeight: "800" },
  xpLabel: { fontSize: 11, color: T.text2, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  xpValue: { fontSize: 20, fontWeight: "800" },
  xpBarBg: { height: 6, backgroundColor: T.border, borderRadius: 3, marginBottom: 8 },
  xpBarFill: { height: 6, borderRadius: 3 },
  rankFooter: { flexDirection: "row", justifyContent: "space-between" },
  rankSub: { fontSize: 10, color: T.text2 },

  sectionHeader: { marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: T.text, marginBottom: 3 },
  sectionSub: { fontSize: 12, color: T.text2 },

  moduleCard: { backgroundColor: T.card, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: T.border },
  moduleLocked: { opacity: 0.45 },
  moduleIconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 14 },
  moduleIconText: { fontSize: 24 },
  moduleInfo: { flex: 1 },
  moduleName: { fontSize: 15, fontWeight: "700", color: T.text, marginBottom: 3 },
  moduleDesc: { fontSize: 11, color: T.text2, marginBottom: 4 },
  moduleMeta: { fontSize: 11, color: T.text2 },
  moduleRight: { marginLeft: 10, alignItems: "center" },
  startBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  comingSoonCard: { marginTop: 8, backgroundColor: T.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, borderStyle: "dashed", alignItems: "center" },
  comingSoonTitle: { fontSize: 14, color: T.text2, fontWeight: "600", marginBottom: 12 },
  comingSoonTags: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  comingSoonTag: { backgroundColor: T.card2, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: T.border },
  comingSoonTagText: { fontSize: 11, color: T.text2, fontWeight: "600" },

  lessonTop: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12, backgroundColor: T.bg },
  exitBtn: { width: 34, height: 34, alignItems: "center", justifyContent: "center", backgroundColor: T.card, borderRadius: 10 },
  exitText: { color: T.text2, fontSize: 14, fontWeight: "700" },
  progressBarBg: { flex: 1, height: 8, backgroundColor: T.border, borderRadius: 4 },
  progressBarFill: { height: 8, borderRadius: 4 },
  xpPill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  xpPillText: { fontSize: 12, fontWeight: "700" },

  questionNum: { fontSize: 12, color: T.text2, marginBottom: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  questionCard: { backgroundColor: T.card, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: T.border },
  questionText: { color: T.text, fontSize: 17, fontWeight: "600", lineHeight: 27 },

  optionBtn: { borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1.5, gap: 12 },
  optionLetterWrap: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  optionLetter: { fontWeight: "700", fontSize: 13 },
  optionText: { fontSize: 14, flex: 1, lineHeight: 20, fontWeight: "500" },

  explanationCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, marginTop: 4, borderWidth: 2 },
  explanationHeader: { fontSize: 15, fontWeight: "800", marginBottom: 10 },
  explanationText: { color: T.text2, fontSize: 14, lineHeight: 22, marginBottom: 18 },
  nextBtn: { borderRadius: 12, padding: 15, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },

  resultContainer: { alignItems: "center", padding: 28 },
  resultEmoji: { fontSize: 80, marginBottom: 16 },
  resultTitle: { fontSize: 28, fontWeight: "800", color: T.text, marginBottom: 6, textAlign: "center" },
  resultSub: { fontSize: 14, color: T.text2, marginBottom: 28 },
  resultStatsRow: { flexDirection: "row", alignItems: "center", marginBottom: 24, backgroundColor: T.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border },
  resultStat: { flex: 1, alignItems: "center" },
  resultStatDivider: { width: 1, height: 40, backgroundColor: T.border },
  resultStatNum: { fontSize: 26, fontWeight: "800", color: T.text, marginBottom: 4 },
  resultStatLabel: { fontSize: 11, color: T.text2, textTransform: "uppercase", letterSpacing: 0.5 },
  resultMessage: { color: T.text2, fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 28, paddingHorizontal: 10 },
  homeBtn: { backgroundColor: T.accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 44 },
  homeBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
