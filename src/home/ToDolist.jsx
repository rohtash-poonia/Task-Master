"use client";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit3,
  Plus,
  Check,
  X,
  Moon,
  Sun,
  Clock,
  Flag,
  Search,
  Sparkles,
  ListTodo,
  Target,
} from "lucide-react";

// ─── Config ────────────────────────────────────────────────────────────────

const CATEGORIES = {
  Personal: {
    color: "violet",
    dot: "bg-violet-500",
    pill: "bg-violet-100/70! text-violet-900! dark:bg-violet-400/70! dark:text-violet-200",
    border: "border-l-violet-500",
  },
  Work: {
    color: "blue",
    dot: "bg-blue-500",
    pill: "bg-blue-100/70! text-blue-700 dark:bg-blue-900/70! dark:text-blue-200",
    border: "border-l-blue-500",
  },
  Shopping: {
    color: "pink",
    dot: "bg-pink-500",
    pill: "bg-pink-100/70! text-pink-700! dark:bg-pink-400/70! dark:text-pink-200",
    border: "border-l-pink-500",
  },
  Health: {
    color: "emerald",
    dot: "bg-emerald-500",
    pill: "bg-emerald-100/70! text-emerald-200! dark:bg-emerald-600/70! dark:text-emerald-200",
    border: "border-l-emerald-500",
  },
};

const PRIORITIES = {
  High: {
    pill:
      "bg-red-200/80! text-red-600! border border-red-200 " +
      "dark:bg-red-900/40 dark:text-red-300 dark:border-red-700",
  },

  Medium: {
    pill:
      "bg-amber-200/80! text-amber-600! border border-amber-200 " +
      "dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
  },

  Low: {
    pill:
      "bg-emerald-200/80! text-emerald-600! border border-emerald-200 " +
      "dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
  },
};

const EMOJI = { Personal: "👤", Work: "💼", Shopping: "🛍️", Health: "💚" };
const PRIORITY_DOT = { High: "🔴", Medium: "🟡", Low: "🟢" };

const DEFAULT_TODO = {
  name: "",
  dueDate: "",
  priority: "Medium",
  category: "Personal",
};

// ─── Main Component ─────────────────────────────────────────────────────────

export default function TodoList() {
  const [todo, setTodo] = useState(DEFAULT_TODO);
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  // Persist
  useEffect(() => {
    try {
      const t = localStorage.getItem("tm_tasks");
      const d = localStorage.getItem("tm_dark");
      if (t) setTasks(JSON.parse(t));
      if (d) setDark(JSON.parse(d));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tm_tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);
  useEffect(() => {
    try {
      localStorage.setItem("tm_dark", JSON.stringify(dark));
    } catch {}
  }, [dark]);

  // Toggle dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // ── Handlers ──
  const handleSubmit = () => {
    if (!todo.name.trim()) return;
    if (editIndex !== null) {
      setTasks((prev) =>
        prev.map((t, i) =>
          i === editIndex
            ? { ...todo, completed: t.completed, createdAt: t.createdAt }
            : t,
        ),
      );
      setEditIndex(null);
    } else {
      setTasks((prev) => [
        { ...todo, completed: false, createdAt: new Date().toISOString() },
        ...prev,
      ]);
    }
    setTodo(DEFAULT_TODO);
  };

  const startEdit = (task, origIdx) => {
    setTodo(task);
    setEditIndex(origIdx);
  };

  const deleteTask = (origIdx) =>
    setTasks((prev) => prev.filter((_, i) => i !== origIdx));
  const toggleTask = (origIdx) =>
    setTasks((prev) =>
      prev.map((t, i) =>
        i === origIdx ? { ...t, completed: !t.completed } : t,
      ),
    );
  const cancelEdit = () => {
    setEditIndex(null);
    setTodo(DEFAULT_TODO);
  };

  // ── Derived ──
  const filtered = tasks
    .map((t, i) => ({ ...t, _origIdx: i }))
    .filter((t) =>
      filter === "active"
        ? !t.completed
        : filter === "completed"
          ? t.completed
          : true,
    )
    .filter((t) => catFilter === "all" || t.category === catFilter)
    .filter(
      (t) => !search || t.name.toLowerCase().includes(search.toLowerCase()),
    );

  const total = tasks.length;
  const active = tasks.filter((t) => !t.completed).length;
  const done = tasks.filter((t) => t.completed).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? "bg-slate-950" : "bg-slate-50"}`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-linear-to-r from-violet-600 via-pink-500 to-blue-500 bg-clip-text text-transparent leading-none">
              Task Master
            </h1>
            <p
              className={`mt-1.5 text-sm font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}
            >
              Stay organized · Stay productive
            </p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className={`shrink-0 p-2.5 rounded-xl border cursor-pointer transition-all duration-200 ${
              dark
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                : "bg-white border-slate-200 hover:bg-slate-50 shadow-sm"
            }`}
          >
            {dark ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-violet-600" />
            )}
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
          {[
            {
              label: "Total Tasks",
              val: total,
              color: "text-violet-600 dark:text-violet-400",
              border: "border-l-4 border-l-violet-500",
              icon: <ListTodo size={15} />,
            },
            {
              label: "Active",
              val: active,
              color: "text-blue-600 dark:text-blue-400",
              border: "border-l-4 border-l-blue-500",
              icon: <Target size={15} />,
            },
            {
              label: "Completed",
              val: done,
              color: "text-emerald-600 dark:text-emerald-400",
              border: "border-l-4 border-l-emerald-500",
              icon: <Check size={15} />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl p-4 ${s.border} ${
                dark
                  ? "bg-slate-900 border border-slate-800"
                  : "bg-white border border-slate-100 shadow-sm"
              }`}
            >
              <div className={`flex items-center gap-1.5 mb-2 ${s.color}`}>
                {s.icon}
                <span
                  className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {s.label}
                </span>
              </div>
              <div
                className={`text-3xl sm:text-4xl font-black leading-none ${s.color}`}
              >
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress ── */}
        {total > 0 && (
          <div
            className={`rounded-2xl px-5 py-4 mb-6 flex items-center gap-4 ${
              dark
                ? "bg-slate-900 border border-slate-800"
                : "bg-white border border-slate-100 shadow-sm"
            }`}
          >
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span
                  className={`text-xs font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Progress
                </span>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                  {progress}%
                </span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}
              >
                <div
                  className="h-full bg-linear-to-r from-violet-600 to-pink-500 rounded-full transition-all duration-700 ease-in-out"
                  style={{
                    width: `${progress}%`,
                    minWidth: progress > 0 ? "8px" : "0",
                  }}
                />
              </div>
            </div>
            <Sparkles size={16} className="text-pink-500 shrink-0" />
          </div>
        )}

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 items-start">
          {/* ─ Form Panel ─ */}
          <div
            className={`rounded-2xl p-6 lg:sticky lg:top-6 ${
              dark
                ? "bg-slate-900 border border-slate-800"
                : "bg-white border border-slate-100 shadow-sm"
            }`}
          >
            <h2
              className={`text-sm font-bold mb-5 flex items-center gap-2 ${dark ? "text-slate-100" : "text-slate-800"}`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  editIndex !== null
                    ? "bg-blue-100 dark:bg-blue-900/40"
                    : "bg-violet-100 dark:bg-violet-900/40"
                }`}
              >
                {editIndex !== null ? (
                  <Edit3
                    size={13}
                    className="text-blue-600 dark:text-blue-400"
                  />
                ) : (
                  <Plus
                    size={13}
                
                    className="text-blue-500! dark:text-violet-r00 "
                  />
                )}
              </span>
              {editIndex !== null ? "Edit Task" : "New Task"}
            </h2>

            <div className="flex flex-col gap-4">
              {/* Task Name */}
              <div>
                <label
                id="task"
                  className={`block text-[11px] font-semibold uppercase tracking-widest mb-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Task Name
                </label>
                <input
                id="task"
                  value={todo.name}
                  onChange={(e) => setTodo({ ...todo, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="What needs to be done?"
                  className={`w-full cursor-pointer px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all duration-200
                    focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                    placeholder:text-slate-300 dark:placeholder:text-slate-600
                    ${
                      dark
                        ? "bg-slate-950 border-slate-700 text-slate-100"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                />
              </div>

              {/* Due Date */}
              <div>
                <label
                  className={`block text-[11px] font-semibold uppercase tracking-widest mb-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={todo.dueDate}
                  onChange={(e) =>
                    setTodo({ ...todo, dueDate: e.target.value })
                  }
                  className={`w-full px-3.5 cursor-pointer py-2.5 rounded-xl text-sm border outline-none transition-all duration-200
                    focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                    ${
                      dark
                        ? "bg-slate-950 border-slate-700 text-slate-100 scheme-dark"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                />
              </div>

              {/* Priority */}
              <div>
                <label
                  className={`block text-[11px] font-semibold uppercase tracking-widest mb-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["High", "Medium", "Low"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setTodo({ ...todo, priority: p })}
                      className={`py-2 cursor-pointer rounded-xl text-xs font-semibold border transition-all duration-150
                        ${
                          todo.priority === p
                            ? PRIORITIES[p].pill
                            : dark
                              ? "border-slate-700 text-slate-400 hover:border-slate-600"
                              : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                    >
                      {PRIORITY_DOT[p]} {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  className={`block text-[11px] font-semibold uppercase tracking-widest mb-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(CATEGORIES).map((cat) => {
                    const active = todo.category === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setTodo({ ...todo, category: cat })}
                        className={`py-2.5 px-2 cursor-pointer rounded-xl text-xs font-semibold border transition-all duration-150
                          ${
                            active
                              ? `${CATEGORIES[cat].pill} border-transparent`
                              : dark
                                ? "border-slate-700 text-slate-400 hover:border-slate-600"
                                : "border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                      >
                        {EMOJI[cat]} {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer
                    bg-linear-to-r from-violet-600 to-pink-500 hover:opacity-90 active:scale-[0.98]
                    transition-all duration-150 shadow-lg shadow-violet-500/20"
                >
                  {editIndex !== null ? (
                    <Check size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  {editIndex !== null ? "Update Task" : "Add Task"}
                </button>
                {editIndex !== null && (
                  <button
                    onClick={cancelEdit}
                    className={`px-4 rounded-xl border transition-all duration-150 ${
                      dark
                        ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                        : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ─ Tasks Panel ─ */}
          <div className="flex flex-col gap-4">
            {/* Search & Filters */}
            <div
              className={`rounded-2xl p-4 ${dark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-100 shadow-sm"}`}
            >
              {/* Search + Status Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <div className="relative flex-1">
                  <Search
                    size={14}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-slate-400"}`}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tasks..."
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all duration-200
                      focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                      placeholder:text-slate-300 dark:placeholder:text-slate-600
                      ${dark ? "bg-slate-950 border-slate-700 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "active", "completed"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3.5 py-2.5 cursor-pointer border rounded-xl text-xs font-semibold capitalize transition-all duration-150 whitespace-nowrap
                        ${
                          filter === f
                            ? "bg-linear-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/20"
                            : dark
                              ? "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                              : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filters */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {["all", ...Object.keys(CATEGORIES)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatFilter(cat)}
                    className={`px-3.5 cursor-pointer border py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150
                      ${
                        catFilter === cat
                          ? cat === "all"
                            ? "bg-linear-to-r from-violet-600 to-pink-500 text-white shadow-sm"
                            : `${CATEGORIES[cat].pill}`
                          : dark
                            ? "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                      }`}
                  >
                    {cat === "all" ? "All" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-2.5">
              {filtered.length > 0 ? (
                filtered.map((task) => {
                  const cat = CATEGORIES[task.category];
                  const pri = PRIORITIES[task.priority];
                  return (
                    <div
                      key={task._origIdx}
                      className={`rounded-2xl p-4 border-l-4 ${cat.border} transition-all duration-200 hover:-translate-y-0.5
                        ${task.completed ? "opacity-50" : ""}
                        ${
                          dark
                            ? "bg-slate-900 border-t border-r border-b border-slate-800 hover:shadow-lg hover:shadow-black/20"
                            : "bg-white border-t border-r border-b border-slate-100 shadow-sm hover:shadow-md"
                        }`}
                    >
                      <div className="flex gap-3 items-start">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTask(task._origIdx)}
                          className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150
                            ${
                              task.completed
                                ? "bg-linear-to-br from-violet-600 to-pink-500 border-transparent"
                                : dark
                                  ? "border-slate-600 hover:border-violet-500"
                                  : "border-slate-300 hover:border-violet-400"
                            }`}
                        >
                          {task.completed && (
                            <Check
                              size={11}
                              className="text-white"
                              strokeWidth={3}
                            />
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold mb-2 leading-snug wrap-break-word
                            ${
                              task.completed
                                ? "line-through " +
                                  (dark ? "text-slate-500" : "text-slate-400")
                                : dark
                                  ? "text-slate-100"
                                  : "text-slate-800"
                            }`}
                          >
                            {task.name}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${pri.pill}`}
                            >
                              <Flag size={9} /> {task.priority}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cat.pill}`}
                            >
                              {task.category}
                            </span>
                            {task.dueDate && (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                                ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}
                              >
                                <Clock size={9} />
                                {new Date(task.dueDate).toLocaleDateString(
                                  "en-IN",
                                  { day: "2-digit", month: "short" },
                                )}{" "}
                                {new Date(task.dueDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              !task.completed && startEdit(task, task._origIdx)
                            }
                            disabled={task.completed}
                            className={`w-8 h-8 rounded-xl cursor-pointer flex items-center justify-center transition-all duration-150
                              ${
                                task.completed
                                  ? "opacity-30 cursor-not-allowed " +
                                    (dark ? "bg-slate-800" : "bg-slate-100")
                                  : dark
                                    ? "bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 hover:scale-105"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105"
                              }`}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => deleteTask(task._origIdx)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-105 cursor-pointer
                              ${dark ? "bg-red-900/40 text-red-400 hover:bg-red-900/60" : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  className={`rounded-2xl py-16 flex flex-col items-center justify-center text-center
                  ${dark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-100 shadow-sm"}`}
                >
                  <div
                    className="w-14 h-14 rounded-full bg-linear-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30
                    flex items-center justify-center mb-4"
                  >
                    <ListTodo size={24} className="text-violet-500" />
                  </div>
                  <h3
                    className={`text-base font-bold mb-1 ${dark ? "text-slate-200" : "text-slate-700"}`}
                  >
                    No tasks found
                  </h3>
                  <p
                    className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    {search
                      ? "Try a different search term"
                      : "Add your first task to get started!"}
                  </p>
                </div>
              )}
            </div>

            {/* Clear Completed */}
            {tasks.some((t) => t.completed) && (
              <button
                onClick={() => setTasks(tasks.filter((t) => !t.completed))}
                className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2
                  border transition-all duration-150 hover:opacity-80
                  ${
                    dark
                      ? "bg-red-900/20 text-red-400 border-red-900/40 hover:bg-red-900/30"
                      : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                  }`}
              >
                <Trash2 size={14} /> Clear All Completed
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p
          className={`text-center text-xs mt-10 ${dark ? "text-slate-600" : "text-slate-400"}`}
        >
          Built with ❤️ by{" "}
          <span className="font-bold bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            Rohtash Poonia
          </span>
        </p>
      </div>
    </div>
  );
}
