import { db } from '$lib/server/db';
import { auditLog } from '$lib/server/db/schema';

type AuditEntry = {
	action: string;
	entity: string;
	entityId?: string | number | null;
	details?: Record<string, unknown>;
	user?: { id?: string; email?: string } | null;
};

export async function audit({ action, entity, entityId, details, user }: AuditEntry) {
	await db.insert(auditLog).values({
		action,
		entity,
		entityId: entityId != null ? String(entityId) : null,
		details: details ?? null,
		userId: user?.id ?? null,
		userEmail: user?.email ?? null
	});
}
