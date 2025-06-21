import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

const useGetTodos = (setTodos, setNumOfPages, setPage) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${API_BASE_URL}/api/gettodos`
      );
      const data = await response.json();
      setTodos(data.todoList);
    } catch (error) {
      CustomErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchTodos, isFetchingTodos: isLoading };
};

export default useGetTodos;
