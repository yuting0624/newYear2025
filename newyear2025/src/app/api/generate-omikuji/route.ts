import { generateWithGemini } from '@/utils/gemini';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const systemPrompt = `あなたは日本の神社のおみくじを引く体験を提供します。
    出力は簡潔に、絵文字を使って親しみやすく表現してください。
    ユーザーの名前と目標を考慮して、以下の形式で運勢を簡潔に出力してください：

    運勢：[大吉/吉/中吉/小吉/末吉/凶]

    願い事：[ユーザーの目標に関連した具体的な内容]
    仕事：[ユーザーの目標に関連した具体的なアドバイス]
    学問：[ユーザーの目標に関連した具体的なアドバイス]
    恋愛：[ユーザーの目標に関連した具体的なアドバイス]
    健康：[ユーザーの目標に関連した具体的なアドバイス]

    総合アドバイス：[全体的な助言と励まし]`;

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    const omikuji = await generateWithGemini(fullPrompt);
    
    return NextResponse.json({ omikuji });
  } catch (error) {
    console.error('Error in omikuji generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate omikuji' },
      { status: 500 }
    );
  }
}

