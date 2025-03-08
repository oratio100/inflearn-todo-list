"use client";

import { Checkbox, IconButton, Spinner } from "@material-tailwind/react";
import { deleteTodo, updateTodo } from "actions/todo-actions";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "config/ReactQueryClientProvider";
import formatDate from "utils/formatDate";

export default function Todo({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setCompleted] = useState(todo.completed);
  const [title, setTitle] = useState(todo.title);

  const createdTime = formatDate(todo.created_at);
  const completedTime = todo.completed_at
    ? formatDate(todo.completed_at)
    : null;

  const updateTodoMutation = useMutation({
    mutationFn: async () => {
      if (title.trim() === "") {
        alert("제목을 입력해주세요!");
        return;
      }
      await updateTodo({
        id: todo.id,
        title,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      if (title.trim() !== "") {
        setIsEditing(false);
        queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
      }
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  return (
    <div className="w-full flex items-center gap-2">
      <Checkbox
        checked={completed}
        onChange={async (e) => {
          await setCompleted(e.target.checked);
          await updateTodoMutation.mutate();
        }}
      />
      {isEditing ? (
        <input
          className="flex-1 border-b-black border-b pb-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <div className="flex-1 flex items-center gap-4">
          <p className={`${completed && "line-through"}`}>{title}</p>
          <div className="flex flex-col">
            <p className="text-gray-600 font-thin text-xs">
              생성: {createdTime}
            </p>
            {completedTime && (
              <p className="text-gray-600 font-thin text-xs">
                완료: {completedTime}
              </p>
            )}
          </div>
        </div>
      )}

      {isEditing ? (
        <IconButton
          onClick={async () => {
            await updateTodoMutation.mutate();
          }}
        >
          {updateTodoMutation.isPending ? (
            <Spinner />
          ) : (
            <i className="fas fa-check" />
          )}
        </IconButton>
      ) : (
        <IconButton onClick={() => setIsEditing(true)}>
          <i className="fas fa-pen" />
        </IconButton>
      )}

      <IconButton onClick={() => deleteTodoMutation.mutate()}>
        {deleteTodoMutation.isPending ? (
          <Spinner />
        ) : (
          <i className="fas fa-trash" />
        )}
      </IconButton>
    </div>
  );
}
