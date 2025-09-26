import { getTableColumns, SQL, sql } from 'drizzle-orm';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';

/** https://orm.drizzle.team/docs/guides/upsert */
export const buildConflictUpdateColumns = <
	T extends SQLiteTable,
	Q extends keyof T['_']['columns'],
>(
	table: T,
	columns: Q[],
) => {
	const cls = getTableColumns(table);

	return columns.reduce(
		(acc, column) => {
			const colName = cls[column].name;
			acc[column] = sql.raw(`excluded.${colName}`);

			return acc;
		},
		{} as Record<Q, SQL>,
	);
};
