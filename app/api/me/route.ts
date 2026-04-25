import { NextResponse } from "next/server";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { users, accounts, sessions, transactions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// DELETE /api/me — hesabı anonim et (ianə tarixçəsi şəffaflıq üçün saxlanılır)
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Anonim ianə qeydlərini saxla — yalnız donorUserId əlaqəsini kəs
  await db
    .update(transactions)
    .set({ donorUserId: null, donorName: null })
    .where(eq(transactions.donorUserId, userId));

  // OAuth hesablarını və sessionları sil
  await db.delete(accounts).where(eq(accounts.userId, userId));
  await db.delete(sessions).where(eq(sessions.userId, userId));

  // İstifadəçini sil
  await db.delete(users).where(eq(users.id, userId));

  return NextResponse.json({ ok: true });
}
