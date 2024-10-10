"use server";

import db from "./db";

const getTodos = async () => {
	return await db.todo.findMany();
};

export default getTodos;
