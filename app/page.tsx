"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import createTodoAction from "@/lib/actions/create-todo";
import deleteTodoAction from "@/lib/actions/delete-todo";
import updateTodoAction from "@/lib/actions/update-todo";
import getTodos from "@/lib/get-todos";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Trash, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

const Page = () => {
	const [title, setTitle] = useState("");
	const queryClient = useQueryClient();
	const {
		execute: executeCreate,
		isExecuting: isExecutingCreate,
		reset: resetCreate,
	} = useAction(createTodoAction, {
		onSuccess: ({ input, data }) => {
			console.log(input, data);
			resetCreate();
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	// action delete
	const {
		execute: executeDelete,
		isExecuting: isExecutingDelete,
		reset: resetDelete,
	} = useAction(deleteTodoAction, {
		onSuccess: ({ input, data }) => {
			console.log(input, data);
			resetDelete();
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});
	const todos = useQuery({
		queryKey: ["todos"],
		queryFn: () => getTodos(),
	});

	// action update
	const { execute: executeUpdate, reset: resetUpdate } = useAction(
		updateTodoAction,
		{
			onSuccess: ({ input, data }) => {
				console.log(input, data);
				resetUpdate();
				queryClient.invalidateQueries({ queryKey: ["todos"] });
			},
		}
	);

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
			<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
				<h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
					Ma Todo List 2
				</h1>
				<form
					className="flex gap-3 mb-6"
					onSubmit={(e) => {
						e.preventDefault();
						executeCreate({ title: title });
					}}
				>
					<Input
						type="text"
						className="flex-1"
						placeholder="Ajouter une tâche"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<Button
						type="submit"
						disabled={isExecutingCreate}
						className="bg-blue-600 text-white"
					>
						{isExecutingCreate ? "Ajout..." : "Ajouter"}
					</Button>
				</form>
				<div className="flex flex-col gap-4 h-96 overflow-y-auto border-t pt-4">
					{todos.data?.map((todo) => (
						<div
							className="bg-gray-50 p-4 flex justify-between items-center rounded-lg shadow-sm transition-transform hover:scale-105"
							key={todo.id}
						>
							<span
								className={`text-lg ${
									todo.done ? "line-through text-gray-500" : "text-gray-800"
								}`}
							>
								{todo.title}
							</span>
							<div className="flex gap-2">
								<Button
									variant="ghost"
									className={cn(
										"hover:bg-none text-white",
										todo.done ? "bg-green-500" : "bg-red-500"
									)}
									onClick={() =>
										executeUpdate({ id: todo.id, done: !todo.done })
									}
								>
									{todo.done ? (
										<Check className="w-5 h-5" />
									) : (
										<X className="w-5 h-5" />
									)}
								</Button>
								<Button
									variant="outline"
									className="border border-red-500 text-red-500"
									disabled={isExecutingDelete}
									onClick={() => executeDelete({ id: todo.id })}
								>
									<Trash className="w-5 h-5" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Page;
