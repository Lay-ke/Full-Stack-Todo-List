import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

const useUpdateTodo = (setTodos) => {
  const [isLoading, setIsLoading] = useState(false);

  const updateTodo = async (todo) => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${API_BASE_URL}/api/todos/${todo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ strStatus: !todo.strStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item._id === todo._id
            ? { ...todo, strStatus: !todo.strStatus }
            : item
        )
      );
    } catch (error) {
      CustomErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTodo, isUpdatingTodo: isLoading };
};

export default useUpdateTodo;
