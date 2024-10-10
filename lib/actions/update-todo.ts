"use server";
import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import db from "../db";
import { actionClient } from "../safe-action";

const updateTodoSchema = z.object({
	id: z.string().uuid("ID de Todo invalide."),
	title: z.string().optional(),
	done: z.boolean().optional(),
});

const updateTodoAction = actionClient
	.schema(updateTodoSchema, {
		handleValidationErrorsShape: (ve) =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput: { id, title, done } }) => {
		try {
			const todo = await db.todo.update({
				where: { id },
				data: {
					...(title !== undefined && { title }),
					...(done !== undefined && { done }),
				},
			});

			return {
				status: "200",
				data: todo,
			};
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(
					"Une erreur est survenue lors de la mise à jour de la tâche."
				);
			} else {
				throw new Error("Une erreur inconnue est survenue.");
			}
		}
	});

export default updateTodoAction;
