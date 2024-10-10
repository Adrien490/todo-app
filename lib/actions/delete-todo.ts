"use server";
import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import db from "../db";
import { actionClient } from "../safe-action";

const deleteTodoSchema = z.object({
	id: z.string().uuid("ID de Todo invalide."),
});

const deleteTodoAction = actionClient
	.schema(deleteTodoSchema, {
		handleValidationErrorsShape: (ve) =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput: { id } }) => {
		try {
			await db.todo.delete({
				where: { id },
			});

			return {
				status: "200",
				message: "Tâche supprimée avec succès.",
			};
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(
					"Une erreur est survenue lors de la suppression de la tâche."
				);
			} else {
				throw new Error("Une erreur inconnue est survenue.");
			}
		}
	});

export default deleteTodoAction;
