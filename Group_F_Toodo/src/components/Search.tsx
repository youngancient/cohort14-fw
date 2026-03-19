import { useState } from 'react';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface SearchProps {
  todos: Todo[];
  onSearchChange?: (results: Todo[]) => void;
}

export function Search({ todos, onSearchChange }: SearchProps) {
  const [query, setQuery] = useState('');

  const searchTodos = (searchQuery: string): Todo[] => {
    if (!searchQuery.trim()) {
      return todos;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(lowerQuery) ||
      (todo.description?.toLowerCase().includes(lowerQuery) ?? false)
    );
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    const results = searchTodos(value);
    onSearchChange?.(results);
  };

  const clearSearch = () => {
    setQuery('');
    onSearchChange?.(todos);
  };

  return {
    query,
    searchTodos,
    handleSearch,
    clearSearch,
    results: searchTodos(query),
  };
}
