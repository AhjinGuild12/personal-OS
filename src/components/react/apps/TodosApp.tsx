import React, { useState, useRef } from 'react';
import { playClick } from '../../../utils/sounds';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodosApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = () => {
    const text = inputValue.trim();
    if (!text) return;

    setTodos((prev) => [
      { id: Date.now().toString(), text, completed: false },
      ...prev,
    ]);
    setInputValue('');
    playClick();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    playClick();
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    playClick();
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Input area */}
      <div className="p-4 border-b-[3px] border-black bg-white">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTodo();
          }}
          placeholder="what needs to be done?"
          className="w-full px-4 py-3 text-lg border-[3px] border-black
                     bg-white placeholder-gray-400 font-bold
                     focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     transition-shadow duration-75"
        />
      </div>

      {/* Todo list */}
      <div className="flex-1 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-lg font-bold select-none">
              no todos yet
            </p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center gap-3 p-3 border-[3px] border-black
                           transition-all duration-75
                           ${todo.completed
                             ? 'bg-gray-100 shadow-none'
                             : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                           }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-7 h-7 flex-shrink-0 border-[3px] border-black flex items-center justify-center
                             transition-all duration-75
                             active:translate-x-[1px] active:translate-y-[1px]
                             ${todo.completed
                               ? 'bg-[#e07a5f]'
                               : 'bg-white hover:bg-[#fdf6e3]'
                             }`}
                >
                  {todo.completed && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {/* Text */}
                <span
                  className={`flex-1 font-bold text-base leading-tight
                             ${todo.completed
                               ? 'line-through text-gray-400'
                               : 'text-black'
                             }`}
                >
                  {todo.text}
                </span>

                {/* Delete */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="w-7 h-7 flex-shrink-0 border-[3px] border-black bg-white
                             flex items-center justify-center
                             opacity-0 group-hover:opacity-100
                             hover:bg-[#e07a5f] hover:text-white
                             active:translate-x-[1px] active:translate-y-[1px]
                             transition-all duration-75"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer — only show when there are todos */}
      {todos.length > 0 && (
        <div className="px-4 py-2 border-t-[3px] border-black bg-[#fdf6e3]
                        flex items-center justify-between">
          <span className="text-sm font-bold text-gray-600">
            {completedCount}/{todos.length} done
          </span>
          {completedCount > 0 && (
            <button
              onClick={() => {
                setTodos((prev) => prev.filter((t) => !t.completed));
                playClick();
              }}
              className="text-sm font-black text-[#e07a5f] hover:underline
                         active:translate-y-[1px] transition-transform duration-75"
            >
              clear completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TodosApp;
