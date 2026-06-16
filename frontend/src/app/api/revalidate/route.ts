import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  revalidatePath('/');
  revalidatePath('/vacatures');

  return NextResponse.json({
    revalidated: true,
  });
}
