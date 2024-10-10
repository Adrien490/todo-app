// actions/createTodoAction.ts

"use server";
import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import db from "../db";
import { actionClient } from "../safe-action";

const createTodoSchema = z.object({
	title: z.string().min(1, "Le titre est requis."),
});

const createTodoAction = actionClient
	.schema(createTodoSchema, {
		handleValidationErrorsShape: (ve) =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput: { title } }) => {
		try {
			const todo = await db.todo.create({
				data: {
					title,
				},
			});

			return {
				status: "200",
				data: todo,
			};
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(
					"Une erreur est survenue lors de la création de la tâche."
				);
			} else {
				throw new Error("Une erreur inconnue est survenue.");
			}
		}
	});

export default createTodoAction;
