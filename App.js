import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const T = {
  bg: '#0d0d0d', card: '#1a1a2e', card2: '#16213e',
  accent: '#e94560', gold: '#ffd700', green: '#00d4aa',
  blue: '#4cc9f0', purple: '#7b2fff', text: '#ffffff',
  text2: '#a0aec0', border: '#2d2d44',
};

const QUESTIONS = [
  { id: 1, question: "A project manager notices the team is consistently missing deadlines. What should they do FIRST?", options: ["Escalate to the sponsor immediately", "Identify the root cause of the delays", "Add more resources to the project", "Update the project schedule"], correct: 1, explanation: "Always identify root cause first. Adding resources or escalating without understanding WHY delays happen will not fix the problem.", xp: 10 },
  { id: 2, question: "What does the Critical Path represent in project management?", options: ["The most expensive tasks in the project", "Tasks that require the most resources", "The longest sequence of dependent tasks that determines project duration", "Tasks assigned to senior team members"], correct: 2, explanation: "The Critical Path is the longest sequence of dependent tasks. Any delay on the critical path directly delays the entire project end date.", xp: 10 },
  { id: 3, question: "What is the PRIMARY purpose of a project charter?", options: ["To define detailed project tasks and timelines", "To formally authorize the project and the project manager", "To list all project risks and mitigation strategies", "To document the project budget breakdown"], correct: 1, explanation: "The project charter formally authorizes the project to exist and gives the PM authority to apply organizational resources. It is the project birth certificate.", xp: 10 },
  { id: 4, question: "Which document formally defines the project scope, deliverables, and boundaries?", options: ["Project charter", "Scope management plan", "Scope statement", "WBS dictionary"], correct: 2, explanation: "The scope statement formally defines what is and is not included in the project. It is the foundation for all scope decisions going forward.", xp: 10 },
  { id: 5, question: "A project sponsor asks you to start work before the project charter is signed. What do you do?", options: ["Start immediately to show responsiveness", "Refuse and explain the charter must be signed first", "Start planning but not executing", "Escalate to the PMO"], correct: 1, explanation: "Without a signed charter the project is not formally authorized. Starting work without authorization puts the project and PM at risk.", xp: 15 },
  { id: 6, question: "What does CPI of 0.85 mean for your project?", options: ["The project is ahead of schedule", "For every dollar spent you are getting 85 cents of value", "The project is 85 percent complete", "The project has 85 percent stakeholder satisfaction"], correct: 1, explanation: "CPI equals Earned Value divided by Actual Cost. A CPI of 0.85 means you are only getting 85 cents of work done for every dollar spent. Under 1.0 means over budget.", xp: 15 },
  { id: 7, question: "A stakeholder requests a major scope change mid-project. What is the CORRECT response?", options: ["Implement it immediately to keep the stakeholder happy", "Reject it - scope cannot change once the project starts", "Submit it through the Integrated Change Control process", "Add it to the backlog for the next project"], correct: 2, explanation: "All changes go through Integrated Change Control. This ensures impacts on scope, schedule, cost, and quality are analyzed before any change is approved.", xp: 15 },
  { id: 8, question: "Your SPI is 1.2. What does this tell you?", options: ["The project is over budget", "The project is ahead of schedule", "The project is behind schedule", "The project is under budget"], correct: 1, explanation: "SPI equals Earned Value divided by Planned Value. An SPI above 1.0 means you are completing more work than planned. The project is ahead of schedule.", xp: 15 },
  { id: 9, question: "What is the purpose of a Work Breakdown Structure?", options: ["To assign tasks to team members", "To decompose project scope into manageable work packages", "To create the project schedule", "To identify project risks"], correct: 1, explanation: "The WBS breaks down the total project scope into smaller, manageable work packages. It is the foundation for scheduling, costing, and resource planning.", xp: 10 },
  { id: 10, question: "Which scheduling technique uses optimistic, pessimistic, and most likely estimates?", options: ["Critical Path Method", "PERT", "Gantt Chart", "Kanban"], correct: 1, explanation: "PERT (Program Evaluation and Review Technique) uses three-point estimates to calculate expected duration and account for uncertainty in scheduling.", xp: 15 },
  { id: 11, question: "Which conflict resolution technique leads to the BEST long-term outcomes on project teams?", options: ["Smoothing - minimize the conflict to keep peace", "Forcing - use authority to make a decision", "Withdrawing - avoid the conflict entirely", "Collaborating - work together to find a solution"], correct: 3, explanation: "Collaborating is the best technique. Both parties work together to find a solution that satisfies everyone. It builds trust and long-term team health.", xp: 10 },
  { id: 12, question: "What is the difference between quality assurance and quality control?", options: ["QA checks the final product, QC prevents defects during the process", "QA is process-focused and preventive, QC is product-focused and detective", "QA is done by the team, QC is done by external auditors", "There is no difference"], correct: 1, explanation: "QA is process-oriented and prevents defects by auditing processes. QC is product-oriented and detects defects in deliverables. Prevention before inspection.", xp: 15 },
  { id: 13, question: "A team member says they disagree with a decision but will support it. This is an example of:", options: ["Smoothing", "Compromise", "Consent", "Consensus"], correct: 3, explanation: "Consensus means everyone can live with the decision and agrees to support it even if it was not their first choice. This is the gold standard for team decision making.", xp: 10 },
  { id: 14, question: "What is the RACI matrix used for?", options: ["Tracking project costs", "Defining roles and responsibilities", "Managing project risks", "Scheduling project tasks"], correct: 1, explanation: "RACI stands for Responsible, Accountable, Consulted, and Informed. It clarifies who does what on a project and prevents confusion about ownership.", xp: 10 },
  { id: 15, question: "A key team member resigns mid-project. What should the PM do FIRST?", options: ["Immediately hire a replacement", "Assess the impact on the project schedule and deliverables", "Escalate to the project sponsor", "Redistribute the work among remaining team members"], correct: 1, explanation: "Always assess impact first. Understanding how the departure affects scope, schedule, and quality allows the PM to make informed decisions about next steps.", xp: 15 },
];

const MODULES = [
  { id: 1, title: "Project Initiation", icon: "🏁", questions: [0, 1, 2, 3, 4], color: T.blue },
  { id: 2, title: "Planning and Scheduling", icon: "📅", questions: [5, 6, 7, 8, 9], color: T.purple },
  { id: 3, title: "Team and Stakeholders", icon: "👥", questions: [10, 11, 12, 13, 14], color: T.green },
];

function HomeScreen({ xp, streak, onStart, completedModules }) {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Welcome back</Text>
            <Text style={s.username}>Shinobi</Text>
          </View>
          <View style={s.streakBadge}>
            <Text style={s.streakFire}>🔥</Text>
            <Text style={s.streakNum}>{streak}</Text>
          </View>
        </View>

        <View style={s.xpCard}>
          <View style={s.xpRow}>
            <Text style={s.xpLabel}>Total XP</Text>
            <Text style={s.xpValue}>{xp} XP</Text>
          </View>
          <View style={s.xpBarBg}>
            <View style={[s.xpBarFill, { width: Math.min((xp / 200) * 100, 100) + '%' }]} />
          </View>
          <Text style={s.xpSub}>Level {Math.floor(xp / 100) + 1}</Text>
        </View>

        <Text style={s.trackTitle}>PMP Foundations</Text>
        <Text style={s.trackSub}>Project Management Professional</Text>

        {MODULES.map(function(mod, idx) {
          var isCompleted = completedModules.indexOf(mod.id) !== -1;
          var isLocked = idx > 0 && completedModules.indexOf(MODULES[idx - 1].id) === -1;
          return (
            <TouchableOpacity key={mod.id} style={[s.moduleCard, isCompleted && s.moduleCompleted, isLocked && s.moduleLocked]} onPress={function() { if (!isLocked) onStart(mod); }} disabled={isLocked}>
              <View style={[s.moduleIcon, { backgroundColor: isLocked ? T.border : mod.color + '22' }]}>
                <Text style={s.moduleIconText}>{isLocked ? '🔒' : mod.icon}</Text>
              </View>
              <View style={s.moduleInfo}>
                <Text style={[s.moduleName, isLocked && { color: T.text2 }]}>{mod.title}</Text>
                <Text style={s.moduleMeta}>{mod.questions.length} questions</Text>
              </View>
              {isCompleted && <Text style={s.moduleCheck}>✅</Text>}
              {!isCompleted && !isLocked && <Text style={s.moduleArrow}>▶</Text>}
            </TouchableOpacity>
          );
        })}

        <View style={s.comingSoon}>
          <Text style={s.comingSoonText}>More tracks coming soon</Text>
          <Text style={s.comingSoonSub}>AWS · Scrum · CISM · Security+</Text>
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
  var q = questions[current];
  var progress = (current / questions.length) * 100;

  function handleAnswer(idx) {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.correct) {
      setEarnedXP(function(prev) { return prev + q.xp; });
      setCorrect(function(prev) { return prev + 1; });
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      onComplete(earnedXP + (selected === q.correct ? 0 : 0), correct, questions.length);
    } else {
      setCurrent(function(prev) { return prev + 1; });
      setSelected(null);
      setShowResult(false);
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.lessonTop}>
        <TouchableOpacity onPress={onExit}>
          <Text style={s.exitText}>X</Text>
        </TouchableOpacity>
        <View style={s.progressBarBg}>
          <View style={[s.progressBarFill, { width: progress + '%', backgroundColor: module.color }]} />
        </View>
        <Text style={s.progressText}>{current + 1}/{questions.length}</Text>
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.questionCard}>
          <Text style={s.questionXP}>+{q.xp} XP</Text>
          <Text style={s.questionText}>{q.question}</Text>
        </View>
        {q.options.map(function(opt, idx) {
          var optStyle = s.optionBtn;
          var optTextColor = T.text;
          if (showResult) {
            if (idx === q.correct) { optStyle = [s.optionBtn, s.optionCorrect]; optTextColor = '#000'; }
            else if (idx === selected) { optStyle = [s.optionBtn, s.optionWrong]; }
          } else if (selected === idx) {
            optStyle = [s.optionBtn, s.optionSelected];
          }
          return (
            <TouchableOpacity key={idx} style={optStyle} onPress={function() { handleAnswer(idx); }}>
              <Text style={s.optionLetter}>{['A','B','C','D'][idx]}</Text>
              <Text style={[s.optionText, { color: optTextColor }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
        {showResult && (
          <View style={[s.explanationCard, { borderColor: selected === q.correct ? T.green : T.accent }]}>
            <Text style={s.explanationHeader}>{selected === q.correct ? 'Correct!' : 'Not quite'}</Text>
            <Text style={s.explanationText}>{q.explanation}</Text>
            <TouchableOpacity style={[s.nextBtn, { backgroundColor: module.color }]} onPress={handleNext}>
              <Text style={s.nextBtnText}>{current + 1 >= questions.length ? 'Finish Lesson' : 'Next Question'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultScreen({ correct, total, xpEarned, moduleName, onHome }) {
  var pct = Math.round((correct / total) * 100);
  var passed = pct >= 70;
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.resultContainer}>
        <Text style={s.resultEmoji}>{passed ? '🏆' : '💪'}</Text>
        <Text style={s.resultTitle}>{passed ? 'Lesson Complete!' : 'Keep Going!'}</Text>
        <Text style={s.resultSub}>{moduleName}</Text>
        <View style={s.resultStats}>
          <View style={s.resultStat}>
            <Text style={s.resultStatNum}>{correct}/{total}</Text>
            <Text style={s.resultStatLabel}>Correct</Text>
          </View>
          <View style={s.resultStat}>
            <Text style={[s.resultStatNum, { color: T.gold }]}>+{xpEarned}</Text>
            <Text style={s.resultStatLabel}>XP Earned</Text>
          </View>
          <View style={s.resultStat}>
            <Text style={[s.resultStatNum, { color: passed ? T.green : T.accent }]}>{pct}%</Text>
            <Text style={s.resultStatLabel}>Score</Text>
          </View>
        </View>
        <TouchableOpacity style={s.homeBtn} onPress={onHome}>
          <Text style={s.homeBtnText}>Back to Dojo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  var [screen, setScreen] = useState('splash');
  var [activeModule, setActiveModule] = useState(null);
  var [xp, setXP] = useState(0);
  var [streak] = useState(1);
  var [completedModules, setCompletedModules] = useState([]);
  var [lessonResult, setLessonResult] = useState(null);

  useEffect(function() {
    if (screen === 'splash') {
      setTimeout(function() { setScreen('home'); }, 2500);
    }
  }, [screen]);

  function startLesson(mod) { setActiveModule(mod); setScreen('lesson'); }

  function finishLesson(earned, correct, total) {
    setXP(function(prev) { return prev + earned; });
    setCompletedModules(function(prev) { return prev.indexOf(activeModule.id) === -1 ? prev.concat([activeModule.id]) : prev; });
    setLessonResult({ correct: correct, total: total, xpEarned: earned, moduleName: activeModule.title });
    setScreen('result');
  }

  function goHome() { setScreen('home'); setActiveModule(null); setLessonResult(null); }

  if (screen === 'splash') return (
    <SafeAreaView style={[s.safe, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>⚡</Text>
      <Text style={{ fontSize: 40, fontWeight: '800', color: T.text, marginBottom: 8 }}>AnbuPath</Text>
      <Text style={{ fontSize: 16, color: T.accent, fontWeight: '700', marginBottom: 4 }}>Train Hard. Cert Smart.</Text>
      <Text style={{ fontSize: 13, color: T.text2, marginTop: 8 }}>Level Up.</Text>
    </SafeAreaView>
  );
  if (screen === 'lesson') return <LessonScreen module={activeModule} onComplete={finishLesson} onExit={goHome} />;
  if (screen === 'result') return <ResultScreen correct={lessonResult.correct} total={lessonResult.total} xpEarned={lessonResult.xpEarned} moduleName={lessonResult.moduleName} onHome={goHome} />;
  return <HomeScreen xp={xp} streak={streak} onStart={startLesson} completedModules={completedModules} />;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, color: T.text2 },
  username: { fontSize: 28, fontWeight: '800', color: T.text },
  streakBadge: { backgroundColor: T.card, borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: T.accent },
  streakFire: { fontSize: 20 },
  streakNum: { fontSize: 16, fontWeight: '800', color: T.accent },
  xpCard: { backgroundColor: T.card, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: T.border },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  xpLabel: { color: T.text2, fontSize: 13 },
  xpValue: { color: T.gold, fontWeight: '700', fontSize: 13 },
  xpBarBg: { height: 8, backgroundColor: T.border, borderRadius: 4, marginBottom: 6 },
  xpBarFill: { height: 8, backgroundColor: T.gold, borderRadius: 4 },
  xpSub: { color: T.text2, fontSize: 11 },
  trackTitle: { fontSize: 20, fontWeight: '800', color: T.text, marginBottom: 4 },
  trackSub: { fontSize: 12, color: T.text2, marginBottom: 16 },
  moduleCard: { backgroundColor: T.card, borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: T.border },
  moduleCompleted: { borderColor: T.green },
  moduleLocked: { opacity: 0.5 },
  moduleIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  moduleIconText: { fontSize: 22 },
  moduleInfo: { flex: 1 },
  moduleName: { fontSize: 15, fontWeight: '700', color: T.text, marginBottom: 3 },
  moduleMeta: { fontSize: 11, color: T.text2 },
  moduleCheck: { fontSize: 20 },
  moduleArrow: { color: T.text2, fontSize: 16 },
  comingSoon: { marginTop: 24, alignItems: 'center', padding: 20, backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border },
  comingSoonText: { color: T.text2, fontSize: 14, fontWeight: '600' },
  comingSoonSub: { color: T.text2, fontSize: 12, marginTop: 4 },
  lessonTop: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, backgroundColor: T.bg },
  exitText: { color: T.text2, fontSize: 18, fontWeight: '700', paddingHorizontal: 8 },
  progressBarBg: { flex: 1, height: 8, backgroundColor: T.border, borderRadius: 4 },
  progressBarFill: { height: 8, borderRadius: 4 },
  progressText: { color: T.text2, fontSize: 12, fontWeight: '600' },
  questionCard: { backgroundColor: T.card, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: T.border },
  questionXP: { color: T.gold, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  questionText: { color: T.text, fontSize: 17, fontWeight: '600', lineHeight: 26 },
  optionBtn: { backgroundColor: T.card2, borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: T.border },
  optionSelected: { borderColor: T.blue, backgroundColor: T.card },
  optionCorrect: { backgroundColor: T.green, borderColor: T.green },
  optionWrong: { backgroundColor: T.accent, borderColor: T.accent },
  optionLetter: { color: T.text2, fontWeight: '700', marginRight: 12, fontSize: 13, minWidth: 20 },
  optionText: { fontSize: 14, flex: 1, lineHeight: 20 },
  explanationCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, marginTop: 8, borderWidth: 2 },
  explanationHeader: { fontSize: 16, fontWeight: '800', color: T.text, marginBottom: 8 },
  explanationText: { color: T.text2, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  nextBtn: { borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: T.bg },
  resultEmoji: { fontSize: 72, marginBottom: 16 },
  resultTitle: { fontSize: 32, fontWeight: '800', color: T.text, marginBottom: 4 },
  resultSub: { fontSize: 14, color: T.text2, marginBottom: 32 },
  resultStats: { flexDirection: 'row', gap: 24, marginBottom: 28 },
  resultStat: { alignItems: 'center' },
  resultStatNum: { fontSize: 28, fontWeight: '800', color: T.text },
  resultStatLabel: { fontSize: 12, color: T.text2, marginTop: 4 },
  homeBtn: { backgroundColor: T.accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40 },
  homeBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
