import React, { useState, useEffect } from 'react';
    import { 
      CheckCircle2, 
      Circle, 
      Trash2, 
      Plus, 
      Search, 
      SlidersHorizontal, 
      Calendar, 
      AlertCircle, 
      Tag, 
      CheckSquare, 
      Edit3, 
      X, 
      RotateCcw,
      Sparkles,
      Check
    } from 'lucide-react';

    const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Fitness', 'Others'];
    const PRIORITIES = {
      Low: { label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
      Medium: { label: 'Medium', color: 'bg-amber-100 text-amber-800 border-amber-200' },
      High: { label: 'High', color: 'bg-rose-100 text-rose-800 border-rose-200' }
    };

    export default function App() {
      // Load initial state from localstorage
      const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [
          {
            id: '1',
            text: 'Welcome to your Task Planner! Try creating a new todo.',
            completed: false,
            priority: 'Medium',
            category: 'Personal',
            dueDate: new Date().toISOString().split('T')[0]
          },
          {
            id: '2',
            text: 'Completed tasks show up with a line-through styling.',
            completed: true,
            priority: 'Low',
            category: 'Work',
            dueDate: new Date().toISOString().split('T')[0]
          }
        ];
      });

      // Form States
      const [newText, setNewText] = useState('');
      const [newPriority, setNewPriority] = useState('Medium');
      const [newCategory, setNewCategory] = useState('Work');
      const [newDueDate, setNewDueDate] = useState('');

      // Editing States
      const [editingId, setEditingId] = useState(null);
      const [editText, setEditText] = useState('');
      const [editPriority, setEditPriority] = useState('Medium');
      const [editCategory, setEditCategory] = useState('Work');
      const [editDueDate, setEditDueDate] = useState('');

      // Filter and Sort States
      const [searchQuery, setSearchQuery] = useState('');
      const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Active' | 'Completed'
      const [filterCategory, setFilterCategory] = useState('All');
      const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'status'

      // Save to localStorage
      useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
      }, [todos]);

      // Add Todo
      const handleAddTodo = (e) => {
        e.preventDefault();
        if (!newText.trim()) return;

        const newTodo = {
          id: Date.now().toString(),
          text: newText.trim(),
          completed: false,
          priority: newPriority,
          category: newCategory,
          dueDate: newDueDate || new Date().toISOString().split('T')[0]
        };

        setTodos([newTodo, ...todos]);
        setNewText('');
        setNewPriority('Medium');
        setNewCategory('Work');
        setNewDueDate('');
      };

      // Toggle Todo Complete
      const handleToggleComplete = (id) => {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      };

      // Delete Todo
      const handleDeleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
      };

      // Start Editing
      const handleStartEdit = (todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
        setEditPriority(todo.priority);
        setEditCategory(todo.category);
        setEditDueDate(todo.dueDate);
      };

      // Save Editing
      const handleSaveEdit = (id) => {
        if (!editText.trim()) return;
        setTodos(todos.map(todo => 
          todo.id === id 
            ? { ...todo, text: editText.trim(), priority: editPriority, category: editCategory, dueDate: editDueDate }
            : todo
        ));
        setEditingId(null);
      };

      // Cancel Editing
      const handleCancelEdit = () => {
        setEditingId(null);
      };

      // Clear Completed
      const handleClearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
      };

      // Computed Values
      const completedCount = todos.filter(t => t.completed).length;
      const totalCount = todos.length;
      const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      // Filter and Sort Processing
      const filteredTodos = todos
        .filter(todo => {
          const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = 
            filterStatus === 'All' ? true :
            filterStatus === 'Completed' ? todo.completed : !todo.completed;
          const matchesCategory = 
            filterCategory === 'All' ? true : todo.category === filterCategory;

          return matchesSearch && matchesStatus && matchesCategory;
        })
        .sort((a, b) => {
          if (sortBy === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
          }
          if (sortBy === 'priority') {
            const priorityWeight = { High: 3, Medium: 2, Low: 1 };
            return priorityWeight[b.priority] - priorityWeight[a.priority];
          }
          if (sortBy === 'status') {
            return (a.completed ? 1 : 0) - (b.completed ? 0 : 1);
          }
          return 0;
        });

      return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-600 font-bold text-sm tracking-wider uppercase mb-1">
                  <Sparkles className="w-4 h-4" /> Keep on track
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  Task Planner
                </h1>
                <p className="mt-1 text-slate-500">
                  Organize your daily workflows, priorities, and deadlines efficiently.
                </p>
              </div>

              {/* Progress Panel */}
              <div className="mt-4 sm:mt-0 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[240px]">
                <div className="relative flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                    <circle cx="32" cy="32" r="28" stroke="#6366f1" strokeWidth="6" fill="transparent"
                      strokeDasharray={175}
                      strokeDashoffset={175 - (175 * completionRate) / 100}
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <span className="absolute text-sm font-semibold text-indigo-600">{completionRate}%</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Your Progress</h4>
                  <p className="text-xs text-slate-500">{completedCount} of {totalCount} completed</p>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-600" /> Create Task
                  </h3>
                  <form onSubmit={handleAddTodo} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Task Title</label>
                      <input
                        type="text"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Priority</label>
                        <select
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value)}
                          className="w-full px-2 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-2 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition duration-150 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Task
                    </button>
                  </form>
                </div>
              </div>

              {/* Todo List Area */}
              <div className="lg:col-span-8 space-y-4">
                {/* Search & Filter Toolbar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="dueDate">Sort: Due Date</option>
                        <option value="priority">Sort: Priority</option>
                        <option value="status">Sort: Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    {/* Status Tabs */}
                    <div className="flex gap-1">
                      {['All', 'Active', 'Completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                            filterStatus === status
                              ? 'bg-indigo-50 text-indigo-700 font-semibold'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    {/* Clear completed */}
                    {completedCount > 0 && (
                      <button
                        onClick={handleClearCompleted}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear Completed
                      </button>
                    )}
                  </div>
                </div>

                {/* Todo List */}
                <div className="space-y-3">
                  {filteredTodos.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckSquare className="w-6 h-6 text-slate-400" />
                      </div>
                      <h4 className="text-slate-700 font-medium">No tasks found</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        Try modifying your filters or add a new task to get started!
                      </p>
                    </div>
                  ) : (
                    filteredTodos.map((todo) => {
                      const isEditing = editingId === todo.id;
                      const priorityStyle = PRIORITIES[todo.priority] || PRIORITIES.Low;

                      return (
                        <div
                          key={todo.id}
                          className={`bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md duration-150 ${
                            todo.completed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200'
                          }`}
                        >
                          {isEditing ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              <div className="flex flex-wrap gap-2 items-center justify-between">
                                <div className="flex gap-2">
                                  <select
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(e.target.value)}
                                    className="px-2 py-1.5 border border-slate-200 rounded-md text-xs bg-white"
                                  >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                  </select>
                                  <select
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    className="px-2 py-1.5 border border-slate-200 rounded-md text-xs bg-white"
                                  >
                                    {CATEGORIES.map(cat => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                  <input
                                    type="date"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                    className="px-2 py-1 border border-slate-200 rounded-md text-xs"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveEdit(todo.id)}
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Save
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-semibold flex items-center gap-1"
                                  >
                                    <X className="w-3.5 h-3.5" /> Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => handleToggleComplete(todo.id)}
                                className="mt-0.5 text-slate-400 hover:text-indigo-600 transition flex-shrink-0"
                              >
                                {todo.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
                                } break-words`}>
                                  {todo.text}
                                </p>

                                {/* Badges and Meta */}
                                <div className="flex flex-wrap gap-2 items-center mt-2.5 text-xs">
                                  {/* Priority Tag */}
                                  <span className={`px-2 py-0.5 rounded-full font-semibold border ${priorityStyle.color}`}>
                                    {todo.priority}
                                  </span>

                                  {/* Category Tag */}
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-slate-600 bg-slate-100 border border-slate-200">
                                    <Tag className="w-3 h-3 text-slate-400" />
                                    {todo.category}
                                  </span>

                                  {/* Due Date Indicator */}
                                  <span className="flex items-center gap-1 text-slate-500 ml-1">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    <span>{todo.dueDate}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                <button
                                  onClick={() => handleStartEdit(todo)}
                                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-50 transition"
                                  title="Edit Task"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTodo(todo.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-50 transition"
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }