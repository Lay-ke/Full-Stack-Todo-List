import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { defaultTodo } from "../../utils/general.js";
import useAddTodo from "../../hooks/useAddTodo.js";

const AddTodoForm = ({ fetchTodos, page, limit }) => {
  // let [newTodo, setNewTodo] = useState(defaultTodo);
  let [newTodo, setNewTodo] = useState({
    "title": "",
    "description": "",
    "activity": "",
    "date": "",
    "strStatus": ""
  });

  const { addTodo, isAddingTodo } = useAddTodo(
    fetchTodos,
    page,
    limit,
    setNewTodo
  );

  let isValidateInputs =
    newTodo.title.length < 10 || newTodo.description.length < 15;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await addTodo({ ...newTodo });
    } catch (ex) {
      console.log("catch me ", ex);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexGrow: 1,
        height: "70px",
        gap: 4,
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        id="title"
        name="title"
        label="Todo Title"
        variant="outlined"
        value={newTodo.title}
        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        error={newTodo.title.length > 0 && newTodo.title.length < 10}
        helperText={
          newTodo.title.length > 0 && newTodo.title.length < 10
            ? "Title must be at least 10 characters"
            : ""
        }
        sx={{
          width: "30%",
        }}
      />
      <TextField
        id="description"
        name="description"
        label="Todo Description"
        variant="outlined"
        value={newTodo.description}
        onChange={(e) =>
          setNewTodo({ ...newTodo, description: e.target.value })
        }
        error={
          newTodo.description.length > 0 && newTodo.description.length < 15
        }
        helperText={
          newTodo.description.length > 0 && newTodo.description.length < 15
            ? "Description must be at least 15 characters"
            : ""
        }
        sx={{
          flexGrow: 1,
        }}
      />
      <TextField
        id="activity"
        name="activity"
        label="Activity"
        variant="outlined"
        value={newTodo.activity}
        onChange={(e) => setNewTodo({ ...newTodo, activity: e.target.value })}
        sx={{
          width: "20%",
        }}
      />
      <TextField
        id="date"
        name="date"
        label="Date"
        type="date"
        variant="outlined"
        value={newTodo.date}
        onChange={(e) => setNewTodo({ ...newTodo, date: e.target.value })}
        InputLabelProps={{ shrink: true }}
        sx={{
          width: "18%",
        }}
      />
      <TextField
        id="strStatus"
        name="strStatus"
        label="Status"
        variant="outlined"
        value={newTodo.strStatus}
        onChange={(e) => setNewTodo({ ...newTodo, strStatus: e.target.value })}
        sx={{
          width: "15%",
        }}
      />
      <LoadingButton
        loading={isAddingTodo}
        variant="contained"
        size="large"
        type="submit"
        disabled={isValidateInputs}
        sx={{
          p: "14px",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        }}
      >
        Add Todo
      </LoadingButton>
    </Box>
  );
};

export default AddTodoForm;
