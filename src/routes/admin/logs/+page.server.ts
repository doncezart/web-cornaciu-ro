import { db } from '$lib/server/db';
import { auditLog } from '$lib/server/db/schema';
import { desc, eq, and, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 50;

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('pagina')) || 1);
	const entityFilter = url.searchParams.get('entitate') || '';
	const actionFilter = url.searchParams.get('actiune') || '';

	const conditions = [];
	if (entityFilter) conditions.push(eq(auditLog.entity, entityFilter));
	if (actionFilter) conditions.push(sql`${auditLog.action} LIKE ${actionFilter + '%'}`);

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [{ count }] = await db
		.select({ count: sql<number>`count(*)` })
		.from(auditLog)
		.where(where);

	const totalPages = Math.max(1, Math.ceil(Number(count) / PAGE_SIZE));

	const logs = await db
		.select()
		.from(auditLog)
		.where(where)
		.orderBy(desc(auditLog.createdAt))
		.limit(PAGE_SIZE)
		.offset((page - 1) * PAGE_SIZE);

	// Get distinct entities for filter dropdown
	const entities = await db
		.selectDistinct({ entity: auditLog.entity })
		.from(auditLog)
		.orderBy(auditLog.entity);

	return {
		logs: logs.map((l) => ({
			...l,
			details: l.details as Record<string, unknown> | null,
			createdAt: l.createdAt?.toISOString() ?? null
		})),
		page,
		totalPages,
		totalCount: Number(count),
		entityFilter,
		actionFilter,
		entities: entities.map((e) => e.entity)
	};
};
